-- Fachbot databázové schéma
-- Spustit v Supabase SQL editoru

-- Tabulka uživatelů (Pro předplatitelé)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro' | 'firm'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive', -- 'active' | 'inactive' | 'canceled' | 'past_due'
  subscription_end TIMESTAMPTZ,
  lang TEXT DEFAULT 'cs', -- 'cs' | 'sk' | 'pl'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka generování (logy)
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  lang TEXT,
  situation TEXT,
  trade TEXT,
  channel TEXT,
  tone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pro rychlé vyhledávání podle emailu
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_stripe_customer_idx ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS generations_email_idx ON generations(email);
CREATE INDEX IF NOT EXISTS generations_created_idx ON generations(created_at DESC);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Polícy — pouze server (service role) může číst/zapisovat
CREATE POLICY "Service role only" ON users
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON generations
  USING (auth.role() = 'service_role');
