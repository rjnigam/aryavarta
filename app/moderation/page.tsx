'use client';

import { useMemo, useState, type ComponentType } from 'react';
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

type ModerationStatus = 'visible' | 'auto_hidden' | 'manual_hidden' | 'resolved';

type FlaggedComment = {
  id: string;
  commentExcerpt: string;
  articleSlug: string;
  articleTitle: string;
  flagType: FlagType;
  triggerSource: TriggerSource;
  status: QueueStatus;
  reportCount: number;
  flaggedAt: string;
  lastActionAt: string;
  reporterNames: string[];
  autoHidden: boolean;
  moderationStatus: ModerationStatus;
  severity: 'low' | 'medium' | 'high';
  hiddenReason?: string;
};

type ActivityItem = {
  id: string;
  timestamp: string;
  summary: string;
  detail: string;
  category: 'auto' | 'manual' | 'resolution' | 'escalation';
};

type FlagBreakdown = {
  flagType: FlagType;
  label: string;
  count: number;
  change: string;
};

const TIME_WINDOWS = [
  { label: 'Last 24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

const MOCK_FLAGGED_COMMENTS: FlaggedComment[] = [
  {
    id: 'f1c8c4a2-1b2f-4e7e-9f13-b923f2fdbd1a',
    articleSlug: 'hinduism-misinterpreted-pacifism',
    articleTitle: 'Hinduism Misinterpreted as Pacifism',
    commentExcerpt:
      'This is utter nonsense. Anyone who reads real scripture knows this author is twisting facts...',
    flagType: 'manual_report',
    triggerSource: 'user',
    status: 'escalated',
    reportCount: 5,
    flaggedAt: '2025-10-23T17:10:00Z',
    lastActionAt: '2025-10-23T17:40:00Z',
    reporterNames: ['S. Iyer', 'A. Sharma', 'V. Kulkarni'],
    autoHidden: true,
    moderationStatus: 'manual_hidden',
    severity: 'high',
    hiddenReason: 'Hidden after 5 user reports',
  },
  {
    id: '7a77e627-9366-49b7-9f2e-0be5b913b673',
    articleSlug: 'how-the-vedas-guide-response-to-aggressors',
    articleTitle: 'How the Vedas Guide Response to Aggressors',
    commentExcerpt:
      'https://random-link.co, https://cheap-guru.app – follow these gurus instead of this biased take...',
    flagType: 'auto_link_spam',
    triggerSource: 'system',
    status: 'triage',
    reportCount: 0,
    flaggedAt: '2025-10-23T15:05:00Z',
    lastActionAt: '2025-10-23T15:15:00Z',
    reporterNames: [],
    autoHidden: true,
    moderationStatus: 'auto_hidden',
    severity: 'medium',
    hiddenReason: 'Contains 4 links (max 2)',
  },
  {
    id: '42f239a6-9fb7-4038-8f5d-4f7fde1ff95c',
    articleSlug: 'upanishadic-self',
    articleTitle: 'The Upanishadic Self',
    commentExcerpt:
      'The author is a fraud and should be banned. Total fake news and agenda-driven propaganda.',
    flagType: 'auto_banned_phrase',
    triggerSource: 'system',
    status: 'open',
    reportCount: 1,
    flaggedAt: '2025-10-23T12:50:00Z',
    lastActionAt: '2025-10-23T13:10:00Z',
    reporterNames: ['N. Pillai'],
    autoHidden: true,
    moderationStatus: 'auto_hidden',
    severity: 'medium',
    hiddenReason: 'Contains prohibited language: "fake news"',
  },
  {
    id: 'f9fb1a91-df67-4bd6-9d56-c3a05344b569',
    articleSlug: 'hinduism-misinterpreted-pacifism',
    articleTitle: 'Hinduism Misinterpreted as Pacifism',
    commentExcerpt:
      'Appreciate the citations but this paragraph misquotes the Shanti Parva. Could you clarify?',
    flagType: 'manual_report',
    triggerSource: 'user',
    status: 'resolved',
    reportCount: 2,
    flaggedAt: '2025-10-22T19:15:00Z',
    lastActionAt: '2025-10-22T20:05:00Z',
    reporterNames: ['G. Menon', 'L. Kapoor'],
    autoHidden: false,
    moderationStatus: 'resolved',
    severity: 'low',
    hiddenReason: undefined,
  },
];

const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'activity-1',
    timestamp: '2025-10-23T17:40:00Z',
    summary: 'Escalated manual report to moderator queue',
    detail: 'S. Iyer escalated comment on “Hinduism Misinterpreted as Pacifism”.',
    category: 'escalation',
  },
  {
    id: 'activity-2',
    timestamp: '2025-10-23T16:55:00Z',
    summary: 'System auto-hid link spam comment',
    detail: 'Detected 4 outbound links on “How the Vedas Guide Response to Aggressors”.',
    category: 'auto',
  },
  {
    id: 'activity-3',
    timestamp: '2025-10-23T15:10:00Z',
    summary: 'Manual report closed',
    detail: 'Moderator R. Nigam restored comment after context review.',
    category: 'resolution',
  },
  {
    id: 'activity-4',
    timestamp: '2025-10-23T14:30:00Z',
    summary: 'New banned phrase match',
    detail: 'Comment auto-hidden for phrase “fake news” on “The Upanishadic Self”.',
    category: 'auto',
  },
];

