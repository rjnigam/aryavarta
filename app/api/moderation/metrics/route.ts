import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';
import {
  computeSeverity,
  ensureRecord,
  flagTypeLabel,
  parseTimeWindow,
  type FlagType,
  type TriggerSource,
} from '@/lib/moderation';

const querySchema = z.object({
  window: z.enum(['24h', '7d', '30d', '90d']).default('24h'),
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
    is_hidden: boolean | null;
    hidden_reason: string | null;
    hidden_at: string | null;
    moderation_status: string | null;
  } | null;
};

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }
  return Math.round(sorted[middle]);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const params = querySchema.parse(rawParams);

    const windowInfo = parseTimeWindow(params.window);
    const serviceSupabase = getServiceSupabaseClient();

    const { data: flags, error } = await serviceSupabase
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
           is_hidden,
           hidden_reason,
           hidden_at,
           moderation_status
         )`
      )
      .gte('created_at', windowInfo.start.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[moderation.metrics] Failed to load moderation metrics:', error);
      return NextResponse.json(
        { message: 'Unable to load moderation metrics' },
        { status: 500 }
      );
    }

    if (!flags || flags.length === 0) {
      return NextResponse.json({
        window: {
          value: windowInfo.value,
          label: windowInfo.label,
          start: windowInfo.start.toISOString(),
          end: windowInfo.end.toISOString(),
        },
        summary: {
          openFlags: 0,
          autoHidden: 0,
          manualReportOpen: 0,
          escalated: 0,
          medianResponseMinutes: null,
        },
        breakdown: [],
        totals: {
          uniqueComments: 0,
          totalFlags: 0,
        },
        severity: {
          high: 0,
          medium: 0,
          low: 0,
        },
        openBySource: {
          system: 0,
          user: 0,
          moderator: 0,
        },
        lastUpdated: new Date().toISOString(),
      });
    }

    const summary = {
      openFlags: 0,
      autoHidden: 0,
      manualReportOpen: 0,
      escalated: 0,
      medianResponseMinutes: null as number | null,
    };

    const totals = {
      uniqueComments: 0,
      totalFlags: flags.length,
    };

    const openBySource: Record<TriggerSource, number> = {
      system: 0,
      user: 0,
      moderator: 0,
    };

    const breakdownMap = new Map<FlagType, { total: number; open: number; resolved: number }>();
    const severityByComment = new Map<string, 'low' | 'medium' | 'high'>();
    const responseDurations: number[] = [];
    const autoHiddenComments = new Set<string>();
    const escalatedComments = new Set<string>();
    const uniqueCommentIds = new Set<string>();

  const typedFlags = flags as unknown as FlagRow[];

  for (const row of typedFlags) {
      uniqueCommentIds.add(row.comment_id);
      totals.uniqueComments = uniqueCommentIds.size;

      const comment = row.comments;
      const isHidden = Boolean(comment?.is_hidden);
      const moderationStatus = comment?.moderation_status ?? undefined;

      const breakdown = breakdownMap.get(row.flag_type) ?? { total: 0, open: 0, resolved: 0 };
      breakdown.total += 1;
      if (row.status === 'open') {
        breakdown.open += 1;
      } else {
        breakdown.resolved += 1;
      }
      breakdownMap.set(row.flag_type, breakdown);

      if (row.status === 'open') {
        summary.openFlags += 1;
        openBySource[row.trigger_source] += 1;
      }

      if (row.flag_type === 'manual_report' && row.status === 'open') {
        summary.manualReportOpen += 1;
      }

      if (comment?.moderation_status === 'manual_hidden' || row.flag_type === 'manual_hide') {
        escalatedComments.add(row.comment_id);
      }

      if (
        comment?.moderation_status === 'auto_hidden' ||
        (row.flag_type.startsWith('auto_') && isHidden)
      ) {
        autoHiddenComments.add(row.comment_id);
      }

      const severity = computeSeverity(row.flag_type, {
        manualReportCount:
          row.flag_type === 'manual_report'
            ? 1
            : typeof ensureRecord(row.trigger_details).reportCount === 'number'
            ? (ensureRecord(row.trigger_details).reportCount as number)
            : undefined,
        moderationStatus,
        isHidden,
      });

      const current = severityByComment.get(row.comment_id);
      const score = severityRank(severity);
      if (current === undefined || score > severityRank(current)) {
        severityByComment.set(row.comment_id, severity);
      }

      if (row.resolved_at) {
        const createdAt = new Date(row.created_at).getTime();
        const resolvedAt = new Date(row.resolved_at).getTime();
        if (!Number.isNaN(createdAt) && !Number.isNaN(resolvedAt) && resolvedAt >= createdAt) {
          const minutes = Math.round((resolvedAt - createdAt) / (60 * 1000));
          if (!Number.isNaN(minutes) && minutes >= 0) {
            responseDurations.push(minutes);
          }
        }
      }
    }

    summary.autoHidden = autoHiddenComments.size;
    summary.escalated = escalatedComments.size;
    summary.medianResponseMinutes = median(responseDurations);

    const breakdown = Array.from(breakdownMap.entries())
        .map(([flagType, value]) => ({
          flagType,
          label: flagTypeLabel(flagType),
          total: value.total,
          open: value.open,
          resolved: value.resolved,
        }))
      .sort((a, b) => b.total - a.total);

    const severityBuckets = { high: 0, medium: 0, low: 0 } as Record<'high' | 'medium' | 'low', number>;
    for (const severity of severityByComment.values()) {
      severityBuckets[severity] += 1;
    }

    return NextResponse.json({
      window: {
        value: windowInfo.value,
        label: windowInfo.label,
        start: windowInfo.start.toISOString(),
        end: windowInfo.end.toISOString(),
      },
      summary,
      breakdown,
      totals,
      severity: severityBuckets,
      openBySource,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[moderation.metrics] Unexpected error:', error);
    return NextResponse.json(
      { message: 'Failed to load moderation metrics' },
      { status: 500 }
    );
  }
}

function severityRank(value: 'low' | 'medium' | 'high'): number {
  switch (value) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
    default:
      return 1;
  }
}

