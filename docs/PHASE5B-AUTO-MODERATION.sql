-- =====================================================
-- PHASE 5B: AUTO-MODERATION FOR COMMENTS
-- =====================================================
-- Run this SQL in your Supabase SQL Editor before deploying.

-- 1. Add moderation columns to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hidden_reason TEXT,
ADD COLUMN IF NOT EXISTS hidden_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS moderation_status TEXT
  DEFAULT 'visible'
  CHECK (moderation_status IN ('visible', 'auto_hidden', 'manual_hidden', 'resolved'));

-- 2. Create comment_flags table to record moderation events
CREATE TABLE IF NOT EXISTS comment_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL CHECK (
    flag_type IN (
      'auto_dislike_threshold',
      'auto_banned_phrase',
      'auto_link_spam',
      'manual_report',
      'manual_hide'
    )
  ),
  trigger_source TEXT NOT NULL CHECK (
    trigger_source IN ('system', 'user', 'moderator')
  ),
  trigger_details JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT
);

-- 3. Helpful indexes
CREATE INDEX IF NOT EXISTS idx_comment_flags_comment_id ON comment_flags(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_flags_status ON comment_flags(status);

-- 4. Enable Row Level Security (so we can craft fine-grained policies later)
ALTER TABLE comment_flags ENABLE ROW LEVEL SECURITY;

-- 5. Basic policy: allow service role full access (API routes use service key)
DROP POLICY IF EXISTS "Service role full access" ON comment_flags;
CREATE POLICY "Service role full access" ON comment_flags
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. Verify columns exist on comments
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'comments'
  AND column_name IN ('is_hidden', 'hidden_reason', 'hidden_at', 'moderation_status')
ORDER BY column_name;

-- 7. Verify comment_flags structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'comment_flags'
ORDER BY ordinal_position;

-- =====================================================
-- EXPECTED OUTPUT
--  * comments table now exposes is_hidden, hidden_reason, hidden_at, moderation_status
--  * comment_flags table created with moderation metadata
-- =====================================================
