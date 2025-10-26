# Karma System Specification

**Version:** 1.0  
**Date:** October 26, 2025  
**Status:** Design Specification

---

## Overview

The Karma System is the cultural foundation of Aryavarta, implementing digital karma (action-consequence) principles to reward dharmic behavior and discourage adharmic behavior. Unlike punitive moderation systems, this creates a **positive reinforcement loop** that shapes community culture.

---

## Core Philosophy

### Vedic Karma Principles

| Sanskrit Term | Meaning | Platform Implementation |
|---------------|---------|------------------------|
| **Karma** | Action | Comments, posts, votes |
| **Phala** | Fruit/Result | Karma points awarded |
| **Dharma** | Right action | Constructive, respectful discourse |
| **Adharma** | Wrong action | Toxic, destructive behavior |
| **Punya** | Merit | High karma, elevated status |
| **Papa** | Demerit | Low karma, limited privileges |
| **Moksha** | Liberation | Guru tier, trusted moderator |

### Design Principles

1. **Positive-First**: Reward good behavior more than punishing bad
2. **Transparent**: Users see why they got/lost points
3. **Fair**: Multiple signals, not just AI opinion
4. **Redeemable**: Always offer path to improvement
5. **Meaningful**: Benefits must be valuable
6. **Sustainable**: Can't be easily gamed

---

## Karma Calculation

### Multi-Signal Approach

Karma is calculated from **four weighted signals**:

```
Total Karma = (AI Score × 40%) + 
              (Community Score × 30%) + 
              (Engagement Score × 20%) + 
              (Moderation Bonus × 10%)
```

### Signal 1: AI Analysis (40% weight)

**Input:**
- Comment/post text
- Article context
- User history
- Time of day (spam pattern detection)

**Claude API Prompt:**
```
Analyze this contribution for dharmic qualities on a 1-10 scale:

TONE (Respectful even in disagreement)
- 10: Warm, respectful, acknowledges others
- 7: Neutral, professional, factual
- 4: Slightly dismissive or condescending
- 1: Hostile, insulting, attacking

CONSTRUCTIVENESS (Adds value to discussion)
- 10: New insights, evidence, helpful resources
- 7: Thoughtful perspective, builds on others
- 4: Vague agreement/disagreement, minimal effort
- 1: Derails discussion, pure negativity

THOUGHTFULNESS (Depth of engagement)
- 10: Nuanced, considers multiple angles, cites sources
- 7: Clear reasoning, specific examples
- 4: Surface-level, generic statements
- 1: One-liner, low effort

CONTENT: {comment_text}
CONTEXT: Discussion on "{article_title}"
USER HISTORY: Avg karma {avg_karma}, recent comments {recent_count}

Return JSON with scores and brief reasoning.
```

**Output:**
```json
{
  "tone": 8.5,
  "constructiveness": 9.0,
  "thoughtfulness": 7.5,
  "combined": 8.33,
  "reasoning": "Respectful disagreement with alternative sources provided...",
  "flags": [], // ["possible-sarcasm", "aggressive-language"]
  "suggested_karma": 12
}
```

**Scoring Formula:**
```typescript
const aiKarma = (
  (tone * 0.4) + 
  (constructiveness * 0.4) + 
  (thoughtfulness * 0.2)
);

// Map 1-10 to karma points
const baseKarma = Math.round(aiKarma); // 1-10 points
```

### Signal 2: Community Feedback (30% weight)

**Inputs:**
- Upvotes received
- Downvotes received
- "Helpful" flags
- "Not helpful" flags
- Replies generated
- Bookmark/save counts

**Calculation:**
```typescript
const netVotes = upvotes - downvotes;
const helpfulRatio = helpful / (helpful + notHelpful);
const engagementBonus = replies > 3 ? 2 : 0;

const communityKarma = Math.min(
  Math.round(netVotes * 0.5 + helpfulRatio * 3 + engagementBonus),
  15 // cap at 15 points
);
```

**Time Decay:**
```typescript
// Votes in first hour worth more (prevents pile-on)
const hoursSincePost = (now - posted_at) / (1000 * 60 * 60);
const timeMultiplier = hoursSincePost < 1 ? 1.5 : 1.0;

communityKarma *= timeMultiplier;
```

### Signal 3: Engagement Quality (20% weight)

