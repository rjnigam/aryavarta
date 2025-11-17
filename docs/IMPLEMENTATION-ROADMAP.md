# Implementation Roadmap - 90 Day Plan

**Version:** 1.0  
**Start Date:** October 27, 2025  
**Target Completion:** January 25, 2026  
**Status:** Planning

---

## Overview

This roadmap details the practical steps to build Aryavarta's three-pillar system over 90 days. The plan prioritizes proving core concepts early, then expanding features based on validation.

**Guiding Principle:** Ship small, learn fast, iterate based on real user feedback.

---

## Pre-Development (Week 0)

### Documentation Review
- [ ] Team review of PRODUCT-VISION.md
- [ ] Technical architecture walkthrough
- [ ] Karma system specification review
- [ ] Identify any gaps or concerns

### Environment Setup
- [ ] Verify all dev environments working
- [ ] Confirm API keys (Claude, Resend, Supabase)
- [ ] Set up staging environment
- [ ] Configure error tracking (Sentry or similar)

### Git Strategy
- [ ] Create feature branches for major components
- [ ] Set up PR review process
- [ ] Document commit message conventions
- [ ] Plan deployment workflow

---

## Phase 1: Karma System MVP (Weeks 1-2)

**Goal:** Prove karma concept works and users care about it

### Week 1: Foundation

#### Database Schema
- [ ] Create `user_karma` table
- [ ] Create `karma_transactions` table
- [ ] Create `comment_analysis` table
- [ ] Write migration script
- [ ] Test locally, deploy to staging
- [ ] Document schema in codebase

**Deliverables:**
- `docs/PHASE7-KARMA-MIGRATION.sql`
- Updated ER diagram

#### AI Analysis Endpoint
- [ ] Create `/api/karma/analyze` route
- [ ] Write Claude API integration
- [ ] Implement scoring prompt
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Document API endpoint

**Deliverables:**
- `app/api/karma/analyze/route.ts`
- `lib/karmaAnalysis.ts`
- Tests in `__tests__/karma/`

#### Basic Calculation Logic
- [ ] Implement `calculateKarma()` function
- [ ] Add diminishing returns
- [ ] Write helper functions
- [ ] Test edge cases
- [ ] Document algorithm

**Deliverables:**
- `lib/karma/calculator.ts`
- `lib/karma/types.ts`

---

### Week 2: Integration & UI

#### Comment Integration
- [ ] Modify comment submission flow
- [ ] Call karma analysis on submit
- [ ] Store results in database
- [ ] Update user karma totals
- [ ] Test with various comment types

**Deliverables:**
- Updated `app/api/comments/[slug]/route.ts`
- Database triggers for karma updates

#### User Profile Display
- [ ] Add karma score to profile page
- [ ] Show total karma prominently
- [ ] Display recent transactions
- [ ] Add "Why this score?" button
- [ ] Style with Tailwind

**Deliverables:**
- Updated `app/profile/page.tsx`
- `components/KarmaDisplay.tsx`
- `components/KarmaBreakdown.tsx`

#### Leaderboard Page
- [ ] Create `/karma/leaderboard` route
- [ ] Query top users by karma
- [ ] Display with rankings
- [ ] Add filters (all-time, monthly)
- [ ] Mobile-responsive design

**Deliverables:**
- `app/karma/leaderboard/page.tsx`
- `components/LeaderboardTable.tsx`

#### Explanation Page
- [ ] Create `/karma/how-it-works` page
- [ ] Write clear, beginner-friendly explanation
- [ ] Include examples
- [ ] Add FAQ section
- [ ] Link from multiple places

**Deliverables:**
- `app/karma/how-it-works/page.tsx`
- Content written and reviewed

---

### Week 2 Milestone: MVP Launch

**Testing:**
- [ ] Test karma calculation accuracy
- [ ] Verify database updates correctly
- [ ] Check UI displays properly
- [ ] Mobile testing
- [ ] Performance testing

**Launch:**
- [ ] Deploy to production
- [ ] Announce to existing users
- [ ] Monitor errors closely
- [ ] Gather initial feedback

