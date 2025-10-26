# Aryavarta Technical Architecture

**Version:** 2.0  
**Date:** October 26, 2025  
**Last Updated:** October 26, 2025

---

## System Overview

Aryavarta is built on a modern web stack optimized for performance, scalability, and developer velocity. The architecture supports three main pillars: AI-verified news, community engagement, and karma-driven culture.

### Technology Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

**Backend**
- Next.js API Routes (serverless)
- Supabase (PostgreSQL + Auth + Storage)
- Anthropic Claude API (AI content & analysis)

**Infrastructure**
- Vercel (hosting, edge functions, CDN)
- Supabase Cloud (database, auth, storage)
- Resend (transactional email)

**Development**
- Git/GitHub (version control)
- ESLint + Prettier (code quality)
- TypeScript (type safety)

---

## Architecture Principles

1. **Serverless-First**: Leverage managed services to minimize operational overhead
2. **Edge-Optimized**: Content delivered from CDN, dynamic at edge when possible
3. **Type-Safe**: TypeScript throughout to catch errors early
4. **Progressive Enhancement**: Core functionality works without JS
5. **Privacy-Respecting**: Minimal data collection, user control
6. **Cost-Conscious**: Start cheap, scale smartly

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User's Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Articles   │  │   Comments   │  │    Profile   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Static CDN  │  │ Edge Runtime │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬────────────────────┬────────────────────────────┘
             │                    │
             ▼                    ▼
┌─────────────────────┐  ┌─────────────────────────────────────┐
│   Next.js Server    │  │       External Services             │
│  ┌──────────────┐   │  │  ┌────────────┐  ┌──────────────┐  │
│  │  API Routes  │   │  │  │  Anthropic │  │    Resend    │  │
│  │              │   │  │  │   Claude   │  │    Email     │  │
│  │ - Auth       │   │  │  │    API     │  │   Service    │  │
│  │ - Comments   │   │  │  └────────────┘  └──────────────┘  │
│  │ - Karma      │   │  │                                     │
│  │ - Moderation │   │  │                                     │
│  │ - Articles   │   │  │                                     │
│  └──────────────┘   │  │                                     │
└──────────┬───────────┘  └─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Auth Server │  │   Storage    │      │
│  │              │  │              │  │              │      │
│  │ - subscribers│  │ - users      │  │ - uploads    │      │
│  │ - comments   │  │ - sessions   │  │ - images     │      │
│  │ - karma      │  │ - tokens     │  │              │      │
│  │ - posts      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

#### subscribers
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subscribers_auth_user_id (auth_user_id),
  INDEX idx_subscribers_email (email),
  INDEX idx_subscribers_username (username)
);
```

#### comments
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL REFERENCES subscribers(email) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Moderation fields
  moderation_status VARCHAR(50) DEFAULT 'visible',
  hidden_reason TEXT,
  
  -- Indexes
  INDEX idx_comments_article_slug (article_slug),
  INDEX idx_comments_user_email (user_email),
  INDEX idx_comments_parent_id (parent_comment_id),
  INDEX idx_comments_active (article_slug, is_deleted, created_at DESC)
);
```

### Karma System Tables

#### user_karma
```sql
CREATE TABLE user_karma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES subscribers(auth_user_id) ON DELETE CASCADE,
  total_karma INT DEFAULT 0,
  karma_tier VARCHAR(50) DEFAULT 'seedling',
  tier_since TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  
  -- Stats
  posts_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  
  -- Constraints
  UNIQUE(user_id),
  INDEX idx_user_karma_total (total_karma DESC),
  INDEX idx_user_karma_tier (karma_tier)
);
```

#### karma_transactions
```sql
CREATE TABLE karma_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES subscribers(auth_user_id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  post_id UUID REFERENCES community_posts(id) ON DELETE SET NULL,
  
  karma_change INT NOT NULL,
  reason VARCHAR(100) NOT NULL,
  
  -- Scoring breakdown
  ai_score DECIMAL(3,2),
  community_score INT,
  engagement_score INT,
  moderation_bonus INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_karma_transactions_user (user_id, created_at DESC),
  INDEX idx_karma_transactions_created (created_at DESC)
);
```

#### comment_analysis
```sql
CREATE TABLE comment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE UNIQUE,
  
  -- AI scores (1-10 scale)
  ai_tone_score DECIMAL(3,2),
  ai_constructiveness DECIMAL(3,2),
  ai_thoughtfulness DECIMAL(3,2),
  combined_ai_score DECIMAL(3,2),
  
  -- AI reasoning
  ai_reasoning TEXT,
  detected_issues TEXT[], -- array of potential problems
  
  analysis_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_comment_analysis_score (combined_ai_score DESC),
  INDEX idx_comment_analysis_timestamp (analysis_timestamp DESC)
);
```

