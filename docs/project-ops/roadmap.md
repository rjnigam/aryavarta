# Roadmap & Future Enhancements

_Last updated: October 25, 2025_

Priorities are grouped by horizon. Each item lists a brief rationale and the teams/functions involved.

## 🔥 Immediate (0–2 weeks)

| Initiative | Summary | Owner(s) | Notes |
| ---------- | ------- | -------- | ----- |
| Finish auth/email hardening | Ensure `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are configured across environments; add health checks to catch misconfigurations early. | Engineering, DevOps | Add CI smoke test that invokes `/api/auth/resend` using service role from secrets. |
| Subscriber profile parity | Write migration to backfill `auth_user_id` and `email_verified` for existing subscribers; add Supabase trigger to auto-sync on auth events. | Engineering | Reduces first-login latency and simplifies analytics joins. |
| Launch verification UX polish | Show status banners guiding users to check email, expose retry cooldown, and share support contact. | Product, Design | Decreases support load during auth troubleshooting. |

## 🚀 Near Term (2–6 weeks)

- **Comment Persistence Upgrade:** Move comment storage from local scaffolding to Supabase with RLS, moderation hooks, and pagination.
- **Moderator Dashboard (Phase 5C completion):** Connect UI to live metrics/queue endpoints, add assignment workflows, and write on-call SOP.
- **Analytics & KPIs:** Enable Vercel Analytics or Plausible; define dashboards for subscriber funnel, article engagement, and email performance.
- **Content Velocity Tooling:** Automate article QA checklist (citations present, reading time accurate, SEO metadata filled) within CLI scripts.

## 🌱 Mid Term (6–12 weeks)

- **Paid Membership Foundations:** Investigate gated content tiers, Stripe billing, and subscriber segmentation while preserving free tier.
- **Personalized Recommendations:** Use reading history to surface unread articles on the homepage (requires Supabase event tracking).
- **Mobile App Discovery:** Evaluate Flutter vs. React Native prototypes for offline reading and push notifications.
- **Internationalization Pilot:** Prepare Hindi/Sanskrit localization strategy; audit copy for translatability.

## 🌄 Visionary (12+ weeks)

- **Community Forums:** Long-form discussions with threading, moderation, and karma signals beyond article comments.
- **Audio Editions:** Auto-generate narrated versions of articles, potentially leveraging AI voice with human QA.
- **Open API:** Offer content access for partner apps/educators under appropriate licensing.
- **Scholar-in-Residence Program:** Invite guest writers/scholars, manage editorial calendars, and highlight their expertise on dedicated landing pages.

_Review this roadmap quarterly and align with leadership on resourcing before committing to new horizons._
