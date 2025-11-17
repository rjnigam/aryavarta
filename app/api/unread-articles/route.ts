import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAllArticles } from '@/lib/articles';

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
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

    // Get all viewed article slugs for this user
    const { data: views, error: viewsError } = await supabase
      .from('article_views')
      .select('article_slug')
      .eq('user_email', email);

    // If table doesn't exist yet, treat all articles as unread
    if (viewsError) {
      console.error('Error fetching article views (table may not exist):', viewsError);
      const allArticles = getAllArticles();
      return NextResponse.json({
        unreadArticles: allArticles,
        totalArticles: allArticles.length,
        readCount: 0,
      });
    }

    const viewedSlugs = new Set(views?.map(v => v.article_slug) || []);

    // Get all articles
    const allArticles = getAllArticles();

    // Filter to unread articles
    const unreadArticles = allArticles.filter(
      article => !viewedSlugs.has(article.slug)
    );

    return NextResponse.json({
      unreadArticles,
      totalArticles: allArticles.length,
      readCount: viewedSlugs.size,
    });
  } catch (error) {
    console.error('Error in unread-articles API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