### Community Posts Tables

#### community_posts
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES subscribers(auth_user_id) ON DELETE CASCADE,
  
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  post_type VARCHAR(50) DEFAULT 'discussion',
  tags TEXT[],
  
  karma_score INT DEFAULT 0,
  view_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_moderated BOOLEAN DEFAULT FALSE,
  moderation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_community_posts_user (user_id),
  INDEX idx_community_posts_type (post_type),
  INDEX idx_community_posts_karma (karma_score DESC),
  INDEX idx_community_posts_activity (last_activity_at DESC),
  INDEX idx_community_posts_tags (tags) USING GIN
);
```

#### post_votes
```sql
CREATE TABLE post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES subscribers(auth_user_id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(post_id, user_id),
  INDEX idx_post_votes_post (post_id),
  INDEX idx_post_votes_user (user_id)
);
```

### Article Verification Tables

#### article_sources
```sql
CREATE TABLE article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug VARCHAR(255) NOT NULL,
  
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_domain TEXT,
  source_type VARCHAR(50), -- 'news', 'academic', 'government', 'blog'
  
  reliability_score DECIMAL(3,2), -- AI assessment of source quality
  
  accessed_at TIMESTAMPTZ NOT NULL,
  verified_by UUID REFERENCES subscribers(auth_user_id),
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_article_sources_slug (article_slug),
  INDEX idx_article_sources_domain (source_domain)
);
```

#### article_metadata
```sql
CREATE TABLE article_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Content tracking
  word_count INT,
  reading_time_minutes INT,
  ai_generated BOOLEAN DEFAULT FALSE,
  
  -- Editorial
  written_by VARCHAR(100), -- 'ai' or editor name
  reviewed_by UUID REFERENCES subscribers(auth_user_id),
  published_by UUID REFERENCES subscribers(auth_user_id),
  
  -- Timestamps
  drafted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ,
  
  -- Verification
  verification_status VARCHAR(50) DEFAULT 'draft',
  source_count INT DEFAULT 0,
  
  -- Analytics
  view_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  avg_read_percentage DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_article_metadata_slug (article_slug),
  INDEX idx_article_metadata_published (published_at DESC),
  INDEX idx_article_metadata_status (verification_status)
);
```

---

## API Architecture

### REST Endpoints

#### Authentication
```
POST   /api/auth/signup          - Create new account
POST   /api/auth/login           - Login with email/password
POST   /api/auth/logout          - End session
POST   /api/auth/resend          - Resend verification email
GET    /api/auth/session         - Get current session
POST   /api/auth/reset-password  - Request password reset
```

#### Comments
```
GET    /api/comments/:slug       - Get comments for article
POST   /api/comments/:slug       - Create new comment
PATCH  /api/comments/:id         - Update comment
DELETE /api/comments/:id         - Delete comment
POST   /api/comments/reactions   - Add reaction
POST   /api/comments/report      - Report comment
```

#### Karma System
```
POST   /api/karma/analyze        - Analyze comment for karma
GET    /api/karma/user/:id       - Get user karma details
GET    /api/karma/transactions   - Get karma history
GET    /api/karma/leaderboard    - Top karma users
POST   /api/karma/appeal         - Appeal karma decision
```

#### Community Posts
```
GET    /api/posts                - List posts (with filters)
POST   /api/posts                - Create new post
GET    /api/posts/:id            - Get post details
PATCH  /api/posts/:id            - Update post
DELETE /api/posts/:id            - Delete post
POST   /api/posts/:id/vote       - Vote on post
```

#### Moderation
```
GET    /api/moderation/queue     - Get moderation queue
GET    /api/moderation/metrics   - Get metrics
GET    /api/moderation/activity  - Get activity feed
POST   /api/moderation/action    - Take moderation action
```

#### Articles (Admin)
```
POST   /api/articles/generate    - Generate article from sources
POST   /api/articles/review      - Submit editorial review
POST   /api/articles/publish     - Publish article
GET    /api/articles/drafts      - List draft articles
```

---

## AI Integration

### Anthropic Claude API Usage

#### 1. Article Generation
```typescript
// /api/articles/generate
Input: {
  topic: string,
  sources: string[], // URLs
  perspective: 'vedic' | 'neutral',
  targetLength: number
}

