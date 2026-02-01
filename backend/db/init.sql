-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. Users Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    mfa_secret TEXT, -- Encrypted or stored securely
    role VARCHAR(50) DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Medications Table
-- ==========================================
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- Note: For stricter security, 'name' could be encrypted if it reveals sensitive condition
);

-- ==========================================
-- 3. Health Logs Table (Vitals, Symptoms, Mood)
-- ==========================================
CREATE TABLE IF NOT EXISTS health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    log_type VARCHAR(50) NOT NULL, -- 'BLOOD_PRESSURE', 'GLUCOSE', 'MOOD', 'SYMPTOM', 'WEIGHT'
    
    -- Encrypted Data Column
    -- We store the sensitive value (e.g., '120/80', 'Depressed') as encrypted bytes.
    -- The application must provide the encryption key via environment variables or key management service
    -- to decrypt this on the fly, OR use pgp_sym_encrypt with a DB-side key (less secure if DB is compromised).
    -- Here we assume the value is passed in already encrypted OR we use pgcrypto functions in insert/select.
    -- For this schema, we'll setup the column to simple be BYTEA to support pgcrypto output.
    encrypted_value BYTEA NOT NULL,
    
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT -- Optional notes
);

-- Indexing for performance
CREATE INDEX idx_health_logs_user_id ON health_logs(user_id);
CREATE INDEX idx_medications_user_id ON medications(user_id);

-- ==========================================
-- 4. Row-Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- Policy: Users can only see/edit their own data
-- We rely on a session variable 'app.current_user_id' being set by the API Middleware
-- ---------------------------------------------------------

-- Users Table Policy
CREATE POLICY users_isolation_policy ON users
    USING (id = current_setting('app.current_user_id', true)::UUID)
    WITH CHECK (id = current_setting('app.current_user_id', true)::UUID);

-- Medications Table Policy
CREATE POLICY medications_isolation_policy ON medications
    USING (user_id = current_setting('app.current_user_id', true)::UUID)
    WITH CHECK (user_id = current_setting('app.current_user_id', true)::UUID);

-- Health Logs Table Policy
CREATE POLICY health_logs_isolation_policy ON health_logs
    USING (user_id = current_setting('app.current_user_id', true)::UUID)
    WITH CHECK (user_id = current_setting('app.current_user_id', true)::UUID);


-- ==========================================
-- Helper Function for Encryption Example (Docs)
-- ==========================================
-- To Insert:
-- INSERT INTO health_logs (user_id, log_type, encrypted_value) 
-- VALUES ($1, 'MOOD', pgp_sym_encrypt('Happy', 'MY_SECRET_KEY'));

-- To Select:
-- SELECT pgp_sym_decrypt(encrypted_value, 'MY_SECRET_KEY') as value FROM health_logs;
