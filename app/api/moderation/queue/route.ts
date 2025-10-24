import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';
import {
  computeSeverity,
  deriveQueueStatus,
  ensureRecord,
  getArticleTitle,
  parseTimeWindow,
  scoreFlagPriority,
  summarizeCommentText,
  type FlagType,
  type QueueStatus,
  type TriggerSource,
} from '@/lib/moderation';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(['open', 'triage', 'escalated', 'resolved']).optional(),
  flagType: z.enum([
    'auto_dislike_threshold',
    'auto_banned_phrase',
    'auto_link_spam',
    'manual_report',
    'manual_hide',
  ]).optional(),
  triggerSource: z.enum(['system', 'user', 'moderator']).optional(),
  articleSlug: z.string().min(1).optional(),
  window: z.enum(['24h', '7d', '30d', '90d']).optional(),
  includeResolved: z.coerce.boolean().optional(),
});

type RawFlagRow = {
  id: string;
  comment_id: string;
  flag_type: FlagType;
  trigger_source: TriggerSource;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  trigger_details: Record<string, unknown> | null;
  assigned_to: string | null;
  notes: string | null;
  last_touched_by: string | null;
  comments: {
    id: string;
    article_slug: string;
    username: string;
    user_email: string;
    comment_text: string | null;
    created_at: string;
    is_hidden: boolean | null;
    hidden_reason: string | null;
    hidden_at: string | null;
    moderation_status: string | null;
  } | null;
};

type ReactionRow = {
  comment_id: string;
  reaction_type: 'like' | 'dislike';
};

type QueueItem = {
  id: string;
  commentId: string;
  articleSlug: string;
  articleTitle: string;
  commentExcerpt: string;
  flagType: FlagType;
  triggerSource: TriggerSource;
  status: QueueStatus;
  reportCount: number;
  flaggedAt: string;
  lastActionAt: string;
  reporterNames: string[];
  autoHidden: boolean;
  moderationStatus: string;
  severity: 'low' | 'medium' | 'high';
  hiddenReason: string | null;
  likeCount: number;
  dislikeCount: number;
  assignedTo: string | null;
  notes: string | null;
  lastTouchedBy: string | null;
  commentUsername: string;
};