**Metrics:**
- Reply depth (conversation sparked?)
- Time between posts (thoughtful vs spam?)
- Edit history (willingness to improve?)
- Read time before commenting (actually read article?)

**Calculation:**
```typescript
const engagementKarma = (
  (replyDepth > 2 ? 3 : 0) +
  (timeSinceLastComment > 300 ? 2 : 0) + // 5 min minimum
  (hasEdits ? 1 : 0) +
  (readTimePercent > 50 ? 2 : 0)
);

// Max 8 points from engagement
```

### Signal 4: Moderation Bonus/Penalty (10% weight)

**Bonuses:**
- No moderation flags: +2
- Resolved reports favorably: +5
- Editorial pick: +20
- Community recognition award: +10

**Penalties:**
- Auto-moderation flag: -5
- Manual hide: -10
- Repeat offense: -20
- Ban: -50 (and reset to 0)

**Special Cases:**
```typescript
// Thoughtful Dissent Bonus
if (minorityOpinion && highAiScore && negativeVotes) {
  moderationBonus += 15; // "Devil's Advocate" award
}

// Diversity Bonus
if (commentsAcrossMultipleTopics) {
  moderationBonus += 5;
}
```

### Final Karma Calculation

```typescript
function calculateKarma(signals: KarmaSignals): KarmaResult {
  const {
    aiScore,           // 1-10
    communityScore,    // 0-15
    engagementScore,   // 0-8
    moderationBonus    // -50 to +20
  } = signals;
  
  // Weighted combination
  const rawKarma = (
    (aiScore * 0.40) +
    (communityScore * 0.30) +
    (engagementScore * 0.20) +
    (moderationBonus * 0.10)
  );
  
  // Apply diminishing returns (anti-gaming)
  const todayComments = getUserCommentsToday(userId);
  const diminishingFactor = Math.max(0.2, 1 - (todayComments * 0.05));
  
  const finalKarma = Math.round(rawKarma * diminishingFactor);
  
  // Bounds check
  return Math.max(-50, Math.min(50, finalKarma));
}
```

---

## Karma Tiers

### Tier Definitions

```typescript
enum KarmaTier {
  SEEDLING = 'seedling',     // 0-99
  SAPLING = 'sapling',       // 100-499
  WISE_ONE = 'wise_one',     // 500-1499
  ELDER = 'elder',           // 1500-4999
  GURU = 'guru'              // 5000+
}

const TIER_THRESHOLDS = {
  seedling: 0,
  sapling: 100,
  wise_one: 500,
  elder: 1500,
  guru: 5000
};
```

### Tier Benefits

#### 🌱 Seedling (0-99 karma)

**Privileges:**
- Can comment on articles
- Can upvote/downvote
- 1 post per day in Community Sangha
- Basic profile customization

**Limitations:**
- Comments may be flagged for review
- Lower visibility in feeds
- Cannot create polls
- Cannot moderate

**Badge:** Green sprout icon

**Message:** "Welcome! Build karma through thoughtful contributions."

---

#### 🌿 Sapling (100-499 karma)

**New Privileges:**
- 3 posts per day
- Can create polls
- Slightly boosted visibility (+10% in feeds)
- Can nominate posts for "Thoughtful Discussion"
- Access to "Rising Contributors" section

**Badge:** Small tree icon, green-gold gradient

**Message:** "Growing strong! Your voice is valued in the sangha."

**Unlock Requirements:**
- 100 total karma
- At least 20 comments
- Account age: 7 days minimum

---

#### 🌳 Wise One (500-1499 karma)

**New Privileges:**
- 5 posts per day
- Can create discussion topics/threads
- Significant visibility boost (+25%)
- Can nominate others for recognition
- Access to "Wisdom Circle" private discussions
- Can suggest article topics to editorial team
- Comment previews show before posting

**Badge:** Large tree icon with golden leaves

**Message:** "You walk the path of wisdom. Guide others well."

**Unlock Requirements:**
- 500 total karma
- At least 100 comments
- Average AI score: 6.5+
- No moderation penalties in last 30 days
- Account age: 30 days minimum

---

#### 🏔️ Elder (1500-4999 karma)

**New Privileges:**
- 10 posts per day
- Can moderate discussions (limited scope)
- Highest visibility boost (+50%)
- Special "Elder" flair on all posts/comments
- Early access to new features (beta tester)
- Can host AMAs (Ask Me Anything)
- Votes worth 2x weight
- Can create temporary discussion groups
- Priority support from editorial team

