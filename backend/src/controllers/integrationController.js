const fitnessService = require('../services/fitnessService');

exports.getGoogleAuthUrl = (req, res) => {
    const url = fitnessService.getAuthUrl();
    res.json({ url });
};

exports.googleCallback = async (req, res) => {
    const { code } = req.body;

    try {
        const data = await fitnessService.syncData(code, req.user.id);
        res.json({ message: 'Data synced successfully', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sync failed' });
    }
};
