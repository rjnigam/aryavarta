import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';
import {
  ensureRecord,
  flagTypeLabel,
  getArticleTitle,
  parseTimeWindow,
  summarizeCommentText,
  type FlagType,
  type TriggerSource,
} from '@/lib/moderation';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  window: z.enum(['24h', '7d', '30d', '90d']).optional(),
});

type FlagRow = {
  id: string;
  comment_id: string;
  flag_type: FlagType;
  trigger_source: TriggerSource;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  trigger_details: Record<string, unknown> | null;
  comments: {
    id: string;
    article_slug: string;
    username: string;
    comment_text: string | null;
    moderation_status: string | null;
  } | null;
};

type ActivityItem = {
  id: string;
  timestamp: string;
  summary: string;
  detail: string;
  category: 'auto' | 'manual' | 'escalation' | 'resolution';
  flagType: FlagType;
  flagLabel: string;
  commentId: string;
  articleSlug: string;
  articleTitle: string;
  commentExcerpt: string;
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const params = querySchema.parse(rawParams);

    const windowInfo = params.window ? parseTimeWindow(params.window) : null;
    const filterStart = windowInfo?.start ?? null;

    const serviceSupabase = getServiceSupabaseClient();

    const limitMultiplier = 4;
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
         comments:comment_id (
           id,
           article_slug,
           username,
           comment_text,
           moderation_status
         )`
      )
      .order('created_at', { ascending: false })
      .limit(params.limit * limitMultiplier);

    if (filterStart) {
      const iso = filterStart.toISOString();
      query = query.or(`created_at.gte.${iso},resolved_at.gte.${iso}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[moderation.activity] Failed to load activity feed:', error);
      return NextResponse.json(
        { message: 'Unable to load moderation activity' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({
        items: [],
        meta: {
          total: 0,
          limit: params.limit,
          window: params.window ?? null,
        },
      });
    }

    const events: ActivityItem[] = [];
    const typedRows = data as unknown as FlagRow[];

    for (const row of typedRows) {
      if (!row.comments) continue;

      const comment = row.comments;
      const articleTitle = getArticleTitle(comment.article_slug);
      const excerpt = summarizeCommentText(comment.comment_text, 180);
      const flagLabel = flagTypeLabel(row.flag_type);
      const details = ensureRecord(row.trigger_details);

      const createdAt = new Date(row.created_at);
      if (!filterStart || createdAt >= filterStart) {
        events.push({
          id: `${row.id}-created`,
          timestamp: createdAt.toISOString(),
          summary: creationSummary(row),
          detail: creationDetail(row, flagLabel, articleTitle, details),
          category: creationCategory(row),
          flagType: row.flag_type,
          flagLabel,
          commentId: row.comment_id,
          articleSlug: comment.article_slug,
          articleTitle,
          commentExcerpt: excerpt,
        });
      }

      if (row.resolved_at) {
        const resolvedAt = new Date(row.resolved_at);
        if (!filterStart || resolvedAt >= filterStart) {
          events.push({
            id: `${row.id}-resolved`,
            timestamp: resolvedAt.toISOString(),
            summary: resolutionSummary(row),
            detail: resolutionDetail(row, flagLabel, articleTitle, details),
            category: 'resolution',
            flagType: row.flag_type,
            flagLabel,
            commentId: row.comment_id,
            articleSlug: comment.article_slug,
            articleTitle,
            commentExcerpt: excerpt,
          });
        }
      }
    }

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const limitedEvents = events.slice(0, params.limit);

    return NextResponse.json({
      items: limitedEvents,
      meta: {
        total: events.length,
        limit: params.limit,
        window: params.window ?? null,
      },
    });
  } catch (error) {
    console.error('[moderation.activity] Unexpected error:', error);
    return NextResponse.json(
      { message: 'Failed to load moderation activity' },
      { status: 500 }
    );
  }
}

function creationCategory(row: FlagRow): ActivityItem['category'] {
  if (row.flag_type === 'manual_hide') {
    return 'escalation';
  }
  if (row.flag_type.startsWith('auto_')) {
    return 'auto';
  }
  if (row.flag_type === 'manual_report') {
    return 'manual';
  }
  return row.trigger_source === 'moderator' ? 'escalation' : 'manual';
}

function creationSummary(row: FlagRow): string {
  switch (row.flag_type) {
    case 'manual_report':
      return 'New manual report logged';
    case 'manual_hide':
      return 'Comment manually hidden by moderator';
    case 'auto_banned_phrase':
      return 'Banned phrase detected';
    case 'auto_link_spam':
      return 'Link spam auto-hidden';
    case 'auto_dislike_threshold':
      return 'Dislike threshold reached';
    default:
      return 'Comment flagged';
  }
}

function creationDetail(
  row: FlagRow,
  flagLabel: string,
  articleTitle: string,
  details: Record<string, unknown>
): string {
  const base = `${flagLabel} on “${articleTitle}”.`;

  if (row.flag_type === 'manual_report') {
    const reporter = typeof details.reporterUsername === 'string' ? details.reporterUsername : null;
    if (reporter) {
      return `${base} Reported by ${reporter}.`;
    }
    return `${base} Report submitted by subscriber.`;
  }

  if (row.flag_type === 'manual_hide') {
    const reason = typeof details.reason === 'string' ? details.reason : null;
    if (reason) {
      return `${base} Reason: ${reason}.`;
    }
    return `${base} Hidden pending moderator review.`;
  }

  if (row.flag_type === 'auto_banned_phrase') {
    const phrase = typeof details.bannedPhrase === 'string' ? details.bannedPhrase : null;
    if (phrase) {
      return `${base} Phrase matched: “${phrase}”.`;
    }
  }

  if (row.flag_type === 'auto_link_spam') {
    const linkCount = typeof details.linkCount === 'number' ? details.linkCount : null;
    if (linkCount !== null) {
      return `${base} Detected ${linkCount} links.`;
    }
  }

  if (row.flag_type === 'auto_dislike_threshold') {
    const dislikeCount = typeof details.dislikeCount === 'number' ? details.dislikeCount : null;
    const likeCount = typeof details.likeCount === 'number' ? details.likeCount : null;
    if (typeof dislikeCount === 'number' && typeof likeCount === 'number') {
      return `${base} ${dislikeCount} dislikes vs ${likeCount} likes.`;
    }
  }

  return base;
}

function resolutionSummary(row: FlagRow): string {
  if (row.flag_type === 'manual_hide') {
    return 'Moderator resolution recorded';
  }
  return 'Flag resolved';
}

function resolutionDetail(
  row: FlagRow,
  flagLabel: string,
  articleTitle: string,
  details: Record<string, unknown>
): string {
  const resolvedBy = typeof details.resolvedBy === 'string' ? details.resolvedBy : null;
  const actor = resolvedBy ?? 'Moderator team';
  if (row.flag_type === 'manual_hide') {
    return `${flagLabel} on “${articleTitle}” resolved by ${actor}. Comment restored.`;
  }
  return `${flagLabel} on “${articleTitle}” resolved by ${actor}.`;
}
