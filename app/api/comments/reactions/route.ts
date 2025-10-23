import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch reaction counts and user's reaction for a comment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const userEmail = searchParams.get('userEmail');

    if (!commentId) {
      return NextResponse.json(
        { message: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Get reaction counts
    const { data: reactions, error: reactionsError } = await supabase
      .from('comment_reactions')
      .select('reaction_type')
      .eq('comment_id', commentId);

    if (reactionsError) {
      console.error('Error fetching reactions:', reactionsError);
      // Table might not exist yet - return zeros instead of error
      if (reactionsError.code === '42P01') { // Table doesn't exist
        return NextResponse.json({
          commentId,
          likeCount: 0,
          dislikeCount: 0,
          userReaction: null,
        });
      }
      return NextResponse.json(
        { message: 'Failed to fetch reactions', error: reactionsError.message },
        { status: 500 }
      );
    }

    const likeCount = reactions?.filter(r => r.reaction_type === 'like').length || 0;
    const dislikeCount = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

    // Get user's reaction if email provided
    let userReaction = null;
    if (userEmail) {
      const { data: userReactionData } = await supabase
        .from('comment_reactions')
        .select('reaction_type')
        .eq('comment_id', commentId)
        .eq('user_email', userEmail)
        .single();

      userReaction = userReactionData?.reaction_type || null;
    }

    return NextResponse.json({
      commentId,
      likeCount,
      dislikeCount,
      userReaction,
    });
  } catch (error) {
    console.error('Error in GET /api/comments/reactions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add or update a reaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, userEmail, reactionType, commentAuthorEmail } = body;

    // Validation
    if (!commentId || !userEmail || !reactionType) {
      return NextResponse.json(
        { message: 'Comment ID, user email, and reaction type are required' },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(reactionType)) {
      return NextResponse.json(
        { message: 'Reaction type must be "like" or "dislike"' },
        { status: 400 }
      );
    }

    // Rule: Users cannot react to their own comments
    if (commentAuthorEmail && userEmail === commentAuthorEmail) {
      return NextResponse.json(
        { message: 'You cannot react to your own comment' },
        { status: 403 }
      );
    }

    // Check if user already has a reaction
    const { data: existingReactions, error: selectError } = await supabase
      .from('comment_reactions')
      .select('id, reaction_type')
      .eq('comment_id', commentId)
      .eq('user_email', userEmail);
    
    if (selectError) {
      console.error('Error checking existing reaction:', selectError);
      return NextResponse.json(
        { message: 'Failed to check existing reaction' },
        { status: 500 }
      );
    }
    
    const existingReaction = existingReactions?.[0];

    if (existingReaction) {
      // If clicking the same reaction, remove it (toggle off)
      if (existingReaction.reaction_type === reactionType) {
        const { error: deleteError } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (deleteError) {
          console.error('Error deleting reaction:', deleteError);
          return NextResponse.json(
            { message: 'Failed to remove reaction' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Reaction removed',
          action: 'removed',
          reactionType,
        });
      } else {
        // If clicking different reaction, update it (like -> dislike or vice versa)
        const { error: updateError } = await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existingReaction.id);

        if (updateError) {
          console.error('Error updating reaction:', updateError);
          return NextResponse.json(
            { message: 'Failed to update reaction' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Reaction updated',
          action: 'updated',
          reactionType,
        });
      }
    } else {
      // No existing reaction, create new one
      const { error: insertError } = await supabase
        .from('comment_reactions')
        .insert({
          comment_id: commentId,
          user_email: userEmail,
          reaction_type: reactionType,
        });

      if (insertError) {
        console.error('Error inserting reaction:', insertError);
        return NextResponse.json(
          { message: 'Failed to add reaction' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Reaction added',
        action: 'added',
        reactionType,
      });
    }
  } catch (error) {
    console.error('Error in POST /api/comments/reactions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
