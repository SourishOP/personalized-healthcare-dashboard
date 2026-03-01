const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const userRepository = require('../repositories/userRepository');

class AuthService {
    generateToken(userId, scope = 'full', expiresIn = '15m') {
        return jwt.sign(
            { id: userId, scope },
            process.env.JWT_SECRET,
            { expiresIn }
        );
    }

    async registerUser(email, password) {
        const hashedPassword = await argon2.hash(password);
        const newUser = await userRepository.createUser(email, hashedPassword);
        const token = this.generateToken(newUser.id, 'mfa_setup', '1h');

        return {
            message: 'User registered. Please set up MFA.',
            token,
            requireMfaSetup: true
        };
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (await argon2.verify(user.password_hash, password)) {
            if (!user.mfa_secret) {
                const token = this.generateToken(user.id, 'mfa_setup', '1h');
                return {
                    message: 'Login successful. MFA setup required.',
                    token,
                    requireMfaSetup: true
                };
            } else {
                const token = this.generateToken(user.id, 'mfa_verify', '15m');
                return {
                    message: 'Login successful. MFA code required.',
                    token,
                    requireMfaVerify: true
                };
            }
        } else {
            throw new Error('Invalid credentials');
        }
    }

    async setupMFA(userId) {
        const secret = speakeasy.generateSecret({
            length: 20,
            name: 'HealthcareDashboard'
        });
        const url = await QRCode.toDataURL(secret.otpauth_url);

        await userRepository.updateMfaSecret(userId, secret.base32);

        return {
            secret: secret.base32,
            qr_code: url,
            message: 'Scan QR code and verify with code.'
        };
    }

    async verifyMFA(userId, code) {
        const user = await userRepository.getMfaSecret(userId);

        if (!user || !user.mfa_secret) {
            throw new Error('MFA not set up.');
        }

        const verified = speakeasy.totp.verify({
            secret: user.mfa_secret,
            encoding: 'base32',
            token: code
        });

        if (verified) {
            const token = this.generateToken(userId, 'full', '15m');
            return {
                message: 'MFA Verified. Authenticated.',
                token,
                status: 'success'
            };
        } else {
            throw new Error('Invalid MFA code.');
        }
    }
}

module.exports = new AuthService();