**Badge:** Mountain peak icon, silver-white

**Message:** "Your wisdom shapes our community. Lead with dharma."

**Unlock Requirements:**
- 1500 total karma
- At least 500 comments
- Average AI score: 7.5+
- Positive moderation record
- Account age: 90 days minimum
- Completed "Community Leadership" training

---

#### 🕉️ Guru (5000+ karma)

**New Privileges:**
- Unlimited posting
- Trusted moderator abilities (can hide/unhide)
- Featured profile page
- Direct line to editorial team
- Can write guest articles for "Aryavarta Verified" section
- Name listed in "Community Council"
- Can mentor new members (assigned)
- Votes worth 3x weight
- Can override one auto-moderation action per day
- Annual in-person meetup invitation

**Badge:** Om symbol, golden gradient

**Message:** "You embody the dharma. Thank you for your service."

**Unlock Requirements:**
- 5000 total karma
- At least 1000 contributions
- Average AI score: 8.0+
- Spotless moderation record
- Account age: 180 days minimum
- Nomination by 3 other Gurus or editorial team
- Interview with community team

**Special Note:** Guru status can be revoked for serious violations

---

## Negative Karma System

### Progressive Limitations

#### Tier 0: Neutral (0 to -50 karma)

**Effects:**
- Comments auto-flagged for AI review before posting
- 2-minute delay between comments
- Lower feed visibility (-20%)
- Warning banner on profile
- Mandatory wait if AI scores <5

**Message:** "Your contributions need attention. Focus on thoughtful, respectful discourse."

**Path Forward:** 
- Earn 50 positive karma to return to Seedling
- No time limit on redemption

---

#### Tier -1: Restricted (-50 to -100 karma)

**Effects:**
- Mandatory 24h cooldown between comments
- Significantly reduced visibility (-50%)
- Cannot create new posts (comments only)
- Auto-flagged for moderation review
- Community guidelines quiz required

**Message:** "Your behavior conflicts with our dharmic principles. Please review guidelines."

**Path Forward:**
- Complete community guidelines quiz
- Write sincere appeal to moderators
- 7-day waiting period minimum
- Then earn 100 positive karma to return to 0

---

#### Tier -2: Probation (-100 to -200 karma)

**Effects:**
- Read-only mode for 7 days
- All future comments reviewed by moderator before posting
- Cannot vote or interact
- Profile badge shows "On Probation"

**Message:** "Your account is under review. Reflect on right action."

**Path Forward:**
- 7-day waiting period (enforced)
- Write 500-word reflection on dharmic discourse
- Reviewed by Community Council
- If approved, fresh start at 0 karma
- If denied, extended probation or permanent ban

---

#### Tier -3: Banned (-200+ karma)

**Effects:**
- Account suspended permanently
- Cannot create new account with same email
- All content hidden (but not deleted)

**Message:** "Your actions repeatedly violated community dharma. This account is suspended."

**Appeal Process:**
- Can appeal once after 90 days
- Must demonstrate understanding of violations
- Must show changed behavior elsewhere online
- Community Council vote required (3/5 approval)
- If approved, new account starts at 0 karma

---

## Anti-Gaming Measures

### Diminishing Returns

```typescript
// First 10 actions of the day worth full value
// Each subsequent action worth less
function applyDiminishingReturns(
  baseKarma: number, 
  actionsToday: number
): number {
  if (actionsToday <= 10) return baseKarma;
  
  const excessActions = actionsToday - 10;
  const penalty = Math.min(0.8, excessActions * 0.05);
  
  return Math.round(baseKarma * (1 - penalty));
}
```

### Variety Bonus

```typescript
// Reward engagement across different topics
function calculateVarietyBonus(userActivity: Activity): number {
  const uniqueArticles = new Set(
    userActivity.comments.map(c => c.article_slug)
  ).size;
  
  const uniqueTopics = new Set(
    userActivity.posts.flatMap(p => p.tags)
  ).size;
  
  const varietyScore = uniqueArticles + (uniqueTopics * 2);
  
  return Math.min(10, Math.floor(varietyScore / 5));
}
```

### Pattern Detection

