const jwt = require('jsonwebtoken');
const db = require('../../security/db');

/**
 * Middleware to verify JWT token.
 * Extracs user ID and sets it in the AsyncLocalStorage context for RLS.
 * Enforces valid signature and expiration.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach to request for controllers

        // Run the rest of the request pipeline within the DB User Context (for RLS)
        db.runWithUser(decoded.id, () => {
            next();
        });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

/**
 * Middleware to ensure the user has completed MFA (Full Access scope).
 */
const requireFullAccess = (req, res, next) => {
    if (!req.user || req.user.scope !== 'full') {
        return res.status(403).json({ message: 'MFA verification required.' });
    }
    next();
};

module.exports = {
    verifyToken,
    requireFullAccess
};
