const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (Requires at least a partial token)
// verifyToken sets user context. Auth flow handled by controller logic based on token scope.
router.get('/mfa/setup', verifyToken, authController.setupMFA);
router.post('/mfa/verify', verifyToken, authController.verifyMFA);

module.exports = router;