```typescript
// Detect suspicious patterns
function detectGamingPatterns(user: User): GamePattern[] {
  const patterns: GamePattern[] = [];
  
  // Rapid-fire commenting
  if (commentsIn5Min > 10) {
    patterns.push({
      type: 'rapid_fire',
      severity: 'medium',
      action: 'flag_for_review'
    });
  }
  
  // Copy-paste detection
  if (commentSimilarity > 0.8) {
    patterns.push({
      type: 'duplicate_content',
      severity: 'high',
      action: 'invalidate_karma'
    });
  }
  
  // Vote manipulation
  if (votesFromSameIP > 5) {
    patterns.push({
      type: 'vote_manipulation',
      severity: 'critical',
      action: 'suspend_account'
    });
  }
  
  return patterns;
}
```

### Shadow Karma

```typescript
// Real karma vs displayed karma
interface KarmaState {
  displayedKarma: number;  // What user sees
  actualKarma: number;      // What we calculate
  shadowBonus: number;      // Hidden adjustment
  lastRecalc: Date;
}

// Recalculate periodically with hidden signals
function recalculateKarma(userId: string): void {
  const signals = gatherAllSignals(userId);
  const actual = calculateActualKarma(signals);
  const shadow = calculateShadowAdjustment(userId);
  
  updateKarmaState(userId, {
    actualKarma: actual,
    shadowBonus: shadow,
    displayedKarma: actual + shadow
  });
}
```

---

## Special Recognitions

### Beyond Points: Philosophical Badges

These are **hand-picked by editors**, can't be gamed:

#### Sattvic Contributor
**Criteria:** Consistently calm, wise, balanced
**Award:** Lotus icon, soft blue
**Benefit:** Profile featured in "Voices of Wisdom"

#### Bridge Builder
**Criteria:** Connects opposing viewpoints constructively
**Award:** Bridge icon, purple-gold gradient
**Benefit:** Invited to moderate debates

#### Truth Seeker
**Criteria:** Asks profound questions, admits uncertainty
**Award:** Question mark in circle, teal
**Benefit:** Early access to research articles

#### Wisdom Keeper
**Criteria:** Shares deep insights from scriptures/philosophy
**Award:** Book icon, amber
**Benefit:** Can write philosophy explainers

#### Humble Learner
**Criteria:** Changes mind with evidence, thanks teachers
**Award:** Folded hands icon, green
**Benefit:** Mentorship program access

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-2)

**Goal:** Prove concept, gather data

**Features:**
- Basic AI analysis on comment submission
- Award 1-10 karma based on quality
- Display total karma on profile
- Simple leaderboard page
- "Why this score?" explanation

**Success Metrics:**
- Do users care about karma numbers?
- Does AI scoring correlate with quality?
- Any gaming attempts?

---

### Phase 2: Intelligence (Weeks 3-4)

**Goal:** Refine quality assessment

**Features:**
- Full multi-signal calculation
- Community voting integration
- Engagement metrics
- Karma breakdown view (see all 4 signals)
- Transparency page explaining system

**Success Metrics:**
- Do quality comments get higher scores?
- Do users understand the scoring?
- Any false positives/negatives?

---

### Phase 3: Tiers (Weeks 5-7)

**Goal:** Make karma meaningful

**Features:**
- Launch full tier system
- Implement posting limits
- Add visibility boosts
- Create badges/flairs
- Unlock Wise One features

**Success Metrics:**
- Do users work toward next tier?
- Do high-karma users feel special?
- Does quality improve as users progress?

---

### Phase 4: Consequences (Weeks 8-10)

**Goal:** Handle negative behavior

**Features:**
- Negative karma tracking
- Progressive limitations
- Redemption paths
- Appeal process
- Moderation dashboard integration

**Success Metrics:**
- Do toxic users leave or improve?
- False positive rate on penalties?
- Redemption success rate?

---

### Phase 5: Community (Weeks 11-12)

**Goal:** Self-moderating culture

**Features:**
- Elder/Guru privileges
- Community Council
- Peer recognition system
- Guest article opportunities
- User-nominated awards

**Success Metrics:**
- Can community moderate itself?
- Quality maintained at scale?
- Culture self-reinforcing?

---

## User Experience

### First-Time User Flow

1. **Signup → Welcome bonus (+50 karma)**
   "Welcome to Aryavarta! Start with 50 karma to explore."

2. **Profile completion → Bonus (+10 karma)**
   "Thanks for completing your profile!"

