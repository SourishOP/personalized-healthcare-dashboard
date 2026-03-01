const authService = require('../services/authService');

// 1. Register User
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await authService.registerUser(email, password);
        res.status(201).json(response);
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
        const response = await authService.loginUser(email, password);
        return res.json(response);
    } catch (err) {
        console.error(err);
        if (err.message === 'Invalid credentials') {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Setup MFA (Generates Secret & QR)
exports.setupMFA = async (req, res) => {
    if (req.user.scope !== 'mfa_setup') {
        return res.status(403).json({ message: 'Invalid scope for MFA setup.' });
    }

    try {
        const response = await authService.setupMFA(req.user.id);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Verify MFA (Enable full access)
exports.verifyMFA = async (req, res) => {
    if (!['mfa_verify', 'mfa_setup'].includes(req.user.scope)) {
        return res.status(403).json({ message: 'Invalid scope for MFA verification.' });
    }

    const { code } = req.body;

    try {
        const response = await authService.verifyMFA(req.user.id, code);
        res.json(response);
    } catch (err) {
        console.error(err);
        if (err.message === 'MFA not set up.' || err.message === 'Invalid MFA code.') {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
