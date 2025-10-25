# Open Issues & Risks

_Last updated: October 25, 2025_

## Critical Issues

| ID | Description | Impact | Owner | Status |
| -- | ----------- | ------ | ----- | ------ |
| AUTH-001 | Missing `SUPABASE_SERVICE_ROLE_KEY` in some environments prevents verification emails (signup / resend fallback). | Users cannot activate accounts; support burden. | Engineering | 🔴 Needs configuration in `.env.local` and production secrets. |
| AUTH-002 | AuthContext still logs `PGRST116` warnings when no subscriber record exists. | Noise in logs; masks real errors. | Engineering | 🟡 Mitigation planned by backfilling subscriber records + handling 404s gracefully. |
| EMAIL-003 | No automated alerting if Resend API quota exhausted. | Silent delivery failures. | DevOps | 🟡 Add monitoring or fallback provider. |

## Emerging Risks

- **Moderation Debt:** Phase 5 moderation APIs exist but lack production UI + policies. Without enforcement, community launch could degrade discussion quality.
- **Single Region Deployment:** Supabase + Vercel run in single region; global audience may experience latency. Track metrics before investing in multi-region setup.
- **Analytics Blind Spots:** Without baseline analytics, it’s hard to validate growth funnel or detect drop-offs.
- **Test Coverage Gaps:** Auth/email flows rely on manual QA. Introduce contract tests invoking key API routes with mocked Supabase responses.

## Mitigation Playbook

1. **Environment Verification Script:** Add CI step to assert presence of required env vars before deploy.
2. **Health Endpoint:** Create `/api/health/auth` that checks Supabase Admin connectivity and Resend availability; hit it via cron.
3. **Support Runbook:** Document steps for handling “didn’t receive verification email” in `operations.md` (see companion doc).
4. **Monitoring:** Configure Resend webhooks for bounces/spam complaints; forward to Slack or email alerts.

_Keep this file tight. Close out items once mitigations land and link to relevant pull requests or incident reports._
