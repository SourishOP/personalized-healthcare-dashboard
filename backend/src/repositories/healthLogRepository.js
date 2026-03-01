const db = require('../../security/db');

class HealthLogRepository {
    async create(userId, logType, value, notes, encryptionKey) {
        const result = await db.query(
            `INSERT INTO health_logs (user_id, log_type, encrypted_value, notes)
             VALUES (
                 $1, 
                 $2, 
                 pgp_sym_encrypt($3::text, $4),
                 $5
             )
             RETURNING id, log_type, notes, logged_at`,
            [userId, logType, value, encryptionKey, notes]
        );
        return result.rows[0];
    }

    async findByUserId(encryptionKey) {
        const result = await db.query(
            `SELECT 
                id, 
                log_type, 
                pgp_sym_decrypt(encrypted_value, $1) as value,
                notes, 
                logged_at 
             FROM health_logs 
             ORDER BY logged_at DESC`,
            [encryptionKey]
        );
        return result.rows;
    }

    async deleteById(id) {
        const result = await db.query('DELETE FROM health_logs WHERE id = $1 RETURNING id', [id]);
        return result.rows;
    }
}

module.exports = new HealthLogRepository();
