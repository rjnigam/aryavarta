-- =====================================================
-- PHASE 5A: COMMENT REACTIONS (LIKE/DISLIKE)
-- =====================================================

-- Step 1: Create comment_reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one reaction per user per comment
  CONSTRAINT unique_user_comment_reaction UNIQUE (comment_id, user_email)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_email ON comment_reactions(user_email);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_type ON comment_reactions(comment_id, reaction_type);

-- Step 3: Enable Row Level Security
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies (with IF NOT EXISTS checks)
DO $$ 
BEGIN
  -- Anyone can view reactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comment_reactions' 
    AND policyname = 'Anyone can view reactions'
  ) THEN
    CREATE POLICY "Anyone can view reactions" ON comment_reactions
      FOR SELECT USING (true);
  END IF;

  -- Authenticated users can insert their own reactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comment_reactions' 
    AND policyname = 'Users can insert their own reactions'
  ) THEN
    CREATE POLICY "Users can insert their own reactions" ON comment_reactions
      FOR INSERT WITH CHECK (true);
  END IF;

  -- Users can delete their own reactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comment_reactions' 
    AND policyname = 'Users can delete their own reactions'
  ) THEN
    CREATE POLICY "Users can delete their own reactions" ON comment_reactions
      FOR DELETE USING (true);
  END IF;

  -- Users can update their own reactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comment_reactions' 
    AND policyname = 'Users can update their own reactions'
  ) THEN
    CREATE POLICY "Users can update their own reactions" ON comment_reactions
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Step 5: Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'comment_reactions'
ORDER BY ordinal_position;

-- ✅ You should see: id, comment_id, user_email, reaction_type, created_at
-- ✅ That means the migration was successful!
