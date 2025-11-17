import { getArticleBySlug } from './articles';

export type FlagType =
  | 'auto_dislike_threshold'
  | 'auto_banned_phrase'
  | 'auto_link_spam'
  | 'manual_report'
  | 'manual_hide';

export type TriggerSource = 'system' | 'user' | 'moderator';

export type QueueStatus = 'open' | 'triage' | 'escalated' | 'resolved';

export type ModerationStatus =
  | 'visible'
  | 'auto_hidden'
  | 'manual_hidden'
  | 'resolved'
  | (string & {});

export type TimeWindowValue = '24h' | '7d' | '30d' | '90d';

const ARTICLE_TITLE_CACHE = new Map<string, string>();

const TIME_WINDOW_CONFIG: Record<TimeWindowValue, { label: string; ms: number }> = {
  '24h': { label: 'Last 24 hours', ms: 24 * 60 * 60 * 1000 },
  '7d': { label: 'Last 7 days', ms: 7 * 24 * 60 * 60 * 1000 },
  '30d': { label: 'Last 30 days', ms: 30 * 24 * 60 * 60 * 1000 },
  '90d': { label: 'Last 90 days', ms: 90 * 24 * 60 * 60 * 1000 },
};

const FLAG_PRIORITY: Record<FlagType, number> = {
  manual_hide: 50,
  manual_report: 40,
  auto_banned_phrase: 35,
  auto_link_spam: 25,
  auto_dislike_threshold: 20,
};

export function getArticleTitle(slug?: string | null): string {
  if (!slug) return 'Unknown article';
  if (ARTICLE_TITLE_CACHE.has(slug)) {
    return ARTICLE_TITLE_CACHE.get(slug)!;
  }

  const article = getArticleBySlug(slug);
  const title = article?.title?.trim() || slug.replace(/[-_]/g, ' ');
  ARTICLE_TITLE_CACHE.set(slug, title);
  return title;
}

export function summarizeCommentText(text: string | null | undefined, maxLength = 220): string {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function parseTimeWindow(value?: string | null) {
  const fallback: TimeWindowValue = '24h';
  if (!value || !TIME_WINDOW_CONFIG[value as TimeWindowValue]) {
    const now = new Date();
    return {
      start: new Date(now.getTime() - TIME_WINDOW_CONFIG[fallback].ms),
      end: now,
      label: TIME_WINDOW_CONFIG[fallback].label,
      value: fallback,
    };
  }

  const windowValue = value as TimeWindowValue;
  const now = new Date();
  const start = new Date(now.getTime() - TIME_WINDOW_CONFIG[windowValue].ms);

  return {
    start,
    end: now,
    label: TIME_WINDOW_CONFIG[windowValue].label,
    value: windowValue,
  };
}

export function computeSeverity(
  flagType: FlagType,
  options: {
    manualReportCount?: number;
    moderationStatus?: ModerationStatus | null;
    isHidden?: boolean;
  } = {}
): 'low' | 'medium' | 'high' {
  const manualReports = options.manualReportCount ?? 0;
  const moderationStatus = options.moderationStatus ?? 'visible';
  const isHidden = options.isHidden ?? false;

  if (flagType === 'manual_hide' || moderationStatus === 'manual_hidden') {
    return 'high';
  }

  if (flagType === 'auto_banned_phrase') {
    return 'high';
  }

  if (flagType === 'manual_report') {
    if (manualReports >= 5) {
      return 'high';
    }
    if (manualReports >= 3 || isHidden) {
      return 'medium';
    }
    return 'low';
  }

  if (flagType === 'auto_link_spam' || flagType === 'auto_dislike_threshold') {
    return isHidden ? 'medium' : 'low';
  }

  return isHidden ? 'medium' : 'low';
}

export function deriveQueueStatus(options: {
  flagStatus: string;
  flagType: FlagType;
  moderationStatus?: ModerationStatus | null;
  autoHidden: boolean;
  manualReportCount?: number;
}): QueueStatus {
  const moderationStatus = options.moderationStatus ?? 'visible';
  const manualReportCount = options.manualReportCount ?? 0;

  if (options.flagStatus === 'resolved' || moderationStatus === 'resolved') {
    return 'resolved';
  }

  if (options.flagType === 'manual_hide' || moderationStatus === 'manual_hidden') {
    return 'escalated';
  }

  if (manualReportCount >= 3) {
    return 'escalated';
  }

  if (options.autoHidden || moderationStatus === 'auto_hidden') {
    return 'triage';
  }

  return 'open';
}

export function scoreFlagPriority(flag: {
  flag_type: FlagType;
  status: string;
  created_at?: string | null;
}): number {
  const base = FLAG_PRIORITY[flag.flag_type] ?? 10;
  const statusBoost = flag.status === 'open' ? 100 : 0;
  const timestampBoost = flag.created_at ? new Date(flag.created_at).getTime() / 1_000_000 : 0;
  return base + statusBoost + timestampBoost;
}

export function ensureRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function flagTypeLabel(flagType: FlagType): string {
  switch (flagType) {
    case 'manual_report':
      return 'Manual reports';
    case 'manual_hide':
      return 'Manual hides';
    case 'auto_banned_phrase':
      return 'Banned phrases';
    case 'auto_link_spam':
      return 'Link spam';
    case 'auto_dislike_threshold':
      return 'Dislike threshold';
    default:
      return flagType;
  }
}
