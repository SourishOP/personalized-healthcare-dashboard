const { Pool } = require('pg');
const { AsyncLocalStorage } = require('async_hooks');

// Initialize AsyncLocalStorage to store request context (User ID)
const als = new AsyncLocalStorage();

// Standard Postgres connection pool
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'healthcare_dashboard',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: process.env.POSTGRES_PORT || 5432,
    max: 10, // Optimize for available connections
    idleTimeoutMillis: 30000,
});

/**
 * Run a callback within an async context where the userId is available.
 * Used by middleware to set the user for the duration of the request.
 */
const runWithUser = (userId, callback) => {
    return als.run(userId, callback);
};

/**
 * Execute a query.
 * If a User ID is present in the context (set by runWithUser),
 * automatically sets the 'app.current_user_id' RLS variable locally for this transaction.
 */
const query = async (text, params) => {
    const userId = als.getStore();
    const client = await pool.connect();

    try {
        // If we have an identified user, enforce RLS context
        if (userId) {
            // SET LOCAL applies only to the current transaction/session state for this client
            // We use a transaction if we want to be absolutely atomic, but SET LOCAL usually persists 
            // until COMMIT or session end. Since we release client back to pool, we must be careful.
            // Best practice for RLS in pool: Wrap in transaction or basic SET logic if implied.
            // For simple implementation:
            // Use set_config to safely set the variable using parameters
            await client.query(`SELECT set_config('app.current_user_id', $1, false)`, [userId]);
        }

        const res = await client.query(text, params);
        return res;
    } finally {
        // RESET the session variable to avoid leaking privileges to next user of this client
        // 'SET LOCAL' is transaction scoped if in transaction, but here we aren't explicitly in one
        // unless we wrapped it. To be safe, we reset or rely on 'SET LOCAL' behavior (which ends at transaction commit/rollback).
        // Since we didn't start explicit 'BEGIN', 'SET LOCAL' might behave like 'SET'.
        // SAFER: Explicitly reset.
        if (userId) {
            await client.query(`RESET app.current_user_id`);
        }
        client.release();
    }
};

module.exports = {
    query,
    runWithUser
};