type AggregatedComment = {
  commentId: string;
  comment: NonNullable<RawFlagRow['comments']>;
  flagScore: number;
  primaryFlag: RawFlagRow;
  flaggedAt: string;
  manualReporterEmails: Set<string>;
  manualReporterNames: Set<string>;
  assignedTo: { value: string; createdAt: string } | null;
  notes: { value: string; createdAt: string } | null;
  lastTouchedBy: { value: string; createdAt: string } | null;
  timestamps: string[];
  rawFlags: RawFlagRow[];
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const params = querySchema.parse(rawParams);

    const { start } = parseTimeWindow(params.window);
    const fetchUpperBound = Math.min(params.limit + params.offset + 50, 500);

    const serviceSupabase = getServiceSupabaseClient();

    let query = serviceSupabase
      .from('comment_flags')
      .select(
        `id,
         comment_id,
         flag_type,
         trigger_source,
         status,
         created_at,
         resolved_at,
         trigger_details,
         assigned_to,
         notes,
         last_touched_by,
         comments:comment_id (
           id,
           article_slug,
           username,
           user_email,
           comment_text,
           created_at,
           is_hidden,
           hidden_reason,
           hidden_at,
           moderation_status
         )`
      )
      .order('created_at', { ascending: false })
      .range(0, fetchUpperBound - 1);

    // Only filter by article slug at the SQL layer to keep related flags intact.
    if (params.articleSlug) {
      query = query.eq('comments.article_slug', params.articleSlug);
    }

    const { data: rawFlags, error } = await query;

    if (error) {
      console.error('[moderation.queue] Failed to load flags:', error);
      return NextResponse.json(
        { message: 'Unable to load moderation queue' },
        { status: 500 }
      );
    }

    if (!rawFlags || rawFlags.length === 0) {
      return NextResponse.json({
        items: [],
        meta: {
          total: 0,
          limit: params.limit,
          offset: params.offset,
          window: params.window ?? '24h',
        },
      });
    }

    const aggregated = new Map<string, AggregatedComment>();

  const typedFlags = rawFlags as unknown as RawFlagRow[];

  for (const flag of typedFlags) {
      if (!flag.comments) continue;

      const commentId = flag.comments.id;
      let record = aggregated.get(commentId);
      if (!record) {
        record = {
          commentId,
          comment: flag.comments,
          flagScore: Number.NEGATIVE_INFINITY,
          primaryFlag: flag,
          flaggedAt: flag.created_at,
          manualReporterEmails: new Set<string>(),
          manualReporterNames: new Set<string>(),
          assignedTo: flag.assigned_to
            ? { value: flag.assigned_to, createdAt: flag.created_at }
            : null,
          notes: flag.notes ? { value: flag.notes, createdAt: flag.created_at } : null,
          lastTouchedBy: flag.last_touched_by
            ? { value: flag.last_touched_by, createdAt: flag.created_at }
            : null,
          timestamps: [flag.created_at, flag.resolved_at ?? flag.created_at],
          rawFlags: [],
        };
        aggregated.set(commentId, record);
      }

      const score = scoreFlagPriority(flag);
      if (score > record.flagScore) {
        record.flagScore = score;
        record.primaryFlag = flag;
      }

      if (new Date(flag.created_at).getTime() < new Date(record.flaggedAt).getTime()) {
        record.flaggedAt = flag.created_at;
      }

      if (flag.assigned_to) {
        if (!record.assignedTo || new Date(flag.created_at) > new Date(record.assignedTo.createdAt)) {
          record.assignedTo = { value: flag.assigned_to, createdAt: flag.created_at };
        }
      }

      if (flag.notes) {
        if (!record.notes || new Date(flag.created_at) > new Date(record.notes.createdAt)) {
          record.notes = { value: flag.notes, createdAt: flag.created_at };
        }
      }

      if (flag.last_touched_by) {
        if (!record.lastTouchedBy || new Date(flag.created_at) > new Date(record.lastTouchedBy.createdAt)) {
          record.lastTouchedBy = { value: flag.last_touched_by, createdAt: flag.created_at };
        }
      }

      record.timestamps.push(flag.created_at);
      if (flag.resolved_at) {
        record.timestamps.push(flag.resolved_at);
      }

      if (flag.flag_type === 'manual_report') {
        const details = ensureRecord(flag.trigger_details);
        const reporterEmail = typeof details.reporterEmail === 'string' ? details.reporterEmail : null;
        const reporterUsername = typeof details.reporterUsername === 'string' ? details.reporterUsername : null;
        if (reporterEmail) {
          record.manualReporterEmails.add(reporterEmail);
        }
        if (reporterUsername) {
          record.manualReporterNames.add(reporterUsername);
        }
      }

      record.rawFlags.push(flag);
    }

    let queueItems: QueueItem[] = [];
    const commentIds: string[] = [];

    for (const record of aggregated.values()) {
      commentIds.push(record.commentId);
      const comment = record.comment;
      const manualReportCount = record.manualReporterEmails.size;
      const primaryFlag = record.primaryFlag;

      const severity = computeSeverity(primaryFlag.flag_type, {
        manualReportCount,
        moderationStatus: comment.moderation_status ?? undefined,
        isHidden: Boolean(comment.is_hidden),
      });

      const status = deriveQueueStatus({
        flagStatus: primaryFlag.status,
        flagType: primaryFlag.flag_type,
        moderationStatus: comment.moderation_status ?? undefined,
        autoHidden: Boolean(comment.is_hidden),
        manualReportCount,
      });

      const reporterNames = Array.from(record.manualReporterNames.values());
      const timestamps = record.timestamps
        .filter(Boolean)
        .map((value) => new Date(value))
        .filter((date) => !Number.isNaN(date.getTime()));
      const lastAction = timestamps.length
        ? new Date(Math.max(...timestamps.map((date) => date.getTime())))
        : new Date(primaryFlag.created_at);

      queueItems.push({
        id: primaryFlag.id,
        commentId: record.commentId,
        articleSlug: comment.article_slug,
        articleTitle: getArticleTitle(comment.article_slug),
        commentExcerpt: summarizeCommentText(comment.comment_text, 240),
        flagType: primaryFlag.flag_type,
        triggerSource: primaryFlag.trigger_source,
        status,
        reportCount: manualReportCount,
        flaggedAt: new Date(record.flaggedAt).toISOString(),
        lastActionAt: lastAction.toISOString(),
        reporterNames,
        autoHidden: Boolean(comment.is_hidden),
        moderationStatus: comment.moderation_status ?? 'visible',
        severity,
        hiddenReason: comment.hidden_reason,
        likeCount: 0,
        dislikeCount: 0,
        assignedTo: record.assignedTo?.value ?? null,
        notes: record.notes?.value ?? null,
        lastTouchedBy: record.lastTouchedBy?.value ?? null,
        commentUsername: comment.username,
      });
    }

    if (commentIds.length > 0) {
      const { data: reactionRows, error: reactionsError } = await serviceSupabase
        .from('comment_reactions')
        .select('comment_id, reaction_type')
        .in('comment_id', commentIds);

      if (reactionsError) {
        console.error('[moderation.queue] Failed to load reactions:', reactionsError);
      } else if (reactionRows) {
        const reactionMap = new Map<string, { likeCount: number; dislikeCount: number }>();
        for (const reaction of reactionRows as ReactionRow[]) {
          const entry = reactionMap.get(reaction.comment_id) || { likeCount: 0, dislikeCount: 0 };
          if (reaction.reaction_type === 'like') {
            entry.likeCount += 1;
          } else {
            entry.dislikeCount += 1;
          }
          reactionMap.set(reaction.comment_id, entry);
        }

        queueItems = queueItems.map((item) => {
          const reactions = reactionMap.get(item.commentId);
          return reactions
            ? { ...item, likeCount: reactions.likeCount, dislikeCount: reactions.dislikeCount }
            : item;
        });
      }
    }

    queueItems.sort((a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime());

    const windowStart = start.getTime();
    queueItems = queueItems.filter((item) => new Date(item.flaggedAt).getTime() >= windowStart);

    if (params.status) {
      queueItems = queueItems.filter((item) => item.status === params.status);
    }

    if (params.flagType) {
      queueItems = queueItems.filter((item) => item.flagType === params.flagType);
    }

    if (params.triggerSource) {
      queueItems = queueItems.filter((item) => item.triggerSource === params.triggerSource);
    }

    if (!params.includeResolved && params.status !== 'resolved') {
      queueItems = queueItems.filter((item) => item.status !== 'resolved');
    }

    if (params.articleSlug) {
      queueItems = queueItems.filter((item) => item.articleSlug === params.articleSlug);
    }

    const total = queueItems.length;
    const paginated = queueItems.slice(params.offset, params.offset + params.limit);

    return NextResponse.json({
      items: paginated,
      meta: {
        total,
        limit: params.limit,
        offset: params.offset,
        window: params.window ?? '24h',
      },
    });
  } catch (error) {
    console.error('[moderation.queue] Unexpected error:', error);
    return NextResponse.json(
      { message: 'Failed to load moderation queue' },
      { status: 500 }
    );
  }
}
