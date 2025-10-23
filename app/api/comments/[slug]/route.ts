import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/comments/[slug]
 * Fetch all comments and replies for a specific article
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch all comments (top-level and replies)
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_slug', slug)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true }); // Chronological order

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    // Organize comments into a tree structure
    const commentMap = new Map();
    const topLevelComments: any[] = [];

    // First pass: create map of all comments
    comments?.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree
    comments?.forEach(comment => {
      if (comment.parent_comment_id) {
        // This is a reply
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(commentMap.get(comment.id));
      }
    });

    // Sort top-level comments by newest first
    topLevelComments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(
      { comments: topLevelComments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch comments', comments: [] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments/[slug]
 * Submit a new comment or reply for an article
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { email, username, commentText, parentCommentId } = await request.json();

    // Validate input
    if (!email || !username || !commentText) {
      return NextResponse.json(
        { message: 'Email, username, and comment text are required' },
        { status: 400 }
      );
    }

    if (commentText.trim().length < 3) {
      return NextResponse.json(
        { message: 'Comment must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (commentText.length > 2000) {
      return NextResponse.json(
        { message: 'Comment must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Verify user is an active subscriber
    const { data: subscriber, error: verifyError } = await supabase
      .from('subscribers')
      .select('email, username, is_active')
      .eq('email', email)
      .eq('username', username)
      .single();

    if (verifyError || !subscriber) {
      return NextResponse.json(
        { message: 'Invalid credentials. Please log in again.' },
        { status: 401 }
      );
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { message: 'Your subscription is not active.' },
        { status: 403 }
      );
    }

    // If replying to a comment, verify parent exists
    if (parentCommentId) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parentCommentId)
        .eq('is_deleted', false)
        .single();

      if (parentError || !parentComment) {
        return NextResponse.json(
          { message: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Insert comment/reply
    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert([
        {
          article_slug: slug,
          user_email: email,
          username: username,
          comment_text: commentText.trim(),
          parent_comment_id: parentCommentId || null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      throw insertError;
    }

    return NextResponse.json(
      {
        message: parentCommentId ? 'Reply posted successfully!' : 'Comment posted successfully!',
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Comment submission error:', error);
    return NextResponse.json(
      { message: 'Failed to post comment. Please try again.' },
      { status: 500 }
    );
  }
}
