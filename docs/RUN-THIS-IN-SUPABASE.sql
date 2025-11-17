-- =====================================================
-- PHASE 4: COMMENT REPLIES - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- Step 1: Add parent_comment_id column (if it doesn't exist)
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS parent_comment_id UUID DEFAULT NULL;

-- Step 2: Add foreign key constraint (only if column was just created)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_parent_comment' 
    AND table_name = 'comments'
  ) THEN
    ALTER TABLE comments
    ADD CONSTRAINT fk_parent_comment 
      FOREIGN KEY (parent_comment_id) 
      REFERENCES comments(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_article_parent ON comments(article_slug, parent_comment_id, created_at DESC);

-- Step 4: Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'comments' 
AND column_name = 'parent_comment_id';

-- ✅ You should see: parent_comment_id | uuid | YES | NULL
-- ✅ That means the migration was successful!