Process:
1. Fetch content from sources
2. Send to Claude with prompt:
   "Synthesize these sources into article...
    Apply Vedic perspective...
    Cite sources inline..."
3. Parse response
4. Create draft in database
5. Return for editorial review

Output: {
  articleSlug: string,
  content: string,
  sources: Array<{url, relevance}>,
  suggestedTitle: string
}
```

#### 2. Comment Karma Analysis
```typescript
// /api/karma/analyze
Input: {
  commentText: string,
  articleContext: string,
  userHistory: {
    avgKarma: number,
    recentComments: number
  }
}

Prompt Template:
"Analyze this comment for dharmic qualities:
- Tone (respectful=10, hostile=1)
- Constructiveness (helpful=10, destructive=1)
- Thoughtfulness (deep=10, shallow=1)

Comment: {commentText}
Context: Discussion on {articleTitle}

Return JSON: {
  tone: number,
  constructiveness: number,
  thoughtfulness: number,
  reasoning: string,
  flags: string[]
}"

Output: {
  scores: {tone, constructiveness, thoughtfulness},
  combinedScore: number,
  reasoning: string,
  suggestedKarma: number
}
```

#### 3. Content Moderation
```typescript
// Called automatically on comment submission
Input: {
  content: string,
  type: 'comment' | 'post'
}

Prompt:
"Check for policy violations:
- Personal attacks
- Hate speech
- Spam/manipulation
- Misinformation

Content: {content}

Return: {
  violations: string[],
  severity: 'none'|'low'|'medium'|'high',
  shouldHide: boolean,
  reason: string
}"

Output: {
  autoHide: boolean,
  flagType: string,
  reason: string
}
```

### Cost Management

**Estimated Claude API Costs:**
- Article generation: ~$0.15 per article (4K input + 2K output)
- Comment analysis: ~$0.001 per comment (500 tokens avg)
- Moderation check: ~$0.0005 per item (250 tokens avg)

**Monthly estimate for 10K active users:**
- 50 articles: $7.50
- 5,000 comments: $5.00
- 10,000 moderation checks: $5.00
- **Total: ~$20/month**

**Optimization strategies:**
1. Cache similar analyses
2. Batch process when possible
3. Use cheaper models for obvious cases
4. Rate limit to prevent abuse

---

## Security Architecture

### Authentication Flow

```
User submits credentials
    ↓
Next.js API validates format
    ↓
Supabase Auth verifies
    ↓
Session token issued (JWT)
    ↓
HTTP-only cookie set
    ↓
Middleware validates on each request
    ↓
User identity passed to API routes
```

### Row Level Security (RLS)

**Subscribers table:**
```sql
-- Users can read their own data
CREATE POLICY "Users read own data"
  ON subscribers FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users update own data"
  ON subscribers FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);
```

**Comments table:**
```sql
-- Anyone can read visible comments
CREATE POLICY "Read visible comments"
  ON comments FOR SELECT
  USING (is_deleted = FALSE AND moderation_status = 'visible');

-- Users can create if authenticated
CREATE POLICY "Create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT auth_user_id FROM subscribers WHERE email = user_email
  ));
```

**Community posts:**
```sql
-- Anyone can read published posts
CREATE POLICY "Read published posts"
  ON community_posts FOR SELECT
  USING (is_moderated = FALSE);

-- Users can CRUD their own posts
CREATE POLICY "Manage own posts"
  ON community_posts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### API Security

**Rate Limiting:**
```typescript
// Middleware checks
const rateLimits = {
  '/api/comments': '10 per minute',
  '/api/posts': '5 per minute',
  '/api/karma/analyze': '20 per minute',
  '/api/articles/generate': '1 per hour' // admin only
};
```

**Input Validation:**
```typescript
// Zod schemas for all inputs
const CommentSchema = z.object({
  article_slug: z.string().max(255),
  comment_text: z.string().min(1).max(5000),
  parent_comment_id: z.string().uuid().optional()
});
```

**CORS Policy:**
```typescript
// Restrict origins
const allowedOrigins = [
  'https://arya-varta.in',
  'https://www.arya-varta.in',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);
```

---

## Performance Optimization

### Caching Strategy

**Static Content:**
- Articles: Cache at CDN, revalidate on publish
- Images: CDN cached indefinitely
- CSS/JS: Fingerprinted, cached forever

**Dynamic Content:**
- Comment counts: Cache 1 minute
- Karma leaderboard: Cache 5 minutes
- User profiles: Cache 1 minute, purge on update

