/*
  # LifeQuran Database Schema

  ## Overview
  This migration creates all tables required for the LifeQuran PWA application.

  ## New Tables

  ### 1. user_profiles
  - Stores user profile, gamification stats (XP, level, streak), and settings
  - Fields: id (auth uid), username, avatar_url, xp, level, streak_count, streak_last_date, streak_freeze_available, total_pages_read, total_time_minutes, settings (jsonb)

  ### 2. bookmarks
  - Stores user-bookmarked ayahs
  - Fields: id, user_id, surah_number, surah_name, ayah_number, ayah_text_preview, created_at

  ### 3. reading_history
  - Records each reading session
  - Fields: id, user_id, surah_number, ayah_start, ayah_end, pages_read, time_spent_minutes, date, created_at

  ### 4. achievements
  - Tracks which badges/achievements a user has unlocked
  - Fields: id, user_id, badge_id, badge_name, unlocked_at

  ### 5. daily_challenges
  - Tracks daily challenge completion per user
  - Fields: id, user_id, challenge_date, target_pages, pages_completed, completed, xp_earned, created_at

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own data
  - Separate policies for SELECT, INSERT, UPDATE, DELETE
*/

-- user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_count integer NOT NULL DEFAULT 0,
  streak_last_date date,
  streak_freeze_available boolean NOT NULL DEFAULT true,
  total_pages_read integer NOT NULL DEFAULT 0,
  total_time_minutes integer NOT NULL DEFAULT 0,
  last_surah_number integer DEFAULT 1,
  last_ayah_number integer DEFAULT 1,
  settings jsonb NOT NULL DEFAULT '{"darkMode": false, "fontSize": "medium", "reminderEnabled": false, "reminderTime": "07:00", "dailyTargetPages": 1}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  surah_name text NOT NULL DEFAULT '',
  ayah_number integer NOT NULL,
  ayah_text_preview text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- reading_history table
CREATE TABLE IF NOT EXISTS reading_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  surah_name text DEFAULT '',
  ayah_start integer NOT NULL DEFAULT 1,
  ayah_end integer NOT NULL DEFAULT 1,
  pages_read integer NOT NULL DEFAULT 1,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reading history"
  ON reading_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading history"
  ON reading_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading history"
  ON reading_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading history"
  ON reading_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id text NOT NULL,
  badge_name text NOT NULL DEFAULT '',
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_date date NOT NULL DEFAULT CURRENT_DATE,
  target_pages integer NOT NULL DEFAULT 1,
  pages_completed integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  xp_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily challenges"
  ON daily_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenges"
  ON daily_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily challenges"
  ON daily_challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_date ON reading_history(user_id, date);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, challenge_date);
