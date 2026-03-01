const db = require('../../security/db');

class UserRepository {
    async createUser(email, hashedPassword) {
        const result = await db.query(
            `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
            [email, hashedPassword]
        );
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async updateMfaSecret(userId, secretBase32) {
        await db.query(
            'UPDATE users SET mfa_secret = $1 WHERE id = $2',
            [secretBase32, userId]
        );
    }

    async getMfaSecret(userId) {
        const result = await db.query('SELECT mfa_secret FROM users WHERE id = $1', [userId]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();
