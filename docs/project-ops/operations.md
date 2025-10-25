# Operations & Runbook Notes

_Last updated: October 25, 2025_

## Environment Configuration

| Variable | Purpose | Required In |
| -------- | ------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL | All environments |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous Supabase key for client-side auth | All environments |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key for admin tasks (verification emails, moderation jobs) | Server-side environments only (local dev `.env.local`, Vercel prod) |
| `RESEND_API_KEY` | Transactional email provider token | Server-side environments |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for magic links | Production + staging |

### Setup Checklist

1. Copy `.env.local.example` → `.env.local` and fill in the values above.
2. Restart the Next.js dev server after changes (`npm run dev`).
3. In Vercel, mirror the same keys under **Project Settings → Environment Variables**.
4. For local testing of signup emails, use a real mailbox (e.g., Gmail) and check spam/junk folders.

## Useful Commands

```bash
npm run dev          # Start Turbopack dev server
npm run build        # Production build
npm run lint         # ESLint checks (requires dev server stopped)
node scripts/new-article.js "Title"  # Scaffold a new article
```

## API Smoke Tests

1. **Signup:** `POST /api/auth/signup` with `{ email, password, name }` and confirm 200 response with message.
2. **Resend Verification:** `POST /api/auth/resend` with `{ email }` for any unverified subscriber.
3. **Login:** `POST /api/auth/login` with valid credentials; expect subscriber payload in response.
4. **Moderation Queue:** `GET /api/moderation/queue` to ensure service-role key and policies are in sync.

Automate the above via REST client or integration tests to catch regressions early.

## Support Playbooks

### “I didn’t receive the verification email”

1. Check Resend dashboard for recent activity.
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set and restart the server.
3. Use `/api/auth/resend` to trigger another email; confirm 200 status and check logs for `Resend fallback` errors.
4. As a temporary measure, manually confirm the user in Supabase Auth dashboard (`Authentication → Users → Confirm`).

### “Unable to sign in after reset”

1. Ensure password reset link uses the latest deployment origin (matches `NEXT_PUBLIC_SITE_URL`).
2. Confirm the reset callback page loads and `exchangeCodeForSession` succeeds (check browser console).
3. If stuck, instruct user to request a fresh reset email and clear cookies for the domain.

## Deployment Notes

- Primary hosting is on **Vercel** (`aryavarta` project). Deploys trigger on main branch pushes.
- Database migrations live in `/docs` (`PHASE5*` SQL files). Apply via Supabase SQL Editor before releasing dependent code.
- Moderate traffic expectation (<5k MAU). Scale by enabling Supabase connection pooling and upgrading to Pro plan when needed.

## Contacts & Escalation

- **Primary Maintainer:** Rajath Nigam (rajathnigam@gmail.com)
- **Operations:** contact@arya-varta.in
- **Emergency:** Rotate Supabase API keys immediately if compromise suspected; update env vars and redeploy.

_Keep this runbook evergreen. Update after every incident response, migration, or tooling change._
