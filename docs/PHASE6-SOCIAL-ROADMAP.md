# Phase 6 Roadmap — Building the Aryavarta Social Commons

_Last updated: October 23, 2025_

## Vision Snapshot
Create a respectful, philosophy-first social platform where seekers read, reflect, and discuss timeless ideas with modern relevance. Phase 6 turns Aryavarta from a publication with comments into an intentional community space.

## Guiding Principles
- **Respectful Discourse:** Celebrate civil debate, cite sources, highlight thoughtful replies.
- **Earned Identity:** Profiles showcase contributions, reading streaks, and philosophical leanings.
- **Safety by Design:** RLS policies, clear moderation tooling, and progressive trust levels keep the space healthy.
- **Delightful Rituals:** Daily prompts, curated circles, and scholar AMAs keep the flame of inquiry alive.

---

## Phase 6.0 – Foundational Social Layer (Weeks 0–3)
| Goal | Deliverables | Owner | Tooling | Success Metric |
|------|--------------|-------|---------|----------------|
| Ship personal dashboards | `/profile` route with saved posts, recent comments, activity highlights | Rajath + Copilot | Next.js, Supabase | ≥80% returning subscribers visit profile within 2 weeks |
| Save-for-later system | `user_bookmarks` table + RLS, bookmark toggle on article pages | Rajath | Supabase SQL, React | ≥30% of signed-in users bookmark ≥1 article |
| Harden auth | Replace local storage hack with Supabase Auth or signed JWT cookie | Rajath (with AI assist) | Supabase Auth, Next middleware | 0 auth-related support issues during pilot |
| Feedback loop | Profile page CTA linking to Notion/Airtable form for feedback | Rajath | Airtable/Forms | ≥10 actionable responses |

### Execution Checklist
1. Draft Supabase migration (bookmarks table, indexes, policies) and run locally.
2. Build `/api/profile/activity` for comments + saves.
3. Add bookmark toggle component on article pages with optimistic UI.
4. Create `/profile` page with two tabs: **Activity** (comments, reactions) and **Library** (saved posts).
5. Instrument Supabase logging (edge functions or simple log table) for profile visits.
6. Roll out to staging subscribers; collect feedback for one week before broad release.

---

## Phase 6.1 – Discovery & Social Graph (Weeks 4–8)
| Goal | Deliverables | Owner | Dependencies |
|------|--------------|-------|--------------|
| Topic Circles | Tag-based landing pages surfacing top posts, comments, member spotlights | Rajath + (future collaborator?) | Bookmark data, tags taxonomy |
| Follow model | Table for `user_follows` with notifications (digest email) | TBD | Supabase auth hardened |
| Reflection posts | Lightweight text-only posts with markdown, tied to topics | TBD | Moderation tooling |
| Activity feed | Aggregated feed of followed authors/topics, with infinite scroll | Team | Realtime or periodic job |

### Experiment Ideas
- Weekly “Socratic Prompt” pinned to homepage & circles.
- Reputation score combining reactions received, citations, participation.
- Surface “Kindred Spirits” suggestions based on bookmarks + follows.

---

## Phase 6.2 – Trust & Safety (Weeks 9–12 and ongoing)
| Pillar | Tasks | Notes |
|--------|-------|-------|
| **Moderation Toolkit** | Report button, queue dashboard, status labels (pending/resolved), moderator roles | Consider Supabase functions + simple admin UI |
| **Automated Guardrails** | Leverage Perspective API or open-source toxicity classifiers; auto-hide threshold | Bundle with existing RLS for soft-deletes |
| **Community Guidelines** | Publish Maha Yama + Niyama inspired policy, require acknowledgement on first login | Add quick quiz to unlock posting privileges |
| **Onboarding Rituals** | Guided tour, recommended circles, pledge to respectful discourse | Collect philosophy interests for better matching |

---

## Supporting Workstreams
- **Analytics:** Set up PostHog or Supabase Metrics for MAU, retention, engagement per feature.
- **Content Ops:** Weekly editorial calendar; highlight top community contributions in newsletter.
- **Infrastructure:** Monitor Supabase row usage, plan for caching/search (e.g., Typesense once >10k posts).
- **Hiring/Collaboration:** Line up volunteer moderators and a part-time UI/UX advisor by end of Phase 6.1.

---

## Immediate Next Steps (Next 72 Hours)
1. **Finalize bookmark schema** → create migration `PHASE6-BOOKMARKS.sql` and run locally.
2. **Prototype profile page layout** in Figma or directly in Next.js with placeholder data.
3. **Auth upgrade decision** → choose between Supabase Auth (recommended) or custom JWT; spike for 2–3 hours.
4. **Kick off feedback loop** → reach out to top commenters, invite them to beta list.
5. **Update documentation** → add `PHASE6-SOCIAL-ROADMAP.md` to repo index and share summary in newsletter draft.

---

## Milestone Review Cadence
- **Weekly**: Friday retro—metrics snapshot, shipping checklist, unblockers.
- **Bi-weekly**: Community call with early adopters (Zoom/Discord) for qualitative feedback.
- **Monthly**: Vision alignment—adjust roadmap, evaluate resource needs (design help, moderation, infra).

---

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature creep slows launch | Medium | Ship Phase 6.0 before taking on social graph work |
| Moderation overhead | High | Define guidelines early, recruit 2 trusted moderators, implement report flow in Phase 6.2 |
| Auth/security gaps | High | Move to managed Supabase Auth; run security review before inviting wider audience |
| Low engagement | Medium | Seed content with daily prompts, highlight member contributions in newsletter |

---

## Success Metrics for Phase 6.0 Launch
- 70% of active commenters create or view their profile during beta month.
- 40% of active subscribers bookmark at least two articles.
- Net Promoter Score (NPS) > 40 from beta survey respondents.
- Zero unresolved moderation incidents after two weeks live.

Let’s climb—one thoughtful release at a time.
