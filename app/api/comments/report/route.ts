import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';
import { getUser, getAuthenticatedSubscriber } from '@/lib/supabaseServerAuth';

const REPORT_THRESHOLD = 3;
const DEFAULT_REASON = 'spam';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get subscriber profile
    const subscriber = await getAuthenticatedSubscriber(request);
    if (!subscriber) {
      return NextResponse.json(
        { message: 'Subscriber profile not found' },
        { status: 403 }
      );
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { message: 'Your subscription is not active.' },
        { status: 403 }
      );
    }

    const { commentId, reason } = await request.json();
    const reporterEmail = subscriber.email;
    const reporterUsername = subscriber.username;

    if (!commentId) {
      return NextResponse.json(
        { message: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const normalizedReason = (reason || DEFAULT_REASON).toString().trim().slice(0, 200) || DEFAULT_REASON;

    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('id, user_email, is_hidden, moderation_status, hidden_reason')
      .eq('id', commentId)
      .eq('is_deleted', false)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.user_email === reporterEmail) {
      return NextResponse.json(
        { message: 'You cannot report your own comment' },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabaseClient();

    const { data: existingReport, error: existingReportError } = await serviceSupabase
      .from('comment_flags')
      .select('id')
      .eq('comment_id', commentId)
      .eq('flag_type', 'manual_report')
      .eq('status', 'open')
      .filter('trigger_details->>reporterEmail', 'eq', reporterEmail)
      .maybeSingle();

    if (existingReportError && existingReportError.code !== 'PGRST116') {
      console.error('Failed to check existing reports:', existingReportError);
      return NextResponse.json(
        { message: 'Unable to submit report at this time' },
        { status: 500 }
      );
    }

    if (existingReport) {
      return NextResponse.json(
        { message: 'You have already reported this comment' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const { error: insertError } = await serviceSupabase
      .from('comment_flags')
      .insert({
        comment_id: commentId,
        flag_type: 'manual_report',
        trigger_source: 'user',
        trigger_details: {
          reporterEmail,
          reporterUsername,
          reason: normalizedReason,
        },
        last_touched_by: reporterUsername || reporterEmail,
        last_touched_at: now,
      });

    if (insertError) {
      console.error('Failed to insert manual report flag:', insertError);
      return NextResponse.json(
        { message: 'Unable to submit report at this time' },
        { status: 500 }
      );
    }

    const { data: manualReports, error: reportsError } = await serviceSupabase
      .from('comment_flags')
      .select('trigger_details')
      .eq('comment_id', commentId)
      .eq('flag_type', 'manual_report')
      .eq('status', 'open');

    if (reportsError) {
      console.error('Failed to count manual reports:', reportsError);
      return NextResponse.json(
        { message: 'Report submitted, but failed to evaluate moderation status' },
        { status: 202 }
      );
    }

    const uniqueReporters = new Set<string>();
    manualReports?.forEach((flag) => {
      const reportedBy = (flag.trigger_details as Record<string, unknown>)?.reporterEmail;
      if (typeof reportedBy === 'string' && reportedBy.length > 0) {
        uniqueReporters.add(reportedBy);
      }
    });

    let moderation = {
      isHidden: Boolean(comment.is_hidden),
      status: comment.moderation_status || 'visible',
      hiddenReason: comment.hidden_reason || null,
    };

    if (!comment.is_hidden && uniqueReporters.size >= REPORT_THRESHOLD) {
      const now = new Date().toISOString();
      const hideReason = `Hidden after ${uniqueReporters.size} user reports`;

      const { data: updatedComment, error: hideError } = await serviceSupabase
        .from('comments')
        .update({
          is_hidden: true,
          hidden_reason: hideReason,
          hidden_at: now,
          moderation_status: 'manual_hidden',
        })
        .eq('id', commentId)
        .select('is_hidden, hidden_reason, moderation_status')
        .single();

      if (hideError) {
        console.error('Failed to hide comment after reports:', hideError);
      } else if (updatedComment) {
        moderation = {
          isHidden: Boolean(updatedComment.is_hidden),
          status: updatedComment.moderation_status || 'manual_hidden',
          hiddenReason: updatedComment.hidden_reason || hideReason,
        };

        const { error: logHideError } = await serviceSupabase.from('comment_flags').insert({
          comment_id: commentId,
          flag_type: 'manual_hide',
          trigger_source: 'system',
          trigger_details: {
            reason: 'user_report_threshold',
            reportCount: uniqueReporters.size,
            threshold: REPORT_THRESHOLD,
          },
          last_touched_by: 'system',
          last_touched_at: now,
        });

        if (logHideError) {
          console.error('Failed to log manual hide flag:', logHideError);
        }
      }
    }

    return NextResponse.json({
      message: moderation.isHidden
        ? 'Thanks for flagging. This comment has been hidden pending review.'
        : 'Thanks for flagging. Our moderators will review it soon.',
      reportCount: uniqueReporters.size,
      reportThreshold: REPORT_THRESHOLD,
      moderation,
    });
  } catch (error) {
    console.error('Error in POST /api/comments/report:', error);
    return NextResponse.json(
      { message: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
