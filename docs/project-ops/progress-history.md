# Progress History

_Last updated: October 25, 2025_

This log summarizes the project’s major milestones and the most recent engineering work. For full commit-level detail, pair this with `CHANGELOG.md` and the Git history.

## 2025-10-19 → 2025-10-23: Foundation & Public Launch

- Bootstrapped the Next.js 16 + Tailwind codebase with a dharmic design system.
- Implemented markdown-powered article system with CLI tooling for new posts and PDF ingestion.
- Integrated Supabase for subscriber storage and Resend for transactional emails.
- Deployed `v1.0.0` live at **arya-varta.in** with two flagship articles and newsletter signup.
- Added automated moderation framework (Phase 5B/5C) to prepare for community comments.

## 2025-10-24: Authentication Hardening & Email Delivery

- Refined signup/login APIs to eliminate foreign key violations by deferring `auth_user_id` syncing until first login.
- Added Resend-based fallback verification emails using Supabase Admin `generateLink` to mitigate delivery gaps.
- Fixed password recovery flow by properly exchanging Supabase recovery tokens for sessions on callback.
- Updated `AuthContext` to centralize session fetching and improve loading states in the UI (`UserMenu`).

## 2025-10-25: Operational Resilience Pass & Critical Bug Fixes

- Reworked username allocation to use deterministic slugs with random suffixes when pool lookups fail, preventing signup outages when service credentials are unavailable.
- Shifted subscriber profile materialization to first login, with admin-client fallback to respect Row Level Security.
- Documented Resend/Supabase environment requirements after detecting missing `SUPABASE_SERVICE_ROLE_KEY` in local `.env`.
- Began assembling this operational knowledge base (`docs/project-ops`).
- **Fixed critical login flow issue**: Changed post-login redirect to use `window.location.href` instead of `router.push()` to ensure AuthContext properly loads session data immediately.
- Created placeholder pages for `/profile`, `/settings`, and `/my-comments` to eliminate 404 errors and prepare for future feature implementation.
- **Fixed critical username mismatch bug**: Subscriber records now created immediately during signup, ensuring username consistency between verification email and post-login UI. Added logging to track username source and improved metadata handling at login.

## Ongoing

- Moderation endpoints (`/api/moderation/*`) are live with synthetic data; awaiting UI integration and production workflows.
- Comment system is scaffolded but pending Supabase persistence layer before public enablement.
- Analytics integration (Vercel, Plausible, etc.) remains optional until subscriber base grows.

_Update this file whenever a meaningful milestone ships or a production incident occurs._
