/*
# FreeGaming.ca — Initial Database Schema

## Summary
Creates the full schema for the FreeGaming.ca games portal.

## New Tables

### categories
Stores the 14 game categories for the portal.
- id: auto-increment primary key
- name: display name (e.g. "Puzzle Games")
- slug: URL-friendly identifier (e.g. "puzzle-games")
- icon: Lucide icon name
- description: optional category description
- order_num: display order in navigation

### games
Stores all aggregated games from third-party sources.
- id: auto-increment primary key
- title, slug: game identity
- description, short_description: content
- thumbnail: image URL from provider CDN
- iframe_url: embed URL for the game
- source_id: ID in the source system
- source: enum (GAMEMONETIZE, GAMEDISTRIBUTION, HTML5GAMES, MANUAL)
- category_id: FK to categories
- tags: array of tag strings
- width, height: iframe dimensions
- is_new, is_hot, is_featured: editorial flags
- is_active: soft-delete / visibility toggle
- views: play count

### sync_logs
Records every sync operation for auditing and debugging.
- id, source, total_fetched, added, updated, errors, created_at

## Security
- RLS enabled on all tables
- All tables use TO anon, authenticated policies (no auth required — public portal)
*/

-- Drop and recreate source enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_source') THEN
    CREATE TYPE game_source AS ENUM ('GAMEMONETIZE', 'GAMEDISTRIBUTION', 'HTML5GAMES', 'MANUAL');
  END IF;
END $$;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id          serial PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  icon        text NOT NULL DEFAULT 'gamepad',
  description text,
  order_num   int  NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE TO anon, authenticated USING (true);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id                serial PRIMARY KEY,
  title             text NOT NULL,
  slug              text NOT NULL UNIQUE,
  description       text NOT NULL DEFAULT '',
  short_description varchar(165) NOT NULL DEFAULT '',
  thumbnail         text NOT NULL DEFAULT '',
  iframe_url        text NOT NULL,
  source_id         text NOT NULL,
  source            game_source NOT NULL,
  category_id       int  NOT NULL REFERENCES categories(id),
  tags              text[] NOT NULL DEFAULT '{}',
  width             int  NOT NULL DEFAULT 800,
  height            int  NOT NULL DEFAULT 600,
  is_new            boolean NOT NULL DEFAULT false,
  is_hot            boolean NOT NULL DEFAULT false,
  is_featured       boolean NOT NULL DEFAULT false,
  is_active         boolean NOT NULL DEFAULT true,
  views             int  NOT NULL DEFAULT 0,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE (source, source_id)
);

CREATE INDEX IF NOT EXISTS idx_games_category_id ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_is_hot      ON games(is_hot)      WHERE is_hot = true;
CREATE INDEX IF NOT EXISTS idx_games_is_new      ON games(is_new)      WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_games_views       ON games(views DESC);
CREATE INDEX IF NOT EXISTS idx_games_is_active   ON games(is_active)   WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_games_slug        ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_source      ON games(source, source_id);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_games" ON games;
CREATE POLICY "anon_select_games" ON games FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_games" ON games;
CREATE POLICY "anon_insert_games" ON games FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_games" ON games;
CREATE POLICY "anon_update_games" ON games FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_games" ON games;
CREATE POLICY "anon_delete_games" ON games FOR DELETE TO anon, authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS games_updated_at ON games;
CREATE TRIGGER games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id            serial PRIMARY KEY,
  source        game_source NOT NULL,
  total_fetched int NOT NULL DEFAULT 0,
  added         int NOT NULL DEFAULT 0,
  updated       int NOT NULL DEFAULT 0,
  errors        text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sync_logs" ON sync_logs;
CREATE POLICY "anon_select_sync_logs" ON sync_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sync_logs" ON sync_logs;
CREATE POLICY "anon_insert_sync_logs" ON sync_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed the 14 categories
INSERT INTO categories (name, slug, icon, order_num) VALUES
  ('Puzzle Games',      'puzzle-games',      'puzzle',      1),
  ('Racing Games',      'racing-games',      'car',         2),
  ('Sports Games',      'sports-games',      'trophy',      3),
  ('Shooting Games',    'shooting-games',    'crosshair',   4),
  ('Card Games',        'card-games',        'layers',      5),
  ('Strategy Games',    'strategy-games',    'brain',       6),
  ('Arcade Games',      'arcade-games',      'gamepad-2',   7),
  ('Adventure Games',   'adventure-games',   'map',         8),
  ('Multiplayer Games', 'multiplayer-games', 'users',       9),
  ('Thinking Games',    'thinking-games',    'lightbulb',  10),
  ('Action Games',      'action-games',      'zap',        11),
  ('Casual Games',      'casual-games',      'smile',      12),
  ('IO Games',          'io-games',          'globe',      13),
  ('Other Games',       'other-games',       'gamepad',    14)
ON CONFLICT (slug) DO NOTHING;
