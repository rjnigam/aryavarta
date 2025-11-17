# Phase 5C: Moderation Dashboard Backend

## 🎯 Goal
Wire the `/moderation` dashboard to real Supabase data so moderators can review open flags, track queue health, and audit recent actions. This phase introduces read-optimized API endpoints plus lightweight assignment metadata on `comment_flags`.

---

## 🆕 What Shipped

### 1. Moderation API Suite
| Endpoint | Description |
|----------|-------------|
| `GET /api/moderation/queue` | Returns the active moderation queue with aggregated manual reports, severity ranking, and reaction counts. Supports pagination, filtering, and time windows. |
| `GET /api/moderation/metrics` | Supplies headline stats (open flags, auto-hidden comments, escalations), flag-type breakdown, and response-time medians for the selected window. |
| `GET /api/moderation/activity` | Streams a timeline of auto-moderation events, subscriber reports, escalations, and resolutions for moderator situational awareness. |

All endpoints use the Supabase **service role client** (`SUPABASE_SERVICE_ROLE_KEY`) to bypass RLS and join moderation tables safely on the server.

### 2. `comment_flags` Enhancements
- `assigned_to` — Optional moderator owner for a flag.
- `notes` — Free-form notes or follow-up context (max 1–2 sentences recommended).
- `last_touched_by` / `last_touched_at` — Track the last actor who reviewed or updated a flag.
- Supporting indexes on `created_at` and `(flag_type, created_at)` to keep dashboard queries snappy.

See [`docs/PHASE5C-MODERATION-BACKEND.sql`](PHASE5C-MODERATION-BACKEND.sql) for the migration script.

### 3. Shared Moderation Utilities
`lib/moderation.ts` now centralizes:
- Article title caching for queue & activity cards
- Severity scoring + queue status heuristics
- Time window parsing helpers
- Flag priority scoring for consistent ordering across endpoints

---

## 🔌 API Details

### `GET /api/moderation/queue`
**Query params**
- `limit` (default `20`, max `100`)
- `offset` (default `0`)
- `status` (`open | triage | escalated | resolved`)
- `flagType`, `triggerSource`, `articleSlug`
- `window` (`24h`, `7d`, `30d`, `90d`), defaults to last 24h
- `includeResolved` (`boolean`)

**Response snippet**
```json
{
  "items": [
    {
      "id": "3bb8…",
      "commentId": "7f61…",
      "articleSlug": "how-the-vedas-guide-response-to-aggressors",
      "articleTitle": "How the Vedas Guide Response to Aggressors",
      "commentExcerpt": "https://random-link.co …",
      "flagType": "auto_link_spam",
      "triggerSource": "system",
      "status": "triage",
      "severity": "medium",
      "reportCount": 0,
      "flaggedAt": "2025-10-23T15:05:00.000Z",
      "lastActionAt": "2025-10-23T15:15:00.000Z",
      "reporterNames": [],
      "autoHidden": true,
      "moderationStatus": "auto_hidden",
      "hiddenReason": "Contains 4 links (max 2)",
      "likeCount": 0,
      "dislikeCount": 0,
      "assignedTo": null,
      "notes": null,
      "lastTouchedBy": null,
      "commentUsername": "anaya_k"
    }
  ],
  "meta": {
    "total": 4,
    "limit": 20,
    "offset": 0,
    "window": "24h"
  }
}
```

### `GET /api/moderation/metrics`
- Accepts `window` param (`24h` default) matching queue filters.
- Returns headline counts, flag-type breakdown, severity buckets, trigger-source distribution, and median response time.

```json
{
  "window": {
    "value": "24h",
    "label": "Last 24 hours",
    "start": "2025-10-23T00:00:00.000Z",
    "end": "2025-10-24T00:00:00.000Z"
  },
  "summary": {
    "openFlags": 6,
    "autoHidden": 3,
    "manualReportOpen": 2,
    "escalated": 1,
    "medianResponseMinutes": 38
  },
  "breakdown": [
    { "flagType": "manual_report", "label": "Manual reports", "total": 12, "open": 4, "resolved": 8 }
  ],
  "severity": { "high": 2, "medium": 3, "low": 1 },
  "openBySource": { "system": 4, "user": 2, "moderator": 0 },
  "totals": { "uniqueComments": 5, "totalFlags": 16 },
  "lastUpdated": "2025-10-24T15:32:10.447Z"
}
```

### `GET /api/moderation/activity`
- Accepts `limit` (default 20) and optional `window` filter.
- Emits a mixed feed of creation + resolution events with contextual copy used by the dashboard timeline.

```json
{
  "items": [
    {
      "id": "f1c8…-created",
      "timestamp": "2025-10-23T17:10:00.000Z",
      "summary": "New manual report logged",
      "detail": "Manual reports on “Hinduism Misinterpreted as Pacifism”. Reported by S. Iyer.",
      "category": "manual",
      "flagType": "manual_report",
      "flagLabel": "Manual reports",
      "commentId": "f1c8…",
      "articleSlug": "hinduism-misinterpreted-pacifism",
      "articleTitle": "Hinduism Misinterpreted as Pacifism",
      "commentExcerpt": "This is utter nonsense. Anyone who reads…"
    }
  ],
  "meta": {
    "total": 12,
    "limit": 20,
    "window": "24h"
  }
}
```

---

## 🧱 Data Sources
- `comment_flags` — Core moderation events + assignment metadata.
- `comments` — Join for article slug, hidden state, and moderation status.
- `comment_reactions` — Aggregated for queue severity context.
- Local article frontmatter (`content/articles`) — Supplies display titles for queue/activity cards.

---

## ⚙️ Setup Checklist
1. **Run Migration**
   - Open Supabase SQL Editor → execute [`PHASE5C-MODERATION-BACKEND.sql`](PHASE5C-MODERATION-BACKEND.sql).
   - Confirm new columns appear on `comment_flags` via the verification query at the bottom.
2. **Environment Variables**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured locally & in production.
3. **Seed Data (Optional)**
   - Use existing auto-moderation flows (Phase 5B) to generate fresh flags or insert synthetic rows for testing.

---

## 🧪 Testing Guide
1. Start the dev server: `npm run dev`.
2. Hit the endpoints locally:
   ```bash
   curl "http://localhost:3000/api/moderation/queue?limit=5&window=7d"
   curl "http://localhost:3000/api/moderation/metrics?window=30d"
   curl "http://localhost:3000/api/moderation/activity?limit=10"
   ```
3. Verify responses include:
   - Correct article titles + excerpts
   - Accurate manual report counts after submitting new reports
   - Severity + queue status updates when a comment transitions between hidden states
4. Load `http://localhost:3000/moderation` and wire the dashboard cards to these endpoints (pending UI hookup).

---

## 🚀 Deployment Steps
1. Apply the SQL migration in Supabase.
2. Confirm local smoke tests (above) succeed.
3. Commit with `feat: add moderation dashboard backend (Phase 5C)` (or equivalent).
4. Deploy via Vercel or CI/CD pipeline — ensure new environment variables exist in prod.

---

## 📌 Next Milestones
- Wire the `/moderation` React components to the new APIs with loading & error states.
- Add assignment mutations (`PATCH /api/moderation/queue/:id`) so moderators can claim work.
- Integrate Supabase Row Level Security policies for moderator-only access.
- Expand analytics (trend lines, SLA breaches) once real data flows through the APIs.

**Maintainer:** Auto-moderation squad  
**Last Updated:** October 24, 2025
