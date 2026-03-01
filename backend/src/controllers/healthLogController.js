const healthLogService = require('../services/healthLogService');

exports.createLog = async (req, res) => {
    const { log_type, value, notes } = req.body;

    try {
        const response = await healthLogService.createLog(req.user.id, log_type, value, notes);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving log' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const response = await healthLogService.getLogs();
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

exports.deleteLog = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await healthLogService.deleteLog(id);
        res.json(response);
    } catch (err) {
        console.error(err);
        if (err.message === 'Log not found or access denied') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