**Success Metrics:**
- At least 50% of commenters check their karma
- Average AI score > 6.5
- No critical bugs
- Positive user feedback

---

## Phase 2: Karma Intelligence (Weeks 3-4)

**Goal:** Refine karma system with community signals

### Week 3: Community Signals

#### Vote Integration
- [ ] Add upvote/downvote to karma calculation
- [ ] Update `comment_reactions` schema if needed
- [ ] Weight votes by voter karma
- [ ] Add time decay for votes
- [ ] Test vote manipulation detection

**Deliverables:**
- Updated karma calculator
- Vote gaming detection logic

#### Engagement Metrics
- [ ] Track reply depth
- [ ] Monitor time between posts
- [ ] Detect edit improvements
- [ ] Calculate read time before comment
- [ ] Integrate into karma formula

**Deliverables:**
- `lib/karma/engagement.ts`
- Updated calculator

#### Moderation Integration
- [ ] Award bonus for clean record
- [ ] Apply penalties for flags
- [ ] Track "Thoughtful Dissent" patterns
- [ ] Implement diversity bonus
- [ ] Test with edge cases

**Deliverables:**
- `lib/karma/moderation.ts`
- Integration with existing moderation system

---

### Week 4: Transparency & Polish

#### Detailed Breakdown UI
- [ ] Show all 4 karma signals
- [ ] Visualize score composition
- [ ] Add reasoning from AI
- [ ] Show historical trend
- [ ] Make it beautiful

**Deliverables:**
- `components/KarmaBreakdownDetailed.tsx`
- Charts/visualizations

#### Appeal System
- [ ] Create `/api/karma/appeal` endpoint
- [ ] Build appeal form
- [ ] Queue for moderator review
- [ ] Email notifications
- [ ] Track appeal outcomes

**Deliverables:**
- `app/api/karma/appeal/route.ts`
- `app/karma/appeal/page.tsx`
- Moderator review interface

#### Analytics Dashboard (Admin)
- [ ] Track karma distribution
- [ ] Monitor AI score trends
- [ ] Flag gaming patterns
- [ ] Show correlation metrics
- [ ] Export reports

**Deliverables:**
- `app/admin/karma-analytics/page.tsx`
- SQL queries for analytics

---

### Week 4 Milestone: Intelligent Karma

**Testing:**
- [ ] Verify multi-signal calculation
- [ ] Test appeal process
- [ ] Check analytics accuracy
- [ ] Load testing
- [ ] Security audit

**Success Metrics:**
- Community votes correlate with AI scores (>70%)
- <5% false positive on penalties
- Appeals resolved within 24 hours
- Users understand scoring breakdown

---

## Phase 3: Tier System (Weeks 5-7)

**Goal:** Make karma meaningful through benefits

### Week 5: Tier Infrastructure

#### Database & Logic
- [ ] Add `karma_tier` to user_karma
- [ ] Implement tier calculation function
- [ ] Create tier transition triggers
- [ ] Handle tier-up events
- [ ] Write tier-down logic (rare)

**Deliverables:**
- Updated database schema
- `lib/karma/tiers.ts`
- Database triggers

#### Tier Badges
- [ ] Design 5 tier badge icons
- [ ] Implement badge component
- [ ] Show on profiles
- [ ] Show next to comments
- [ ] Add tooltips

**Deliverables:**
- Badge designs (SVG)
- `components/TierBadge.tsx`
- CSS styling

#### Rate Limiting
- [ ] Implement posting limits by tier
- [ ] Add API middleware
- [ ] Show remaining posts/day
- [ ] Handle limit exceeded gracefully
- [ ] Reset daily

**Deliverables:**
- `middleware/rateLimiter.ts`
- Updated API routes
- User-facing UI

---

### Week 6: Tier Benefits

#### Visibility Boost
- [ ] Implement feed ranking algorithm
- [ ] Weight by user tier
- [ ] Test with various scenarios
- [ ] Monitor for gaming
- [ ] A/B test if possible

**Deliverables:**
- `lib/ranking/feedRanker.ts`
- Algorithm documentation

