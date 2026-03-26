-- Enable Row Level Security (RLS) on the items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 1. Read Access (Public)
-- Everyone can view items (necessary for the showroom frontend)
CREATE POLICY "Public items are viewable by everyone" 
ON items FOR SELECT 
USING (true);

-- 2. Write Access (Admin Only)
-- Block all anonymous INSERT, UPDATE, and DELETE operations.
-- Only the secure Cloudflare backend using the SERVICE_ROLE key is allowed to modify the database.
CREATE POLICY "Service role full access" 
ON items FOR ALL 
USING (auth.role() = 'service_role');
