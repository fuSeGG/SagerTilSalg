-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, -- The label/name itself (e.g. 'Værktøj')
    label TEXT NOT NULL,
    sku_prefix TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL, -- Name of Lucide icon (e.g. 'Wrench')
    color TEXT NOT NULL, -- Tailwind class (e.g. 'text-accent')
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access (needed for the shop view)
CREATE POLICY "Public items are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Allow full access for service role (admin functions)
CREATE POLICY "Service role full access" ON categories
    FOR ALL USING (auth.role() = 'service_role');

-- Seed default categories (Idempotent upsert)
INSERT INTO categories (id, label, sku_prefix, icon, color, sort_order) VALUES
    ('Værktøj', 'Værktøj', 'VR', 'Wrench', 'text-accent', 10),
    ('Møbler', 'Møbler', 'MB', 'Armchair', 'text-text-secondary', 20),
    ('Auto', 'Auto', 'AU', 'Car', 'text-orange-500', 30),
    ('Maskiner', 'Maskiner', 'MA', 'Settings', 'text-blue-400', 40),
    ('Materialer', 'Materialer', 'MAT', 'Box', 'text-purple-500', 50)
ON CONFLICT (id) DO UPDATE SET
    sku_prefix = EXCLUDED.sku_prefix,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    sort_order = EXCLUDED.sort_order;
