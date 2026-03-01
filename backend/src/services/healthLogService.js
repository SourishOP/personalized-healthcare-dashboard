const healthLogRepository = require('../repositories/healthLogRepository');

const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'development-fallback-secret-key';

class HealthLogService {
    async createLog(userId, logType, value, notes) {
        return await healthLogRepository.create(userId, logType, value, notes, DB_ENCRYPTION_KEY);
    }

    async getLogs() {
        return await healthLogRepository.findByUserId(DB_ENCRYPTION_KEY);
    }

    async deleteLog(id) {
        const deletedRows = await healthLogRepository.deleteById(id);
        if (deletedRows.length === 0) {
            throw new Error('Log not found or access denied');
        }
        return { message: 'Log deleted' };
    }
}

module.exports = new HealthLogService();
