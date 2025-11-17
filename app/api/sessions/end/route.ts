import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, host_id } = body;

    // Validate required fields
    if (!session_id || !host_id) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, host_id' },
        { status: 400 }
      );
    }

    // Verify the session belongs to the host
    const { data: session, error: fetchError } = await supabase
      .from('live_research_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('host_id', host_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update session status to ended
    // Note: The database trigger will automatically calculate duration
    const { data: updatedSession, error: updateError } = await supabase
      .from('live_research_sessions')
      .update({ status: 'ended' })
      .eq('id', session_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error ending session:', updateError);
      return NextResponse.json(
        { error: 'Failed to end session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: updatedSession }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
