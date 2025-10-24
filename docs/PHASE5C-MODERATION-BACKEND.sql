-- =====================================================
-- PHASE 5C: MODERATION DASHBOARD BACKEND
-- =====================================================
-- Run this migration in Supabase before deploying Phase 5C.

-- 1. Extend comment_flags with assignment + audit metadata
ALTER TABLE comment_flags
  ADD COLUMN IF NOT EXISTS assigned_to TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS last_touched_by TEXT,
  ADD COLUMN IF NOT EXISTS last_touched_at TIMESTAMPTZ;

-- 2. Helpful indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_comment_flags_created_at ON comment_flags(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comment_flags_flag_type_created_at ON comment_flags(flag_type, created_at DESC);

-- 3. Ensure service role can write the new columns
DROP POLICY IF EXISTS "Service role full access" ON comment_flags;
CREATE POLICY "Service role full access" ON comment_flags
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. Quick sanity checks
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'comment_flags'
  AND column_name IN ('assigned_to', 'notes', 'last_touched_by', 'last_touched_at')
ORDER BY column_name;

-- =====================================================
-- EXPECTED OUTPUT
--  * comment_flags now tracks assignments and audit metadata
--  * indexes ready for queue + metrics API endpoints
-- =====================================================
