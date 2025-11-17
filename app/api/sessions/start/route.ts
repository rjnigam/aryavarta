import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, topic, ai_model, host_id } = body;

    // Validate required fields
    if (!title || !ai_model || !host_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ai_model, host_id' },
        { status: 400 }
      );
    }

    // Validate ai_model
    if (!['perplexity', 'claude'].includes(ai_model)) {
      return NextResponse.json(
        { error: 'ai_model must be either "perplexity" or "claude"' },
        { status: 400 }
      );
    }

    // Create new session
    const { data: session, error } = await supabase
      .from('live_research_sessions')
      .insert({
        host_id,
        title,
        topic: topic || null,
        ai_model,
        status: 'live',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json(
        { error: 'Failed to create session', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, topic, ai_model, host_id } = body;

    // Validate required fields
    if (!title || !ai_model || !host_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ai_model, host_id' },
        { status: 400 }
      );
    }

    // Validate ai_model
    if (!['perplexity', 'claude'].includes(ai_model)) {
      return NextResponse.json(
        { error: 'ai_model must be either "perplexity" or "claude"' },
        { status: 400 }
      );
    }

    // Create new session
    const { data: session, error } = await supabase
      .from('live_research_sessions')
      .insert({
        host_id,
        title,
