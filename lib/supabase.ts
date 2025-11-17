import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type LiveResearchSession = {
  id: string;
  host_id: string;
  title: string;
  topic: string | null;
  ai_model: 'perplexity' | 'claude';
  status: 'live' | 'ended' | 'archived';
  viewer_count: number;
  total_viewers: number;
  published_as_post: boolean;
  post_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  created_at: string;
};

export type SessionMessage = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  is_partial: boolean;
  citations: any[] | null;
  created_at: string;
  message_order: number;
};

export type SessionViewer = {
  id: string;
  session_id: string;
  viewer_id: string;
  joined_at: string;
  left_at: string | null;
};
