'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  EyeOff,
  Users,
  Clock,
  TriangleAlert,
  Filter,
  Search,
  ChevronRight,
  Flag,
  CheckCircle2,
  BarChart2,
  Zap,
  Eye,
  Loader2,
  RefreshCcw,
  CircleAlert,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type FlagType =
  | 'auto_dislike_threshold'
  | 'auto_banned_phrase'
  | 'auto_link_spam'
  | 'manual_report'
  | 'manual_hide';

type TriggerSource = 'system' | 'user' | 'moderator';

type QueueStatus = 'open' | 'triage' | 'escalated' | 'resolved';

type ModerationStatus = 'visible' | 'auto_hidden' | 'manual_hidden' | 'resolved' | (string & {});

type SeverityLevel = 'low' | 'medium' | 'high';

type ActivityCategory = 'auto' | 'manual' | 'resolution' | 'escalation';

type TimeWindowValue = '24h' | '7d' | '30d' | '90d';

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
  moderationStatus: ModerationStatus;
  severity: SeverityLevel;
  hiddenReason: string | null;
  likeCount: number;
  dislikeCount: number;
  assignedTo: string | null;
  notes: string | null;
  lastTouchedBy: string | null;
  commentUsername: string;
};

type QueueResponse = {
  items: QueueItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    window?: string | null;
  };
};

type MetricsResponse = {
  window: {
    value: TimeWindowValue;
    label: string;
    start: string;
    end: string;
  };
  summary: {
    openFlags: number;
    autoHidden: number;
    manualReportOpen: number;
    escalated: number;
    medianResponseMinutes: number | null;
  };
  breakdown: Array<{
    flagType: FlagType;
    label: string;
    total: number;
    open: number;
    resolved: number;
  }>;
  totals: {
    uniqueComments: number;
    totalFlags: number;
  };
  severity: Record<SeverityLevel, number>;
  openBySource: Record<TriggerSource, number>;
  lastUpdated: string;
};

type ActivityItem = {
  id: string;
  timestamp: string;
  summary: string;
  detail: string;
  category: ActivityCategory;
  flagType: FlagType;
  flagLabel: string;
  commentId: string;
  articleSlug: string;
  articleTitle: string;
  commentExcerpt: string;
};

type ActivityResponse = {
  items: ActivityItem[];
  meta: {
    total: number;
    limit: number;
    window: string | null;
  };
};

type DashboardState = {
  queue: QueueResponse | null;
  metrics: MetricsResponse | null;
  activity: ActivityResponse | null;
};