const FLAG_BREAKDOWN: FlagBreakdown[] = [
  { flagType: 'manual_report', label: 'Manual reports', count: 12, change: '+3 vs last week' },
  { flagType: 'manual_hide', label: 'Manual hides', count: 4, change: '+1 vs last week' },
  { flagType: 'auto_banned_phrase', label: 'Banned phrases', count: 7, change: 'Even' },
  { flagType: 'auto_link_spam', label: 'Link spam', count: 5, change: '-2 vs last week' },
  { flagType: 'auto_dislike_threshold', label: 'Dislike threshold', count: 2, change: '-1 vs last week' },
];

const STATUS_STYLES: Record<QueueStatus, string> = {
  open: 'bg-vermillion-100 text-vermillion-700',
  triage: 'bg-saffron-100 text-saffron-700',
  escalated: 'bg-sacred-100 text-sacred-700',
  resolved: 'bg-green-100 text-green-700',
};

const CATEGORY_STYLES: Record<ActivityItem['category'], string> = {
  auto: 'bg-saffron-100 text-saffron-700',
  manual: 'bg-vermillion-100 text-vermillion-700',
  resolution: 'bg-green-100 text-green-700',
  escalation: 'bg-sacred-100 text-sacred-700',
};

function formatRelative(timestamp: string) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
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

