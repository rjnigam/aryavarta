-- =====================================================
-- PHASE 3: ARTICLE TRACKING SYSTEM
-- =====================================================
-- Track which articles users have viewed for personalization

-- 1. Create article_views table
CREATE TABLE IF NOT EXISTS article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  article_slug VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key to subscribers table
  CONSTRAINT fk_article_views_user_email 
    FOREIGN KEY (user_email) 
    REFERENCES subscribers(email) 
    ON DELETE CASCADE,
  
  -- Prevent duplicate views (one record per user per article)
  CONSTRAINT unique_user_article UNIQUE (user_email, article_slug)
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_views_user_email ON article_views(user_email);
CREATE INDEX IF NOT EXISTS idx_article_views_article_slug ON article_views(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Users can view their own article history
CREATE POLICY "Users can view own article views"
  ON article_views
  FOR SELECT
  USING (user_email = current_setting('request.jwt.claim.email', true));

-- Users can insert their own article views
CREATE POLICY "Users can insert own article views"
  ON article_views
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM subscribers 
      WHERE subscribers.email = user_email 
      AND subscribers.is_active = TRUE
    )
  );

-- Allow public insert (we'll validate in the API)
CREATE POLICY "Allow tracking article views"
  ON article_views
  FOR INSERT
  WITH CHECK (true);

-- 5. Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'article_views'
ORDER BY ordinal_position;

-- =====================================================
-- EXPECTED OUTPUT:
-- Should show 4 columns: id, user_email, article_slug, viewed_at
-- =====================================================
