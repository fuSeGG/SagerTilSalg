-- Create rate_limits table for server-side PIN brute-force protection
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS rate_limits (
    ip TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-cleanup: delete expired records older than 48 hours
-- This prevents the table from growing forever
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits
    WHERE updated_at < now() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql;

-- Optional: Enable RLS (Row Level Security) to prevent public access
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow the service role (used by Cloudflare Functions) to access this table
-- No public (anon) access at all
CREATE POLICY "Service role only" ON rate_limits
    FOR ALL
    USING (auth.role() = 'service_role');