function flagTypeLabel(flagType: FlagType) {
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

const severityBadgeStyles: Record<FlaggedComment['severity'], string> = {
  high: 'bg-vermillion-600/10 text-vermillion-700 border border-vermillion-200',
  medium: 'bg-saffron-600/10 text-saffron-700 border border-saffron-200',
  low: 'bg-green-600/10 text-green-700 border border-green-200',
};

const severityLabel: Record<FlaggedComment['severity'], string> = {
  high: 'High priority',
  medium: 'Needs review',
  low: 'FYI',
};

export default function ModerationDashboardPage() {
  const [selectedWindow, setSelectedWindow] = useState<string>('24h');

  const queueMetrics = useMemo(() => {
    const openQueue = MOCK_FLAGGED_COMMENTS.filter((item) => item.status !== 'resolved');
    const autoHidden = openQueue.filter((item) => item.autoHidden).length;
    const manualReports = openQueue.filter((item) => item.flagType === 'manual_report').length;

    const responseTimes = MOCK_FLAGGED_COMMENTS.filter((item) => item.status !== 'open').map((item) => {
      const flagged = new Date(item.flaggedAt).getTime();
      const acted = new Date(item.lastActionAt).getTime();
      return Math.max(acted - flagged, 0);
    });

    const medianResponseMs = responseTimes.length
      ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length / 2)]
      : 0;

    const minutes = Math.round(medianResponseMs / 1000 / 60) || 12;

    return {
      openCount: openQueue.length,
      autoHiddenCount: autoHidden,
      manualReportCount: manualReports,
      medianResponseMinutes: minutes,
    };
  }, []);

  const totalBreakdown = useMemo(
    () => FLAG_BREAKDOWN.reduce((sum, item) => sum + item.count, 0),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="flex flex-col gap-4 border-b border-saffron-200 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600">
                Moderator Tooling · Phase 5C Preview
              </p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900 font-serif">
                Comment Moderation Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
                Review escalations, track auto-moderation outcomes, and prioritize manual follow-up. This mock uses
                sample data so the team can align on the workflow before wiring live queries.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-saffron-700">
                <TriangleAlert size={14} />
                Mock data only
              </span>
              <button className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-semibold text-saffron-700 shadow-sm hover:bg-saffron-100/60 transition">
                <Filter size={16} />
                Save view preset
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
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Open flags"
            value={queueMetrics.openCount.toString().padStart(2, '0')}
            change="3 new today"
            icon={ShieldAlert}
            accent="from-vermillion-100 to-vermillion-50 text-vermillion-800"
          />
          <StatCard
            title="Auto-hidden"
            value={queueMetrics.autoHiddenCount.toString().padStart(2, '0')}
            change="All awaiting review"
            icon={EyeOff}
            accent="from-saffron-100 to-white text-saffron-800"
          />
          <StatCard
            title="Manual reports"
            value={queueMetrics.manualReportCount.toString().padStart(2, '0')}
            change="Threshold ≥ 3 unique"
            icon={Users}
            accent="from-sacred-100 to-white text-sacred-800"
          />
          <StatCard
            title="Median response"
            value={`~${queueMetrics.medianResponseMinutes}m`}
            change="Target: &lt; 45m"
            icon={Clock}
            accent="from-green-100 to-white text-green-800"
          />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active moderation queue</h2>
                <p className="text-sm text-gray-500">
                  Prioritized list ordered by severity, report volume, and time since last action.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <div className="relative flex-1">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search by commenter, phrase, or article"
                    className="w-full rounded-lg border border-saffron-200 bg-saffron-50/70 py-2 pl-10 pr-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200"
                    readOnly
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-semibold text-saffron-700 hover:bg-saffron-100/70 transition">
                  <Filter size={14} /> Advanced filters
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
                  {MOCK_FLAGGED_COMMENTS.filter((item) => item.status !== 'resolved').map((item) => (
                    <tr key={item.id} className="hover:bg-saffron-50/40">
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${severityBadgeStyles[item.severity]}`}>
                              <TriangleAlert size={12} />
                              {severityLabel[item.severity]}
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
                          <Link href={`/articles/${item.articleSlug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-900">
                            {item.articleTitle}
                            <ChevronRight size={14} />
                          </Link>
                          {item.hiddenReason && (
                            <p className="text-xs text-gray-500">{item.hiddenReason}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100/80 px-2.5 py-1 text-xs font-semibold text-saffron-700">
                            <Flag size={12} /> {flagTypeLabel(item.flagType)}
                          </span>
                          <span className="text-gray-500">{item.triggerSource === 'system' ? 'System detected' : 'Subscriber reports'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}>
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                          <span className="font-semibold text-gray-900">{item.reportCount || '—'}</span>
                          {item.reporterNames.length > 0 && (
                            <span>{item.reporterNames.join(', ')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-xs text-gray-600">
                        <span className="font-semibold text-gray-900">{formatRelative(item.lastActionAt)}</span>
                        <p className="text-gray-500">Flagged {formatRelative(item.flaggedAt)}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col items-end gap-2 text-xs">
                          <button className="inline-flex items-center gap-1 rounded-lg border border-saffron-300 px-3 py-1.5 font-semibold text-saffron-700 hover:bg-saffron-100/70 transition">
                            Assign reviewer
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100/70 transition">
                            Resolve & restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <p>
                Queue sorted by severity score. Automatic hides remain hidden until marked resolved.
              </p>
              <button className="inline-flex items-center gap-1 text-saffron-700 hover:text-saffron-900">
                View full queue <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Flag type breakdown</h3>
                <BarChart2 size={18} className="text-saffron-600" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Distribution for the selected window. Total {totalBreakdown} flags logged.</p>
              <div className="mt-4 space-y-4">
                {FLAG_BREAKDOWN.map((item) => {
                  const width = totalBreakdown ? Math.round((item.count / totalBreakdown) * 100) : 0;
                  return (
                    <div key={item.flagType} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                        <span>{item.label}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-saffron-100">
                        <div
                          className="h-full rounded-full bg-saffron-500 transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{item.change}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recently updated</h3>
                <Clock size={18} className="text-saffron-600" />
              </div>
              <ul className="mt-4 space-y-4">
                {ACTIVITY_FEED.map((item) => (
                  <li key={item.id} className="relative border-l-2 border-saffron-200 pl-4">
                    <span className={`absolute -left-2 top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-white ${
                      item.category === 'auto'
                        ? 'bg-saffron-500'
                        : item.category === 'manual'
                        ? 'bg-vermillion-500'
                        : item.category === 'escalation'
                        ? 'bg-sacred-500'
                        : 'bg-green-500'
                    }`}>
                      <span className="sr-only">Timeline bullet</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_STYLES[item.category]}`}>
                        {item.category === 'auto' && <Zap size={12} />}
                        {item.category === 'manual' && <Flag size={12} />}
                        {item.category === 'escalation' && <TriangleAlert size={12} />}
                        {item.category === 'resolution' && <CheckCircle2 size={12} />}
                        {item.summary}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{item.detail}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
                      {formatRelative(item.timestamp)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="mt-12 rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Moderator focus board</h2>
              <p className="text-sm text-gray-500">Track who owns what before the full assignment workflow ships.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-semibold text-saffron-700 hover:bg-saffron-100/70 transition">
              Export as CSV
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[{
              moderator: 'Rajath Nigam',
              focus: 'Escalations & sacred content disputes',
              load: 3,
              sla: '45m target',
            }, {
              moderator: 'Anaya Kapoor',
              focus: 'Community reports follow-up',
              load: 2,
              sla: '60m target',
            }, {
              moderator: 'Vikram Rao',
              focus: 'Auto-hide QA & false positives',
              load: 1,
              sla: '30m target',
            }].map((card) => (
              <div key={card.moderator} className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{card.moderator}</p>
                    <p className="text-xs text-gray-500">{card.focus}</p>
                  </div>
                  <Users size={18} className="text-saffron-600" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-saffron-700">
                    <ShieldAlert size={12} /> {card.load} in queue
                  </span>
                  <span className="text-gray-500">SLA {card.sla}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Implementation notes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-4 text-sm text-gray-700">
              <h3 className="font-semibold text-saffron-800">Data sources</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>comment_flags</strong> → base table for queue & analytics.</li>
                <li><strong>comments</strong> → join for author, moderation status, article slug.</li>
                <li><strong>comment_reactions</strong> → optional trend analysis for dislike thresholds.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-saffron-100 bg-saffron-50/40 p-4 text-sm text-gray-700">
              <h3 className="font-semibold text-saffron-800">Roadmap</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Hook these widgets up to Supabase RPC views.</li>
                <li>Enable claim/assign actions with optimistic UI & audit log.</li>
                <li>Introduce filters (status, article, trigger source, priority) tied to URL params.</li>
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
};

function StatCard({ title, value, change, icon: Icon, accent }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-saffron-200 bg-white p-6 shadow-sm`}> 
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} aria-hidden />
      <div className="relative flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <Icon size={16} className="text-saffron-600" />
          {title}
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-semibold text-gray-600">{change}</p>
      </div>
    </div>
  );
}
