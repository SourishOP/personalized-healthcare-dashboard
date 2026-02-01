const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('../../security/db');

// Helper to generate JWT
const generateToken = (userId, scope = 'full', expiresIn = '15m') => {
    return jwt.sign(
        { id: userId, scope },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

// 1. Register User
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await argon2.hash(password);

        // Insert user - RLS is bypassed or allows INSERT usually, but 'db.query' without user triggers 'public' mode
        // For 'register', we don't have a user context yet, which is correct.
        const result = await db.query(
            `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
            [email, hashedPassword]
        );

        const newUser = result.rows[0];

        // Return token with 'mfa_setup' scope to force MFA creation
        const token = generateToken(newUser.id, 'mfa_setup', '1h');

        res.status(201).json({
            message: 'User registered. Please set up MFA.',
            token,
            requireMfaSetup: true
        });

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Email already exists.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query users using 'public' context (no RLS isolation needed for finding user by email)
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        if (await argon2.verify(user.password_hash, password)) {
            // Check MFA status
            // If mfa_secret is null, they must setup MFA
            if (!user.mfa_secret) {
                const token = generateToken(user.id, 'mfa_setup', '1h');
                return res.json({
                    message: 'Login successful. MFA setup required.',
                    token,
                    requireMfaSetup: true
                });
            } else {
                // If mfa_secret exists, they must VERIFY MFA
                const token = generateToken(user.id, 'mfa_verify', '15m');
                return res.json({
                    message: 'Login successful. MFA code required.',
                    token,
                    requireMfaVerify: true
                });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Setup MFA (Generates Secret & QR)
exports.setupMFA = async (req, res) => {
    if (req.user.scope !== 'mfa_setup') {
        return res.status(403).json({ message: 'Invalid scope for MFA setup.' });
    }

    try {
        const secret = speakeasy.generateSecret({
            length: 20,
            name: 'HealthcareDashboard'
        });
        const url = await QRCode.toDataURL(secret.otpauth_url);

        // Save secret to DB (In a real app, might want to verify confirmation first, but saving pending is ok)
        // Note: RLS is active here because we are in 'verifyToken' context! 
        // 'users_isolation_policy' ensures user can only update their own row.
        await db.query(
            'UPDATE users SET mfa_secret = $1 WHERE id = $2',
            [secret.base32, req.user.id] // Store as base32
        );

        res.json({
            secret: secret.base32,
            qr_code: url,
            message: 'Scan QR code and verify with code.'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Verify MFA (Enable full access)
exports.verifyMFA = async (req, res) => {
    // Allows both 'mfa_verify' (login flow) and 'mfa_setup' (registration flow) scopes
    if (!['mfa_verify', 'mfa_setup'].includes(req.user.scope)) {
        return res.status(403).json({ message: 'Invalid scope for MFA verification.' });
    }

    const { code } = req.body;

    try {
        // Fetch secret from DB
        const result = await db.query('SELECT mfa_secret FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user || !user.mfa_secret) {
            return res.status(400).json({ message: 'MFA not set up.' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.mfa_secret,
            encoding: 'base32',
            token: code
        });

        if (verified) {
            // Success! Issue full access token
            const token = generateToken(req.user.id, 'full', '15m'); // Short lived access token

            // If checking "mfa_enabled" flag, set it here. We just rely on secret existence + valid verify.

            res.json({
                message: 'MFA Verified. Authenticated.',
                token,
                status: 'success'
            });
        } else {
            res.status(401).json({ message: 'Invalid MFA code.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
