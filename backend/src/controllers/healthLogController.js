const db = require('../../security/db');

// Encryption Key (In real app, manage this via Key Management Service or similar)
// For pgcrypto 'pgp_sym_encrypt', we pass the key.
const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'development-fallback-secret-key';

exports.createLog = async (req, res) => {
    const { log_type, value, notes } = req.body;
    // value is sensitive, e.g. "120/80" or "Depressed"

    try {
        const result = await db.query(
            `INSERT INTO health_logs (user_id, log_type, encrypted_value, notes)
             VALUES (
                 $1, 
                 $2, 
                 pgp_sym_encrypt($3::text, $4),
                 $5
             )
             RETURNING id, log_type, notes, logged_at`,
            [req.user.id, log_type, value, DB_ENCRYPTION_KEY, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving log' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        // RLS policy 'health_logs_isolation_policy' ensures we only see our own logs
        // We use pgp_sym_decrypt to read the data back
        const result = await db.query(
            `SELECT 
                id, 
                log_type, 
                pgp_sym_decrypt(encrypted_value, $1) as value,
                notes, 
                logged_at 
             FROM health_logs 
             ORDER BY logged_at DESC`,
            [DB_ENCRYPTION_KEY]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

exports.deleteLog = async (req, res) => {
    const { id } = req.params;
    try {
        // Simple delete - RLS enforces ownership
        const result = await db.query('DELETE FROM health_logs WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Log not found or access denied' });
        }

        res.json({ message: 'Log deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
