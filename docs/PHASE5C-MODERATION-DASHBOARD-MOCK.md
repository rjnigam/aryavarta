# Phase 5C: Moderation Dashboard Mock

## 🎯 Purpose

This mock dashboard visualizes how moderators will review and resolve comment flags once Phase 5C ships. It is **read-only** and operates entirely on curated sample data. Use it to align on information hierarchy, workflow, and next steps before wiring it up to Supabase.

| Route | File | Notes |
|-------|------|-------|
| `/moderation` | `app/moderation/page.tsx` | Client component with static datasets and Tailwind UI |

## 🧱 Page Layout

1. **Header & Time Window Filter**
   - Context banner (“Phase 5C Preview”) and mock-data disclaimer.
   - Time-range pill selector (24h, 7d, 30d, 90d) – not wired yet.

2. **Key Metrics Row**
   - Open flags, auto-hidden comments, manual reports still waiting review.
   - Median response time target call-out.

3. **Active Queue Table**
   - Severity badges, auto-hide state, article link, flag source, report counts.
   - Placeholder actions for “Assign reviewer” and “Resolve & restore”.

4. **Sidebar Insights**
   - Flag type breakdown with share-of-volume bars.
   - Recent activity timeline (auto actions, escalations, resolutions).

5. **Moderator Focus Board**
   - Lightweight ownership cards with SLA reminders.

6. **Implementation Notes**
   - Data sources to join (`comment_flags`, `comments`, `comment_reactions`).
   - Upcoming engineering tasks for a functional dashboard.
   - Live APIs documented in [`PHASE5C-MODERATION-BACKEND.md`](PHASE5C-MODERATION-BACKEND.md) now expose queue, metrics, and activity data.

## ⚙️ How to View Locally

```bash
npm run dev
# open http://localhost:3000/moderation
```

No authentication guards are implemented yet; this is intentionally open so the team can discuss design and copy.

## 🗺️ Data Wiring Plan (Follow-up)

1. **Service Layer**
   - Create Supabase views/RPCs that join `comment_flags` + `comments` for queue details.
   - Aggregate metrics (counts, response time distributions) via materialized views.

2. **API Routes**
   - New `/api/moderation/queue`, `/api/moderation/metrics`, `/api/moderation/activity` endpoints that use the service role key.
   - Add pagination, filters (status, article slug, trigger source, severity).

3. **Assignments & Actions**
   - Extend `comment_flags` with `assigned_to`, `notes`, `last_touched_by` columns.
   - Implement optimistic mutations for resolve/restore and manual hides.

4. **Auth**
   - Restrict `/moderation` behind Supabase auth (moderator role) once functionality ships.

## ✅ Acceptance Criteria for the Mock

- [x] Page renders and matches the Phase 5B visual system (saffron palette, serif headers).
- [x] Summaries, queue, and timeline use curated sample data that reflects real scenarios.
- [x] Copy clarifies that the view is non-functional.
- [x] Documentation (this file) and changelog updated.

## 📌 Next Steps Toward Phase 5C

- Validate schema additions needed for assignments/notes.
- Design moderator notifications (email/Slack) for escalations.
- Define performance SLAs and real-time refresh strategy (polling vs. webhooks).
- Prototype filters and saved views (URL params + Supabase queries).

---

**Maintainer:** Auto-moderation squad  
**Last Updated:** October 23, 2025
