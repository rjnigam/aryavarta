# Phase 5C Backend — Deployment Checklist

## ✅ What's Been Completed

### Code & APIs
- [x] `/api/moderation/queue` endpoint aggregates flags with severity, reactions, assignments
- [x] `/api/moderation/metrics` provides headline stats, breakdowns, and response times
- [x] `/api/moderation/activity` streams moderation events for timeline view
- [x] `lib/moderation.ts` consolidates scoring, time parsing, and article title helpers
- [x] `lib/supabaseAdmin.ts` service-role client with environment trimming

### Database
- [x] SQL migration script (`docs/PHASE5C-MODERATION-BACKEND.sql`) extends `comment_flags` with:
  - `assigned_to`, `notes`, `last_touched_by`, `last_touched_at`
  - Indexes on `created_at` and `(flag_type, created_at)`
- [x] Migration **already applied** to your Supabase instance ✅

### Existing Routes Updated
- [x] `app/api/comments/[slug]/route.ts` stamps `last_touched_by/at` on auto-moderation flags
- [x] `app/api/comments/reactions/route.ts` updates audit columns on dislike threshold and restore
- [x] `app/api/comments/report/route.ts` tracks reporter + system touches on manual reports

### Documentation
- [x] `docs/PHASE5C-MODERATION-BACKEND.md` with API specs, query params, response examples
- [x] `deploy-phase5c.sh` interactive deployment guide
- [x] `scripts/verify-phase5c-backend.sh` endpoint testing script
- [x] Updated `CHANGELOG.md` and `DOCUMENTATION_INDEX.md`

### Quality
- [x] Lint passes (`npx eslint . --max-warnings=0`)
- [x] TypeScript compiles without errors
- [x] All scripts made executable

---

## 🚀 Ready for Production Deployment

### Option 1: Manual Vercel Deploy
```bash
# Commit is already pushed (or run git push if not)
git push origin main

# Monitor deployment at vercel.com dashboard
# Vercel will auto-deploy on push to main
```

### Option 2: CLI Deploy
```bash
cd /Users/rajathnigam/Gurukul
./deploy-phase5c.sh
# Follow the interactive prompts
```

### Post-Deployment Verification
After deployment completes, test the production endpoints:

```bash
# Run verification script against production
./scripts/verify-phase5c-backend.sh https://arya-varta.in

# Or manually:
curl "https://arya-varta.in/api/moderation/queue?limit=2"
curl "https://arya-varta.in/api/moderation/metrics?window=7d"
curl "https://arya-varta.in/api/moderation/activity?limit=5"
```

Expected: All endpoints return JSON with `items` or `summary` keys.

---

## 🔍 Local Development Note

**Current local server state**: Build cache artifacts from repeated restarts.  
**Recommended**: After deploying to production, clean local environment:

```bash
pkill -9 -f "next dev"
rm -rf .next node_modules/.cache
npm run dev
```

Then test locally:
```bash
./scripts/verify-phase5c-backend.sh http://localhost:3000
```

---

## 📋 Environment Variables Checklist

Ensure these are set in **Vercel production**:

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `SUPABASE_SERVICE_ROLE_KEY` ← **Critical for moderation APIs**
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `RESEND_API_KEY`
- [x] `NEXT_PUBLIC_SITE_URL`

---

## 🎯 Next Steps After Deployment

1. **Wire the Dashboard UI**
   - Update `/app/moderation/page.tsx` to call the new APIs
   - Replace mock data with `fetch()` calls to queue/metrics/activity endpoints
   - Add loading states and error boundaries

2. **Add Mutation Endpoints**
   - `PATCH /api/moderation/queue/:id` for assignments + notes
   - `POST /api/moderation/resolve` for bulk resolutions

3. **Implement Auth Guards**
   - Add Supabase RLS policies for moderator role
   - Protect `/moderation` route with middleware

4. **Analytics Dashboard**
   - Trend charts for flag volume
   - SLA breach alerts
   - Weekly moderator digest emails

---

**Status**: 🟢 Ready for production deployment  
**Commit**: `a2fdffa` — feat: add moderation dashboard backend (Phase 5C)  
**Last Updated**: October 24, 2025