3. **First comment → Extra bonus (+10 karma)**
   "Great first comment! Here's why you earned 18 karma..."

4. **Shows breakdown:**
   ```
   AI Analysis: 8/10 (Thoughtful and respectful) = +8
   First Comment Bonus = +10
   Total: +18 karma
   
   You're on your way to Sapling tier! (82 karma to go)
   ```

5. **Tips shown:**
   "💡 Earn more karma by:
   - Citing sources in your arguments
   - Responding thoughtfully to others
   - Asking insightful questions
   - Being respectful even in disagreement"

### Ongoing Engagement

**After each comment:**
```
┌─────────────────────────────────────┐
│ Comment posted!                     │
│                                     │
│ Karma earned: +12                   │
│ Total karma: 287                    │
│                                     │
│ Breakdown:                          │
│ • AI score: 8.5/10 → +9 karma      │
│ • Thoughtfulness bonus → +3         │
│                                     │
│ Progress to Wise One: 213/500      │
│ ████████████░░░░░░░░ 43%           │
│                                     │
│ [Why this score?] [View profile]   │
└─────────────────────────────────────┘
```

**On tier level-up:**
```
┌─────────────────────────────────────────┐
│  🎉 Congratulations!                    │
│                                         │
│  You've reached Sapling tier!           │
│                                         │
│  New privileges unlocked:               │
│  ✓ Post 3 times per day                │
│  ✓ Create polls                         │
│  ✓ Increased visibility                 │
│  ✓ "Trusted Member" badge               │
│                                         │
│  Keep growing! Next tier: Wise One      │
│  (213 karma to go)                      │
│                                         │
│  [View benefits] [Customize badge]      │
└─────────────────────────────────────────┘
```

---

## API Specifications

### POST /api/karma/analyze

**Request:**
```json
{
  "commentId": "uuid",
  "commentText": "string",
  "articleSlug": "string",
  "userHistory": {
    "avgKarma": 8.2,
    "recentComments": 15,
    "accountAge": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "karmaAwarded": 12,
    "breakdown": {
      "aiScore": 8.5,
      "aiReasoning": "Thoughtful analysis with sources...",
      "communityScore": 0,
      "engagementScore": 3,
      "moderationBonus": 0
    },
    "newTotal": 299,
    "progress": {
      "currentTier": "sapling",
      "nextTier": "wise_one",
      "pointsToNext": 201,
      "percentComplete": 39.8
    }
  }
}
```

### GET /api/karma/user/:userId

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "dharma_seeker",
    "totalKarma": 1250,
    "tier": "wise_one"
  },
  "stats": {
    "commentsCount": 342,
    "postsCount": 28,
    "avgAiScore": 7.8,
    "helpfulVotes": 156,
    "badges": ["sattvic_contributor", "truth_seeker"]
  },
  "recentTransactions": [
    {
      "date": "2025-10-26",
      "karma": 15,
      "reason": "High-quality comment",
      "commentId": "uuid"
    }
  ]
}
```

---

## Monitoring & Analytics

### Metrics Dashboard

**Karma Health Metrics:**
- Average karma per user (target: trending up)
- Karma distribution (should be bell curve)
- Tier progression rate
- Redemption success rate
- Appeal approval rate

**Quality Metrics:**
- Average AI score per comment (target: >7.0)
- Correlation between AI score and community votes
- False positive rate (AI wrong, community right)
- False negative rate (AI right, community wrong)

**Gaming Detection:**
- Flagged gaming patterns per day
- Suspended accounts
- Karma invalidations
- Shadow adjustments made

**Business Impact:**
- User retention by karma tier
- Comments per user by tier
- High-karma user referral rate
- Premium conversion by tier

---

## Success Criteria

**Week 4:**
- ✅ Users engage with karma numbers (check comments)
- ✅ AI scores generally align with quality (80%+ correlation)
- ✅ No major gaming exploits found

**Week 8:**
- ✅ 50+ users at Sapling tier or higher
- ✅ Average comment AI score > 7.0
- ✅ <5% false positive rate on penalties

**Week 12:**
- ✅ 10+ users at Elder tier
- ✅ Community moderates 70% of flags successfully
- ✅ Self-sustaining culture (values spread peer-to-peer)

---

**Next:** See IMPLEMENTATION-ROADMAP.md for 90-day build plan.
