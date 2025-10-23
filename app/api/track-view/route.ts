import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  try {
    const { email, articleSlug } = await request.json();

    if (!email || !articleSlug) {
      return NextResponse.json(
        { message: 'Email and article slug are required' },
        { status: 400 }
      );
    }

    // Verify user is an active subscriber
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('email, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Invalid subscriber' },
        { status: 403 }
      );
    }

    // Insert or update article view (upsert handles duplicates)
    const { error } = await supabase
      .from('article_views')
      .upsert(
        {
          user_email: email,
          article_slug: articleSlug,
          viewed_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_email,article_slug',
        }
      );

    if (error) {
      console.error('Error tracking article view:', error);
      return NextResponse.json(
        { message: 'Failed to track article view' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in track-view API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
