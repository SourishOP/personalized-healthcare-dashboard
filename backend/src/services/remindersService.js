const cron = require('node-cron');
const db = require('../../security/db');

// In-memory store for active cron jobs (for prototype)
// In production, use Redis/Bull or DB polling.
// Here we use a single global cron job that polls the DB for due reminders.
// Assumes 'reminders' table exists (We need to CREATE it! I missed it in Module 1. I will add a migration script or just CREATE IF NOT EXISTS here).

const initRemindersTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS reminders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            frequency_minutes INTEGER NOT NULL, -- e.g. 1440 for daily
            last_sent_at TIMESTAMP WITH TIME ZONE,
            next_run_at TIMESTAMP WITH TIME ZONE NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS reminders_isolation_policy ON reminders;
        CREATE POLICY reminders_isolation_policy ON reminders
            USING (user_id = current_setting('app.current_user_id', true)::UUID)
            WITH CHECK (user_id = current_setting('app.current_user_id', true)::UUID);
    `);
    console.log("Reminders table initialized.");
};

// Scheduler checks every minute
cron.schedule('* * * * *', async () => {
    // This background job runs as System, so we need a way to bypass RLS or run as superuser
    // OR we run with a specific system context. 
    // db.query runs without user context -> defaults to public/system if connection user is owner.

    try {
        const now = new Date();
        const result = await db.query(`
            SELECT * FROM reminders 
            WHERE is_active = TRUE AND next_run_at <= $1
        `, [now]);

        for (const reminder of result.rows) {
            console.log(`[NOTIFICATION] Reminder for User ${reminder.user_id}: ${reminder.title}`);

            // Calculate next run
            const nextRun = new Date(now.getTime() + reminder.frequency_minutes * 60000);

            await db.query(`
                UPDATE reminders 
                SET last_sent_at = $1, next_run_at = $2 
                WHERE id = $3
            `, [now, nextRun, reminder.id]);
        }
    } catch (err) {
        console.error("Scheduler Error:", err);
    }
});

exports.init = initRemindersTable;

exports.createReminder = async (req, res) => {
    const { title, frequency_minutes } = req.body;
    const next_run_at = new Date(Date.now() + frequency_minutes * 60000); // First run in X mins

    try {
        const result = await db.query(
            `INSERT INTO reminders (user_id, title, frequency_minutes, next_run_at)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.id, title, frequency_minutes, next_run_at]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating reminder' });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM reminders WHERE is_active = TRUE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching reminders' });
    }
};