#### Special Features Unlock
- [ ] Create polls feature (Sapling+)
- [ ] Build discussion topics (Wise One+)
- [ ] Implement AMA hosting (Elder+)
- [ ] Gate features by tier
- [ ] Add "Unlock at X karma" messaging

**Deliverables:**
- `components/PollCreator.tsx`
- `app/ama/create/page.tsx`
- Tier checking middleware

#### Tier Progress UI
- [ ] Progress bar to next tier
- [ ] Show benefits at each level
- [ ] Motivational messaging
- [ ] Celebrate tier-ups
- [ ] Share achievements

**Deliverables:**
- `components/TierProgress.tsx`
- `components/TierUpModal.tsx`
- Confetti animation (fun!)

---

### Week 7: Elder & Guru Setup

#### Moderation Powers
- [ ] Grant hide/unhide to Elders
- [ ] Add moderation log
- [ ] Implement moderation karma bonus
- [ ] Track moderator effectiveness
- [ ] Add abuse prevention

**Deliverables:**
- Updated moderation system
- Elder-specific UI
- Audit trail

#### Guest Article Workflow
- [ ] Create article proposal form
- [ ] Editorial review queue
- [ ] Collaboration tools
- [ ] Publishing workflow
- [ ] Attribution system

**Deliverables:**
- `app/article-proposals/page.tsx`
- Editorial dashboard updates
- Contributor guidelines

#### Community Council
- [ ] Design council structure
- [ ] Create nomination process
- [ ] Build voting system
- [ ] Council-only forums
- [ ] Decision documentation

**Deliverables:**
- `app/council/page.tsx`
- Nomination/voting logic
- Private discussion areas

---

### Week 7 Milestone: Full Tier System

**Testing:**
- [ ] Test all tier transitions
- [ ] Verify benefits work correctly
- [ ] Check rate limiting
- [ ] Test moderation powers
- [ ] Security review

**Launch:**
- [ ] Deploy tier system
- [ ] Announce new benefits
- [ ] Create tier guide
- [ ] Monitor adoption

**Success Metrics:**
- 20+ users reach Sapling
- 5+ users reach Wise One
- Elders moderate successfully
- No tier system exploits

---

## Phase 4: Negative Karma & Redemption (Weeks 8-10)

**Goal:** Handle bad behavior with dharmic principles

### Week 8: Negative Karma

#### Penalty System
- [ ] Implement negative karma tracking
- [ ] Create restriction levels
- [ ] Build auto-restriction logic
- [ ] Add warning messages
- [ ] Track restriction history

**Deliverables:**
- `lib/karma/penalties.ts`
- Restriction enforcement
- User notifications

#### Probation Mode
- [ ] Build read-only enforcement
- [ ] Create cooldown system
- [ ] Implement review queues
- [ ] Add appeals for restrictions
- [ ] Build moderator tools

**Deliverables:**
- Updated middleware
- Probation UI
- Moderator review interface

---

### Week 9: Redemption Paths

#### Community Guidelines Quiz
- [ ] Write quiz questions
- [ ] Build quiz interface
- [ ] Implement scoring
- [ ] Require for redemption
- [ ] Track completion

**Deliverables:**
- `app/guidelines/quiz/page.tsx`
- Quiz questions (10-15)
- Scoring logic

#### Reflection Essays
- [ ] Create essay submission form
- [ ] Set word count requirements
- [ ] Build review queue
- [ ] Implement approval workflow
- [ ] Archive submissions

**Deliverables:**
- Essay submission form
- Review interface
- Storage system

#### Fresh Start Process
- [ ] Build karma reset logic
- [ ] Require cooling off period
- [ ] Implement approval workflow
- [ ] Track fresh starts
- [ ] Monitor recidivism

**Deliverables:**
- Reset workflow
- Database tracking
- Analytics

---

### Week 10: Ban System

#### Progressive Bans
- [ ] Implement account suspension
- [ ] Create ban appeals process
- [ ] Build evidence collection
- [ ] Add IP/device tracking (privacy-respecting)
- [ ] Create ban evasion detection

