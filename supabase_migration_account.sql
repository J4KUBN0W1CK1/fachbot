-- Migration: přidat generated_text a profile data
-- Spusť v Supabase SQL editoru

-- 1. Přidat generated_text do generations
ALTER TABLE generations ADD COLUMN IF NOT EXISTS generated_text TEXT;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 2. Přidat profilová data do users
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pref_tone TEXT DEFAULT 'Přirozený';
ALTER TABLE users ADD COLUMN IF NOT EXISTS pref_address TEXT DEFAULT 'vy';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3. Index pro rychlé vyhledávání generování podle emailu
CREATE INDEX IF NOT EXISTS idx_generations_email ON generations(email);
CREATE INDEX IF NOT EXISTS idx_generations_created ON generations(created_at DESC);
