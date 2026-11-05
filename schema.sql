-- =========================================================
-- Al Quran Web — Neon PostgreSQL Multi-Device Sync Schema
-- =========================================================

-- Create user_sync table
CREATE TABLE IF NOT EXISTS user_sync (
  email VARCHAR(255) PRIMARY KEY,
  last_read JSONB NOT NULL,
  bookmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on updated_at for fast queries
CREATE INDEX IF NOT EXISTS idx_user_sync_updated_at ON user_sync(updated_at);

-- Verification Query
-- SELECT * FROM user_sync LIMIT 10;
