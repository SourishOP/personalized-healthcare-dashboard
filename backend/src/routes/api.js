const express = require('express');
const router = express.Router();
const healthLogController = require('../controllers/healthLogController');
const remindersService = require('../services/remindersService');
const integrationController = require('../controllers/integrationController');
const { verifyToken, requireFullAccess } = require('../middleware/authMiddleware');

// Initialize services (e.g. create tables)
remindersService.init().catch(console.error);

// Protect all API routes with Full Access requirement
router.use(verifyToken);
router.use(requireFullAccess);

// Health Logs
router.post('/logs', healthLogController.createLog);
router.get('/logs', healthLogController.getLogs);
router.delete('/logs/:id', healthLogController.deleteLog);

// Reminders
router.post('/reminders', remindersService.createReminder);
router.get('/reminders', remindersService.getReminders);

// Integrations
router.get('/integration/google/auth-url', integrationController.getGoogleAuthUrl);
router.post('/integration/google/sync', integrationController.googleCallback);

module.exports = router;