**Database:**
- Connection pooling via Supabase
- Indexes on all foreign keys
- Materialized views for analytics

### Code Splitting

```
Page bundles:
- Home: 150KB
- Article: 120KB
- Profile: 100KB
- Admin: 200KB

Shared chunks:
- React/Next: 80KB
- UI components: 40KB
- Auth: 20KB
```

### Image Optimization

- Next.js Image component for lazy loading
- WebP format with JPEG fallback
- Responsive sizes: 640w, 750w, 828w, 1080w, 1200w
- Blur placeholders for perceived performance

---

## Monitoring & Observability

### Metrics to Track

**Application:**
- API response times (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Claude API latency
- Cache hit rates

**Business:**
- DAU/MAU
- Karma distribution
- Comment quality scores
- Article publish rate
- User tier progression

**Infrastructure:**
- Vercel function invocations
- Supabase connection count
- Storage usage
- Bandwidth consumption

### Error Handling

```typescript
// Standardized error responses
type ApiError = {
  error: string;
  code: string;
  details?: any;
  timestamp: string;
};

// Logging
console.error('[api-route]', {
  error: err.message,
  stack: err.stack,
  user: userId,
  endpoint: req.url,
  timestamp: new Date().toISOString()
});
```

### Alerting

**Critical alerts** (immediate):
- API error rate >5%
- Database connection failures
- Authentication failures spike
- Claude API quota exceeded

**Warning alerts** (review daily):
- Slow query performance
- High moderation queue
- Karma gaming patterns detected
- Unusual traffic patterns

---

## Development Workflow

### Local Development

```bash
# Setup
npm install
cp .env.example .env.local
# Add keys to .env.local

# Run
npm run dev

# Test
npm run test
npm run test:e2e

# Lint
npm run lint
npm run type-check
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

on:
  push:
    branches: [main]

jobs:
  test:
    - Lint code
    - Type check
    - Run unit tests
    - Run E2E tests
  
  deploy:
    needs: test
    - Deploy to Vercel
    - Run database migrations
    - Smoke test production
```

### Database Migrations

```bash
# Create migration
npm run migration:create add_karma_tables

# Apply migration
npm run migration:up

# Rollback
npm run migration:down
```

---

## Scalability Considerations

### Current Architecture (0-10K users)
- Vercel hobby/pro plan
- Supabase free/pro tier
- Minimal Claude API usage
- **Cost: ~$50/month**

### Growth Phase (10K-100K users)
- Vercel enterprise
- Supabase team tier
- Read replicas for analytics
- Redis cache layer
- **Cost: ~$500/month**

### Scale Phase (100K-1M users)
- Dedicated database instances
- Multi-region deployment
- Advanced caching (Cloudflare)
- Full-text search (Algolia)
- **Cost: ~$5K/month**

### Bottleneck Analysis

**Likely first bottleneck:** Database connections
**Solution:** Connection pooling, read replicas

**Likely second bottleneck:** Claude API rate limits
**Solution:** Caching, batching, alternative models

**Likely third bottleneck:** Vercel function execution time
**Solution:** Background jobs, queue system

---

## Disaster Recovery

### Backup Strategy
- **Database:** Supabase daily backups (7-day retention)
- **Code:** Git version control
- **Config:** Environment variables in 1Password
- **Content:** Articles in Git, also in DB

### Recovery Procedures

**Database corruption:**
1. Restore from latest Supabase backup
2. Replay transactions from logs
3. Verify data integrity
4. Update users if data loss

**Code deployment failure:**
1. Rollback via Vercel dashboard
2. Fix issue locally
3. Deploy again
4. Monitor

**Security breach:**
1. Rotate all API keys
2. Force logout all users
3. Audit access logs
4. Notify affected users
5. Update security measures

---

## Technology Decisions Log

### Why Next.js?
- Full-stack React framework
- Excellent SEO support
- Edge runtime support
- Easy deployment to Vercel
- Strong TypeScript support

### Why Supabase?
- PostgreSQL (familiar, powerful)
- Built-in authentication
- Real-time capabilities
- Row Level Security
- Good free tier for MVP

### Why Claude API?
- Best-in-class reasoning
- Long context windows
- Reliable for analysis
- Good documentation
- Reasonable pricing

### Why NOT WordPress/Ghost?
- Need custom karma system
- Complex moderation logic
- AI integration requirements
- Full control over UX

---

**Next:** See KARMA-SYSTEM-SPEC.md for detailed karma implementation.
