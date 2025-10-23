-- =====================================================
-- PHASE 4: COMMENT REPLIES SYSTEM
-- =====================================================
-- Add support for threaded comment replies

-- 1. Add parent_comment_id column to comments table
ALTER TABLE comments 
ADD COLUMN parent_comment_id UUID DEFAULT NULL,
ADD CONSTRAINT fk_parent_comment 
  FOREIGN KEY (parent_comment_id) 
  REFERENCES comments(id) 
  ON DELETE CASCADE;

-- 2. Add index for parent_comment_id for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- 3. Create a composite index for fetching all comments and replies efficiently
CREATE INDEX IF NOT EXISTS idx_comments_article_parent ON comments(article_slug, parent_comment_id, created_at DESC);

-- 4. Update RLS policy to allow viewing replies
-- (The existing "Anyone can view comments" policy will work for replies too)

-- 5. Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'comments' 
AND column_name = 'parent_comment_id';

-- =====================================================
-- EXPECTED OUTPUT:
-- Should show: parent_comment_id | uuid | YES | NULL
-- =====================================================

-- 6. Test query to fetch comments with replies
-- SELECT 
--   c1.id as comment_id,
--   c1.username,
--   c1.comment_text,
--   c1.created_at,
--   c1.parent_comment_id,
--   COUNT(c2.id) as reply_count
-- FROM comments c1
-- LEFT JOIN comments c2 ON c2.parent_comment_id = c1.id AND c2.is_deleted = FALSE
-- WHERE c1.article_slug = 'your-article-slug' 
--   AND c1.is_deleted = FALSE
--   AND c1.parent_comment_id IS NULL
-- GROUP BY c1.id, c1.username, c1.comment_text, c1.created_at, c1.parent_comment_id
-- ORDER BY c1.created_at DESC;
