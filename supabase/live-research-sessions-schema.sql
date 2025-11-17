-- =====================================================
-- ARYAVARTA LIVE RESEARCH SESSIONS DATABASE SCHEMA
-- =====================================================
-- Run this in your Supabase SQL Editor
-- This creates all tables needed for Live AI Research Sessions

-- =====================================================
-- 1. LIVE RESEARCH SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS live_research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL, -- References your subscribers table
  
  -- Session details
  title TEXT NOT NULL,
  topic TEXT,
  ai_model TEXT NOT NULL CHECK (ai_model IN ('perplexity', 'claude')),
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'ended', 'archived')),
  
  -- Engagement metrics
  viewer_count INTEGER DEFAULT 0,
  total_viewers INTEGER DEFAULT 0,
  
  -- Publishing
  published_as_post BOOLEAN DEFAULT FALSE,
  post_id UUID, -- References community_posts if it exists
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. SESSION MESSAGES TABLE (The Conversation)
-- =====================================================
CREATE TABLE IF NOT EXISTS session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_research_sessions(id) ON DELETE CASCADE,
  
  -- Message details
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  is_partial BOOLEAN DEFAULT FALSE, -- For streaming chunks
  
  -- Citations (for AI responses with sources)
  citations JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Order messages chronologically
  message_order SERIAL
);

-- =====================================================
-- 3. SESSION VIEWERS TABLE (Who's Watching)
-- =====================================================
CREATE TABLE IF NOT EXISTS session_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_research_sessions(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL, -- References your subscribers table
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  
  UNIQUE(session_id, viewer_id)
);

-- =====================================================
-- 4. SESSION REACTIONS TABLE (Followers Can React)
-- =====================================================
CREATE TABLE IF NOT EXISTS session_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES live_research_sessions(id) ON DELETE CASCADE,
  message_id UUID REFERENCES session_messages(id) ON DELETE CASCADE,
  reactor_id UUID NOT NULL, -- References your subscribers table
  
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('insightful', 'helpful', 'interesting', 'brilliant')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, reactor_id)
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sessions_host ON live_research_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON live_research_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON live_research_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON session_messages(session_id, message_order);
CREATE INDEX IF NOT EXISTS idx_viewers_session ON session_viewers(session_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message ON session_reactions(message_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE live_research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reactions ENABLE ROW LEVEL SECURITY;

-- Sessions: Anyone can view live/ended sessions
CREATE POLICY "Anyone can view live sessions"
  ON live_research_sessions FOR SELECT
  USING (status IN ('live', 'ended'));

-- Sessions: Only host can create
CREATE POLICY "Authenticated users can create sessions"
  ON live_research_sessions FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Sessions: Only host can update
CREATE POLICY "Host can update their sessions"
  ON live_research_sessions FOR UPDATE
  USING (auth.uid() = host_id);

-- Messages: Anyone can view messages from visible sessions
CREATE POLICY "Anyone can view session messages"
  ON session_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM live_research_sessions
      WHERE id = session_id
      AND status IN ('live', 'ended')
    )
  );

-- Messages: Only host can insert messages
CREATE POLICY "Host can insert messages"
  ON session_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM live_research_sessions
      WHERE id = session_id
      AND host_id = auth.uid()
    )
  );

-- Viewers: Anyone can view viewer list
CREATE POLICY "Anyone can view session viewers"
  ON session_viewers FOR SELECT
  USING (true);

-- Viewers: Authenticated users can join as viewers
CREATE POLICY "Authenticated users can join sessions"
  ON session_viewers FOR INSERT
  WITH CHECK (auth.uid() = viewer_id);

-- Viewers: Users can update their own viewer record
CREATE POLICY "Users can update their viewer status"
  ON session_viewers FOR UPDATE
  USING (auth.uid() = viewer_id);

-- Reactions: Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON session_reactions FOR SELECT
  USING (true);

-- Reactions: Authenticated users can add reactions
CREATE POLICY "Authenticated users can add reactions"
  ON session_reactions FOR INSERT
  WITH CHECK (auth.uid() = reactor_id);

-- =====================================================
-- 7. ENABLE REALTIME FOR LIVE UPDATES
-- =====================================================
-- This allows followers to see messages in real-time!

-- First, ensure the realtime publication exists (Supabase creates this by default)
-- Then add our tables to it

-- Enable realtime for session messages (critical for live streaming)
ALTER PUBLICATION supabase_realtime ADD TABLE session_messages;

-- Enable realtime for viewer count updates
ALTER PUBLICATION supabase_realtime ADD TABLE session_viewers;

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE session_reactions;

-- =====================================================
-- 8. HELPER FUNCTIONS (Optional but useful)
-- =====================================================

-- Function to update viewer count automatically
CREATE OR REPLACE FUNCTION update_viewer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment viewer count and total viewers
    UPDATE live_research_sessions
    SET 
      viewer_count = viewer_count + 1,
      total_viewers = total_viewers + 1
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.left_at IS NOT NULL AND OLD.left_at IS NULL THEN
    -- Decrement viewer count when viewer leaves
    UPDATE live_research_sessions
    SET viewer_count = viewer_count - 1
    WHERE id = NEW.session_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update viewer counts
CREATE TRIGGER trigger_update_viewer_count
  AFTER INSERT OR UPDATE ON session_viewers
  FOR EACH ROW
  EXECUTE FUNCTION update_viewer_count();

-- Function to calculate session duration when ended
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'ended' AND OLD.status = 'live' THEN
    NEW.ended_at = NOW();
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate duration
CREATE TRIGGER trigger_calculate_duration
  BEFORE UPDATE ON live_research_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_duration();

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Your Live Research Sessions database is ready!
-- 
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Test by inserting a sample session
-- 3. Build the API routes and UI
