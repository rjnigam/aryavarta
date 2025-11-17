'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LiveSessionViewer from '@/components/LiveSessionViewer';
import { supabase } from '@/lib/supabase';

type Session = {
  id: string;
  host_id: string;
  title: string;
  topic: string | null;
  status: string;
};

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch session details
      const { data, error } = await supabase
        .from('live_research_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session:', error);
        setLoading(false);
        return;
      }

      setSession(data);

      // If user is authenticated, record them as a viewer
      if (user && data.host_id !== user.id) {
        await supabase
          .from('session_viewers')
          .upsert({
            session_id: sessionId,
            viewer_id: user.id,
          });
      }

      setLoading(false);
    };

    fetchSession();

    // Cleanup: Mark viewer as left when they leave
    return () => {
      if (currentUserId && session && session.host_id !== currentUserId) {
        supabase
          .from('session_viewers')
          .update({ left_at: new Date().toISOString() })
          .eq('session_id', sessionId)
          .eq('viewer_id', currentUserId)
          .is('left_at', null)
          .then(() => {
            console.log('Marked as left');
          });
      }
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="text-gray-600 mb-4">This session doesn't exist or has been deleted.</p>
          <a href="/" className="text-blue-500 hover:underline">
            Go back home
          </a>
        </div>
      </div>
    );
  }

  if (session.status === 'ended') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session Ended</h1>
          <p className="text-gray-600 mb-4">This live research session has ended.</p>
          <a href="/" className="text-blue-500 hover:underline">
            Go back home
          </a>
        </div>
      </div>
    );
  }

  const isHost = currentUserId === session.host_id;

  return (
    <LiveSessionViewer
      sessionId={session.id}
      hostId={session.host_id}
      title={session.title}
      isHost={isHost}
    />
  );
}
