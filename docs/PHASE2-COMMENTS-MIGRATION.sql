-- =====================================================
-- PHASE 2: COMMENTS SYSTEM DATABASE MIGRATION
-- =====================================================
-- Run this SQL in your Supabase SQL Editor

-- 1. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Foreign key to subscribers table
  CONSTRAINT fk_user_email 
    FOREIGN KEY (user_email) 
    REFERENCES subscribers(email) 
    ON DELETE CASCADE
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_active ON comments(article_slug, is_deleted, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Allow anyone to read non-deleted comments
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  USING (is_deleted = FALSE);

-- Allow authenticated users to insert their own comments
CREATE POLICY "Subscribers can create comments"
  ON comments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subscribers 
      WHERE subscribers.email = user_email 
      AND subscribers.is_active = TRUE
    )
  );

-- Allow users to update only their own comments
CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  USING (user_email = current_setting('request.jwt.claim.email', true))
  WITH CHECK (user_email = current_setting('request.jwt.claim.email', true));

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger
DROP TRIGGER IF EXISTS trigger_update_comments_updated_at ON comments;
CREATE TRIGGER trigger_update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();

-- 7. Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- =====================================================
-- EXPECTED OUTPUT:
-- Should show 9 columns: id, article_slug, user_email, 
-- username, comment_text, created_at, updated_at, is_deleted
-- =====================================================