**Deliverables:**
- Ban enforcement
- Appeal system
- Detection algorithms

#### Community Review
- [ ] Build ban review committee
- [ ] Create voting system
- [ ] Implement evidence presentation
- [ ] Document decisions
- [ ] Publish transparency reports

**Deliverables:**
- Review committee tools
- Decision logging
- Transparency page

---

### Week 10 Milestone: Complete Karma Loop

**Testing:**
- [ ] Test all penalty levels
- [ ] Verify redemption paths work
- [ ] Check ban system
- [ ] Test appeals
- [ ] Security audit

**Success Metrics:**
- <1% users reach negative karma
- 50%+ redemption success rate
- Clear, fair moderation
- Community supports system

---

## Phase 5: AI Article Generation (Weeks 11-12)

**Goal:** Prove AI-verified news concept

### Week 11: Article Generation

#### Claude Integration
- [ ] Create article generation prompt
- [ ] Build source fetching
- [ ] Implement synthesis logic
- [ ] Add citation system
- [ ] Test with various topics

**Deliverables:**
- `lib/ai/articleGenerator.ts`
- Generation prompts
- API integration

#### Source Management
- [ ] Create source input UI
- [ ] Build URL fetcher
- [ ] Extract article content
- [ ] Assess source reliability
- [ ] Store in database

**Deliverables:**
- `app/admin/sources/page.tsx`
- Source extraction logic
- Reliability scoring

#### Draft Management
- [ ] Create draft editor
- [ ] Version control for drafts
- [ ] Collaboration features
- [ ] Comment on drafts
- [ ] Approval workflow

**Deliverables:**
- Draft editor interface
- Version history
- Collaboration tools

---

### Week 12: Editorial Workflow

#### Review Interface
- [ ] Build editorial dashboard
- [ ] Side-by-side source comparison
- [ ] Fact-checking tools
- [ ] Vedic perspective review
- [ ] Quality checklist

**Deliverables:**
- Editorial dashboard
- Review tools
- Quality guidelines

#### Publishing Process
- [ ] Implement publish workflow
- [ ] Add verification badges
- [ ] Create update system
- [ ] Build changelog
- [ ] Schedule publishing

**Deliverables:**
- Publishing interface
- Badge system
- Update tracking

#### Public Transparency
- [ ] Show sources on articles
- [ ] Display editorial notes
- [ ] Add "How this was created" section
- [ ] Link to editorial guidelines
- [ ] Show update history

**Deliverables:**
- Article metadata display
- Transparency sections
- Public guidelines

---

### Week 12 Milestone: First AI Article

**Launch:**
- [ ] Generate first article
- [ ] Editorial review
- [ ] Publish with full transparency
- [ ] Announce methodology
- [ ] Gather feedback

**Success Metrics:**
- Article reads like human-written
- Sources properly cited
- No factual errors
- Positive community reception
- Clear verification process

---

## Phase 6: Community Posts (Weeks 13-14)

**Goal:** Enable Section 2 (Community Sangha)

### Week 13: Post Creation

#### Database Schema
- [ ] Create `community_posts` table
- [ ] Create `post_votes` table
- [ ] Add post types/tags
- [ ] Implement relationships
- [ ] Write migration

**Deliverables:**
- Migration script
- Updated schema

#### Post UI
- [ ] Build post creation form
- [ ] Rich text editor
- [ ] Tag selector
- [ ] Preview mode
- [ ] Submit flow

**Deliverables:**
- `app/sangha/create/page.tsx`
- `components/PostEditor.tsx`

#### Post Display
- [ ] Single post view
- [ ] Comment threads
- [ ] Voting system
- [ ] Share buttons
- [ ] Author attribution

**Deliverables:**
- `app/sangha/[id]/page.tsx`
- Post components

---

### Week 14: Discovery & Feed

#### Feed Algorithm
- [ ] Implement ranking
- [ ] Weight by karma
- [ ] Factor in recency
- [ ] Consider engagement
- [ ] Test different approaches

**Deliverables:**
- Feed ranking algorithm
- A/B testing framework