const TIME_WINDOWS: Array<{ label: string; value: TimeWindowValue }> = [
  { label: 'Last 24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

const QUEUE_LIMIT = 25;
const ACTIVITY_LIMIT = 12;

const STATUS_STYLES: Record<QueueStatus, string> = {
  open: 'bg-vermillion-100 text-vermillion-700',
  triage: 'bg-saffron-100 text-saffron-700',
  escalated: 'bg-sacred-100 text-sacred-700',
  resolved: 'bg-green-100 text-green-700',
};

const CATEGORY_STYLES: Record<ActivityCategory, string> = {
  auto: 'bg-saffron-100 text-saffron-700',
  manual: 'bg-vermillion-100 text-vermillion-700',
  resolution: 'bg-green-100 text-green-700',
  escalation: 'bg-sacred-100 text-sacred-700',
};

const SEVERITY_BADGE_STYLES: Record<SeverityLevel, string> = {
  high: 'bg-vermillion-600/10 text-vermillion-700 border border-vermillion-200',
  medium: 'bg-saffron-600/10 text-saffron-700 border border-saffron-200',
  low: 'bg-green-600/10 text-green-700 border border-green-200',
};

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  high: 'High priority',
  medium: 'Needs review',
  low: 'FYI',
};

const SOURCE_LABELS: Record<TriggerSource, string> = {
  system: 'Automations',
  user: 'Subscriber reports',
  moderator: 'Moderator actions',
};

const numberFormatter = new Intl.NumberFormat('en-IN');

function formatRelativeTime(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

function statusLabel(status: QueueStatus) {
  switch (status) {
    case 'open':
      return 'Waiting triage';
    case 'triage':
      return 'In triage';
    case 'escalated':
      return 'Escalated';
    case 'resolved':
      return 'Resolved';
    default:
      return status;
  }
}

function localFlagTypeLabel(flagType: FlagType) {
  switch (flagType) {
    case 'manual_report':
      return 'Manual report';
    case 'manual_hide':
      return 'Manual hide';
    case 'auto_link_spam':
      return 'Link spam';
    case 'auto_dislike_threshold':
      return 'Dislike threshold';
    case 'auto_banned_phrase':
      return 'Banned phrase';
    default:
      return flagType;
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
        message = payload.message;
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        message = error.message;
      }
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

function useModerationDashboard(window: TimeWindowValue) {
  const [data, setData] = useState<DashboardState>({ queue: null, metrics: null, activity: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasDataRef = useRef(false);
  const firstLoadRef = useRef(true);

  const fetchData = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      if (!silent) {
        setIsLoading(true);
      }
      setIsRefreshing(true);
      setError(null);

      try {
        const [queue, metrics, activity] = await Promise.all([
          fetchJson<QueueResponse>(`/api/moderation/queue?window=${window}&limit=${QUEUE_LIMIT}`, {
            signal: controller.signal,
          }),
          fetchJson<MetricsResponse>(`/api/moderation/metrics?window=${window}`, {
            signal: controller.signal,
          }),
          fetchJson<ActivityResponse>(`/api/moderation/activity?window=${window}&limit=${ACTIVITY_LIMIT}`, {
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        hasDataRef.current = true;
        setData({ queue, metrics, activity });
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('[moderation.dashboard] failed to load data', err);
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading moderation data.';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [window]
  );

  useEffect(() => {
    const silent = !firstLoadRef.current && hasDataRef.current;
    firstLoadRef.current = false;
    fetchData({ silent });
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData({ silent: hasDataRef.current });
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}

export default function ModerationDashboardPage() {
  const [selectedWindow, setSelectedWindow] = useState<TimeWindowValue>('24h');
  const { data, error, isLoading, isRefreshing, refresh } = useModerationDashboard(selectedWindow);

  const queueItems = data.queue?.items ?? [];
  const queueMeta = data.queue?.meta;
  const activityItems = data.activity?.items ?? [];
  const metrics = data.metrics;

  const windowLabel =
    metrics?.window.label ??
    TIME_WINDOWS.find((option) => option.value === selectedWindow)?.label ??
    'Last 24 hours';

  const severityTotals = metrics?.severity ?? { high: 0, medium: 0, low: 0 };
  const openSourceTotals = metrics?.openBySource ?? { system: 0, user: 0, moderator: 0 };
  const totalFlags = metrics?.totals.totalFlags ?? 0;
  const totalComments = metrics?.totals.uniqueComments ?? 0;

  const showInitialLoader =
    isLoading && !metrics && queueItems.length === 0 && activityItems.length === 0;

  const statCards = useMemo(
    () => [
      {
        title: 'Open flags',
        value: metrics ? numberFormatter.format(metrics.summary.openFlags) : '—',
        change: metrics ? `${metrics.summary.escalated} escalated` : '—',
        icon: ShieldAlert,
        accent: 'from-vermillion-100 to-vermillion-50 text-vermillion-800',
      },
      {
        title: 'Auto-hidden',
        value: metrics ? numberFormatter.format(metrics.summary.autoHidden) : '—',
        change: 'Awaiting moderator review',
        icon: EyeOff,
        accent: 'from-saffron-100 to-white text-saffron-800',
      },
      {
        title: 'Manual reports',
        value: metrics ? numberFormatter.format(metrics.summary.manualReportOpen) : '—',
        change: 'Subscriber escalations pending',
        icon: Users,
        accent: 'from-sacred-100 to-white text-sacred-800',
      },
      {
        title: 'Median response',
        value:
          metrics && metrics.summary.medianResponseMinutes !== null
            ? `~${metrics.summary.medianResponseMinutes}m`
            : '—',
        change: 'Resolved flag turnaround',
        icon: Clock,
        accent: 'from-green-100 to-white text-green-800',
      },
    ],
    [metrics]
  );

  const queueInsights = useMemo(() => {
    if (queueItems.length === 0) {
      return {
        assignments: [] as Array<{
          key: string;
          assignee: string;
          count: number;
          escalated: number;
          triage: number;
        }>,
        articles: [] as Array<{
          slug: string;
          title: string;
          count: number;
          highSeverity: number;
        }>,
        reporters: [] as Array<{ name: string; count: number }>,
      };
    }

    const assignmentMap = new Map<
      string,
      {
        count: number;
        escalated: number;
        triage: number;
      }
    >();
    const articleMap = new Map<
      string,
      {
        title: string;
        count: number;
        highSeverity: number;
      }
    >();
    const reporterMap = new Map<string, number>();

    for (const item of queueItems) {
      const assignmentKey = item.assignedTo?.trim() || '__unassigned__';
      const assignment = assignmentMap.get(assignmentKey) ?? {
        count: 0,
        escalated: 0,
        triage: 0,
      };
      assignment.count += 1;
      if (item.status === 'escalated') {
        assignment.escalated += 1;
      }
      if (item.status === 'triage') {
        assignment.triage += 1;
      }
      assignmentMap.set(assignmentKey, assignment);

      const article = articleMap.get(item.articleSlug) ?? {
        title: item.articleTitle,
        count: 0,
        highSeverity: 0,
      };
      article.count += 1;
      if (item.severity === 'high') {
        article.highSeverity += 1;
      }
      articleMap.set(item.articleSlug, article);

      for (const reporter of item.reporterNames) {
        if (!reporter) continue;
        reporterMap.set(reporter, (reporterMap.get(reporter) ?? 0) + 1);
      }
    }

    const assignments = Array.from(assignmentMap.entries())
      .map(([key, value]) => ({
        key,
        assignee: key === '__unassigned__' ? 'Unassigned queue' : key,
        ...value,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const articles = Array.from(articleMap.entries())
      .map(([slug, value]) => ({ slug, ...value }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return b.highSeverity - a.highSeverity;
      })
      .slice(0, 3);

    const reporters = Array.from(reporterMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { assignments, articles, reporters };
  }, [queueItems]);

  const { assignments, articles, reporters } = queueInsights;

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="flex flex-col gap-4 border-b border-saffron-200 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600">
                Moderator Tooling · Phase 5C Live Data
              </p>
              <h1 className="text-4xl font-bold text-gray-900 font-serif">
                Comment Moderation Dashboard
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
                Live snapshot of the moderation queue, automation impact, and recent activity for
                the selected reporting window. Use this view to triage escalations, track response
                time, and coordinate moderator focus.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Clock size={14} />
                <span>
                  Updated {metrics ? formatRelativeTime(metrics.lastUpdated) : 'moments ago'}
                </span>
                {isRefreshing && <Loader2 size={14} className="animate-spin text-saffron-600" />}
              </div>
              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 bg-white px-4 py-2 text-sm font-semibold text-saffron-700 shadow-sm transition hover:bg-saffron-100/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw size={16} />
                Refresh data
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {TIME_WINDOWS.map((window) => (
              <button
                key={window.value}
                onClick={() => setSelectedWindow(window.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                  selectedWindow === window.value
                    ? 'bg-saffron-600 text-white shadow'
                    : 'bg-white text-saffron-700 border border-saffron-200 hover:bg-saffron-50'
                }`}
              >
                {window.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-vermillion-200 bg-vermillion-50 p-4 text-sm text-vermillion-800">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">We couldn’t load the moderation data.</p>
                <p className="mt-1 text-vermillion-700/80">{error}</p>
                <button
                  type="button"
                  onClick={() => refresh()}
                  className="mt-2 inline-flex items-center gap-2 rounded-md border border-vermillion-300 bg-white px-3 py-1 text-xs font-semibold text-vermillion-700 transition hover:bg-vermillion-100/60"
                >
                  <RefreshCcw size={14} />
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              accent={card.accent}
              loading={!metrics && isLoading}
            />
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active moderation queue</h2>
                <p className="text-sm text-gray-500">
                  Ordered by severity, subscriber impact, and time since last action. Window:{' '}
                  <span className="font-semibold text-gray-700">{windowLabel}</span>.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
            <input
              placeholder="Search (coming soon)"
              className="w-full rounded-lg border border-saffron-200 bg-saffron-50/70 py-2 pl-10 pr-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200"
              readOnly
              disabled
            />
                </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-semibold text-saffron-700 transition hover:bg-saffron-100/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Filter size={14} /> Filters (soon)
          </button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-saffron-100">
              <table className="min-w-full divide-y divide-saffron-100 text-left text-sm">
                <thead className="bg-saffron-50/60 text-xs font-semibold uppercase tracking-wide text-saffron-700">
                  <tr>
                    <th className="px-4 py-3">Comment</th>
                    <th className="px-4 py-3">Flag</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reports</th>
                    <th className="px-4 py-3">Last action</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-saffron-100">
                  {showInitialLoader &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`queue-skeleton-${index}`} className="animate-pulse">
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="h-6 w-24 rounded-full bg-saffron-100/70" />
                              <span className="h-6 w-20 rounded-full bg-gray-100" />
                            </div>
                            <div className="h-4 w-3/4 rounded bg-gray-100" />
                            <div className="h-3 w-1/2 rounded bg-gray-100" />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-6 w-28 rounded-full bg-saffron-100/70" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-6 w-20 rounded-full bg-saffron-100/70" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-8 rounded bg-gray-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-20 rounded bg-gray-100" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="ml-auto h-6 w-24 rounded bg-gray-100" />
                        </td>
                      </tr>
                    ))}

                  {!showInitialLoader && queueItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                          <CheckCircle2 size={28} className="text-green-500" />
                          <p className="font-semibold text-gray-700">Queue is clear</p>
                          <p className="text-xs text-gray-500">
                            No active flags match the current filters. Auto-moderation is keeping things
                            under control.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-saffron-50/40">
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                SEVERITY_BADGE_STYLES[item.severity]
                              }`}
                            >
                              <TriangleAlert size={12} />
                              {SEVERITY_LABELS[item.severity]}
                            </span>
                            {item.autoHidden ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/5 px-2.5 py-1 text-xs font-medium text-gray-700">
                                <EyeOff size={12} /> Auto-hidden
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-2.5 py-1 text-xs font-medium text-saffron-700">
                                <Eye size={12} /> Visible
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900">“{item.commentExcerpt}”</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <Link
                              href={`/articles/${item.articleSlug}`}
                              className="inline-flex items-center gap-1 font-semibold text-saffron-700 hover:text-saffron-900"
                            >
                              {item.articleTitle}
                              <ChevronRight size={14} />
                            </Link>
                            <span>·</span>
                            <span>By {item.commentUsername}</span>
                          </div>
                          {item.hiddenReason && (
                            <p className="text-xs text-gray-500">Reason: {item.hiddenReason}</p>
                          )}
                          <div className="flex items-center gap-3 text-[11px] text-gray-500">
                            <span>👍 {item.likeCount}</span>
                            <span>👎 {item.dislikeCount}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100/80 px-2.5 py-1 text-xs font-semibold text-saffron-700">
                            <Flag size={12} /> {localFlagTypeLabel(item.flagType)}
                          </span>
                          <span className="text-gray-500">
                            {item.triggerSource === 'system' ? 'System detected' : 'Subscriber reported'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                          <span className="font-semibold text-gray-900">
                            {item.reportCount ? numberFormatter.format(item.reportCount) : '—'}
                          </span>
                          {item.reporterNames.length > 0 && (
                            <span>{item.reporterNames.slice(0, 3).join(', ')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {formatRelativeTime(item.lastActionAt)}
                        </span>
                        <p className="text-gray-500">Flagged {formatRelativeTime(item.flaggedAt)}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col items-end gap-2 text-xs">
                          <button
                            type="button"
                            disabled
                            title="Assignment workflow coming soon"
                            className="inline-flex items-center gap-1 rounded-lg border border-saffron-300 px-3 py-1.5 font-semibold text-saffron-700 transition hover:bg-saffron-100/70 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Assign reviewer
                          </button>
                          <button
                            type="button"
                            disabled
                            title="Resolution workflow coming soon"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-100/70 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Resolve &amp; restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <p>
                Showing {queueItems.length ? numberFormatter.format(queueItems.length) : '0'} of{' '}
                {queueMeta ? numberFormatter.format(queueMeta.total) : '0'} comments matching the
                filters.
              </p>
              <button className="inline-flex items-center gap-1 text-saffron-700 hover:text-saffron-900">
                View full queue <ChevronRight size={14} />
              </button>
            </div>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Note: Assignment and resolution actions are in read-only preview while Supabase RPC flows
              are secured.
            </p>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Flag type breakdown</h3>
                <BarChart2 size={18} className="text-saffron-600" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Distribution for {windowLabel.toLowerCase()}. Total{' '}
                {numberFormatter.format(totalFlags)} flags affecting{' '}
                {numberFormatter.format(totalComments)} comments.
              </p>
              <div className="mt-4 space-y-4">
                {showInitialLoader && (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`breakdown-skeleton-${index}`} className="space-y-1 animate-pulse">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                          <span className="h-3 w-32 rounded bg-gray-100" />
                          <span className="h-3 w-6 rounded bg-gray-100" />
                        </div>
                        <div className="h-2 w-full rounded-full bg-saffron-100" />
                      </div>
                    ))}
                  </div>
                )}

                {!showInitialLoader && metrics && metrics.breakdown.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No flag activity recorded in this window. Try expanding the range.
                  </p>
                )}

                {!showInitialLoader &&
                  metrics?.breakdown.map((item) => {
                    const width = totalFlags ? Math.round((item.total / totalFlags) * 100) : 0;
                    return (
                      <div key={item.flagType} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                          <span>{item.label}</span>
                          <span>{numberFormatter.format(item.total)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-saffron-100">
                          <div
                            className="h-full rounded-full bg-saffron-500 transition-all"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-500">
                          {numberFormatter.format(item.open)} open ·{' '}
                          {numberFormatter.format(item.resolved)} resolved
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">Queue snapshot</h3>
              <div className="mt-4 space-y-6 text-sm text-gray-600">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Severity</h4>
                  {(['high', 'medium', 'low'] as SeverityLevel[]).map((level) => {
                    const count = severityTotals[level] ?? 0;
                    const percent = totalComments ? Math.round((count / totalComments) * 100) : 0;
                    return (
                      <div key={level} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                          <span>{SEVERITY_LABELS[level]}</span>
                          <span>
                            {numberFormatter.format(count)}{' '}
                            <span className="text-gray-400">({percent}%)</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              level === 'high'
                                ? 'bg-vermillion-500'
                                : level === 'medium'
                                ? 'bg-saffron-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Open by source</h4>
                  {(['system', 'user', 'moderator'] as TriggerSource[]).map((source) => (
                    <div key={source} className="flex items-center justify-between text-xs text-gray-600">
                      <span>{SOURCE_LABELS[source]}</span>
                      <span className="font-semibold text-gray-900">
                        {numberFormatter.format(openSourceTotals[source] ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12 rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Queue insights</h2>
              <p className="text-sm text-gray-500">
                Live picture of who owns escalations, which articles are hottest, and which community
                members are reporting issues most frequently.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Assignments</h3>
                <Users size={18} className="text-saffron-600" />
              </div>
              {assignments.length ? (
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {assignments.map((item) => (
                    <li key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{item.assignee}</span>
                        <span className="text-[11px] uppercase tracking-wide text-gray-400">
                          {item.escalated ? `${numberFormatter.format(item.escalated)} escalated` : 'Monitoring'} ·{' '}
                          {item.triage ? `${numberFormatter.format(item.triage)} triage` : 'No triage'}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700">
                        <ShieldAlert size={12} /> {numberFormatter.format(item.count)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No active assignments. All flags are in the shared queue.</p>
              )}
            </div>

            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Flagged articles</h3>
                <BarChart2 size={18} className="text-saffron-600" />
              </div>
              {articles.length ? (
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {articles.map((article) => (
                    <li key={article.slug} className="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 shadow-sm">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-700 hover:text-saffron-900"
                      >
                        {article.title}
                        <ChevronRight size={14} />
                      </Link>
                      <span className="text-xs text-gray-500">
                        {numberFormatter.format(article.count)} open flag{article.count === 1 ? '' : 's'} ·{' '}
                        {article.highSeverity ? `${numberFormatter.format(article.highSeverity)} high severity` : 'No high severity yet'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No flagged articles in the selected window.</p>
              )}
            </div>

            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Top reporters</h3>
                <Flag size={18} className="text-saffron-600" />
              </div>
              {reporters.length ? (
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {reporters.map((reporter) => (
                    <li key={reporter.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                      <span className="font-semibold text-gray-900">{reporter.name}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700">
                        <TriangleAlert size={12} /> {numberFormatter.format(reporter.count)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No manual reports logged for this window.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recently updated</h2>
            <Clock size={18} className="text-saffron-600" />
          </div>
          <ul className="mt-4 space-y-4">
            {showInitialLoader &&
              Array.from({ length: 6 }).map((_, index) => (
                <li
                  key={`activity-skeleton-${index}`}
                  className="relative border-l-2 border-saffron-200 pl-4"
                >
                  <span className="absolute -left-2 top-1 inline-flex h-3 w-3 rounded-full bg-saffron-500" />
                  <div className="flex flex-col gap-2 animate-pulse">
                    <span className="h-5 w-32 rounded bg-saffron-100/60" />
                    <span className="h-4 w-3/4 rounded bg-gray-100" />
                    <span className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </li>
              ))}

            {!showInitialLoader && activityItems.length === 0 && (
              <li className="border-l-2 border-saffron-200 pl-4 text-sm text-gray-500">
                No activity logged in this window. Check back after new moderation events.
              </li>
            )}

            {!showInitialLoader &&
              activityItems.map((item) => (
                <li key={item.id} className="relative border-l-2 border-saffron-200 pl-4">
                  <span
                    className={`absolute -left-2 top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-white ${
                      item.category === 'auto'
                        ? 'bg-saffron-500'
                        : item.category === 'manual'
                        ? 'bg-vermillion-500'
                        : item.category === 'escalation'
                        ? 'bg-sacred-500'
                        : 'bg-green-500'
                    }`}
                  >
                    <span className="sr-only">Timeline bullet</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        CATEGORY_STYLES[item.category]
                      }`}
                    >
                      {item.category === 'auto' && <Zap size={12} />}
                      {item.category === 'manual' && <Flag size={12} />}
                      {item.category === 'escalation' && <TriangleAlert size={12} />}
                      {item.category === 'resolution' && <CheckCircle2 size={12} />}
                      {item.summary}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{item.detail}</p>
                  {item.commentExcerpt && (
                    <p className="mt-1 text-xs italic text-gray-500">“{item.commentExcerpt}”</p>
                  )}
                  <Link
                    href={`/articles/${item.articleSlug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-900"
                  >
                    View article
                    <ChevronRight size={12} />
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Implementation notes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-4 text-sm text-gray-700">
              <h3 className="font-semibold text-saffron-800">Data sources</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>comment_flags</strong> → live queue &amp; activity feed.</li>
                <li><strong>comments</strong> → article metadata, moderation status, excerpt.</li>
                <li><strong>comment_reactions</strong> → likes/dislikes for prioritisation.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-4 text-sm text-gray-700">
              <h3 className="font-semibold text-saffron-800">Next steps</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Wire assignment &amp; resolve actions to Supabase RPC.</li>
                <li>Add filter controls (status, trigger source, article) with URL sync.</li>
                <li>Introduce streaming updates for near real-time shifts.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  accent: string;
  loading?: boolean;
};

function StatCard({ title, value, change, icon: Icon, accent, loading }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} aria-hidden />
      <div className="relative flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <Icon size={16} className="text-saffron-600" />
          {title}
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {loading ? (
            <span className="block h-7 w-16 animate-pulse rounded bg-saffron-200/60" />
          ) : (
            value
          )}
        </p>
        <p className="text-xs font-semibold text-gray-600">
          {loading ? <span className="block h-3 w-20 animate-pulse rounded bg-saffron-200/60" /> : change}
        </p>
      </div>
    </div>
  );
}