#### Topic Pages
- [ ] Create tag pages
- [ ] Filter by topic
- [ ] Sort options
- [ ] Search posts
- [ ] Topic subscriptions

**Deliverables:**
- Topic pages
- Search functionality
- Subscription system

#### Moderation
- [ ] Integrate auto-moderation
- [ ] Apply karma to posts
- [ ] Moderator tools
- [ ] Report system
- [ ] Hide/unhide

**Deliverables:**
- Post moderation
- Integration with existing tools

---

### Week 14 Milestone: Community Sangha Launch

**Testing:**
- [ ] Test post creation
- [ ] Verify feed works
- [ ] Check moderation
- [ ] Test voting
- [ ] Mobile testing

**Launch:**
- [ ] Soft launch to existing users
- [ ] Create welcome post
- [ ] Seed with quality content
- [ ] Monitor closely
- [ ] Iterate based on feedback

---

## Ongoing (Post-90 Days)

### Iteration & Improvement
- Weekly review of metrics
- Monthly community surveys
- Quarterly feature planning
- Regular security audits
- Continuous documentation updates

### Future Features (Backlog)
- Mobile apps (React Native)
- Advanced analytics
- Premium membership
- API for partners
- Internationalization (Hindi/Sanskrit)
- Educational content
- Live events/AMAs
- Podcast integration

---

## Risk Mitigation

### Technical Risks

**Risk:** AI analysis is slow
**Mitigation:** 
- Implement caching
- Use background jobs
- Batch processing
- Set timeout limits

**Risk:** Database performance degrades
**Mitigation:**
- Monitor query performance
- Add indexes proactively
- Connection pooling
- Read replicas if needed

**Risk:** Claude API rate limits
**Mitigation:**
- Implement queuing
- Cache similar requests
- Fallback scoring methods
- Rate limit users

---

### Product Risks

**Risk:** Users don't care about karma
**Mitigation:**
- Make benefits very clear
- Celebrate achievements
- Show progress visibly
- Iterate on value prop

**Risk:** Gaming becomes rampant
**Mitigation:**
- Detection algorithms
- Manual review
- Penalize heavily
- Public transparency

**Risk:** Community doesn't form
**Mitigation:**
- Seed quality content
- Active moderation
- Clear guidelines
- Invite thought leaders

---

## Success Criteria

### Week 4 (Karma MVP)
- ✅ 100+ karma transactions
- ✅ Average AI score >6.5
- ✅ User engagement with karma

### Week 8 (Intelligent Karma)
- ✅ Multi-signal working
- ✅ <5% false positives
- ✅ 50+ users at Sapling tier

### Week 12 (Full System)
- ✅ All tiers active
- ✅ 10+ Wise Ones
- ✅ 3+ Elders
- ✅ Self-moderation working

### Week 16 (AI + Community)
- ✅ First AI article published
- ✅ 100+ community posts
- ✅ Active daily discussions
- ✅ Culture self-sustaining

### Day 90 Overall
- ✅ 1,000 active users
- ✅ Karma system proven
- ✅ AI verification working
- ✅ Community engaged
- ✅ Path to sustainability clear

---

## Resource Requirements

### Development Time
- Solo developer: ~30 hours/week
- With help: ~15 hours/week
- Code reviews: 2 hours/week
- Documentation: 2 hours/week

### External Services
- Anthropic Claude API: ~$50/month
- Supabase: $25/month (Pro tier)
- Vercel: $20/month (Pro tier)
- Domain/email: $15/month
- **Total: ~$110/month**

### Community Management
- Moderation: 5 hours/week
- Content creation: 3 hours/week
- User support: 2 hours/week
- Community engagement: 5 hours/week

---

## Communication Plan

### Internal Updates
- Weekly progress summary
- Blockers and solutions
- Metrics review
- Next week priorities

### User Communication
- Feature announcements
- System updates
- Community highlights
- Educational content
- Transparency reports

### Documentation
- Update docs weekly
- Keep changelog current
- Document all decisions
- Share learnings publicly

---

**Next:** See COMMUNITY-GUIDELINES.md for behavioral expectations.
