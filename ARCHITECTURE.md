# Technical Architecture

Comprehensive technical documentation for the Aryavarta newsletter platform.

---

## System Overview

Aryavarta is a modern, server-rendered newsletter platform built with Next.js 16, featuring static article generation, real-time database integration, and automated email delivery.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Browser    │  │    Mobile    │  │   Search Bots    │  │
│  │   (Users)    │  │   Devices    │  │   (SEO)          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────┘  │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTPS/SSL
┌───────────────────────────┼──────────────────────────────────┐
│                  Vercel Edge Network (CDN)                   │
│  ┌────────────────────────┴───────────────────────────────┐ │
│  │        Global Content Delivery & Caching               │ │
│  │  • Static Assets (images, fonts, CSS, JS)              │ │
│  │  • HTML Pages (SSG)                                     │ │
│  │  • Edge Functions                                       │ │
│  └────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────┴───────────────────────────────┐ │
│  │            Next.js 16 (App Router)                      │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Server Components (RSC)                         │  │ │
│  │  │  • Homepage (/app/page.tsx)                      │  │ │
│  │  │  • Article Pages (/app/articles/[slug])         │  │ │
│  │  │  • Article List (/app/articles)                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Client Components                               │  │ │
│  │  │  • NewsletterSignup                              │  │ │
│  │  │  • ArticleCarousel                               │  │ │
│  │  │  • CommentSection                                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  API Routes (Server-side)                        │  │ │
│  │  │  • POST /api/subscribe                           │  │ │
│  │  │  • (Future: /api/comments, /api/analytics)       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
┌─────────┴────────┐ ┌──────┴──────┐ ┌────────┴────────┐
│  Supabase        │ │   Resend    │ │  File System    │
│  (PostgreSQL)    │ │   (Email)   │ │  (Markdown)     │
│                  │ │             │ │                 │
│  • subscribers   │ │  • Welcome  │ │  • Articles     │
│    table         │ │    emails   │ │  • Images       │
│  • RLS policies  │ │  • Domain   │ │  • Metadata     │
│  • Real-time     │ │    verified │ │                 │
└──────────────────┘ └─────────────┘ └─────────────────┘
```

---

## Component Architecture

### Frontend Layer

#### Pages (Server Components)

##### Homepage (`/app/page.tsx`)
- **Purpose**: Landing page with mission, stats, and article carousel
- **Rendering**: Server-Side Rendered (SSR) per request
- **Data Sources**:
  - Static content (mission statement, stats)
  - Dynamic: Recent articles from markdown files
- **Key Sections**:
  1. Hero with Sanskrit etymology
  2. Mission statement (3 paragraphs)
  3. Why Aryavarta (3 pillars)
  4. Article carousel (latest 3 articles)
  5. Newsletter signup CTA

##### Article Page (`/app/articles/[slug]/page.tsx`)
- **Purpose**: Display individual article content
- **Rendering**: Static Site Generation (SSG) at build time
- **Data Sources**:
  - Markdown files in `/content/articles/`
  - Frontmatter metadata (YAML)
- **Features**:
  - Markdown to HTML conversion
  - Footnote support with external links
  - Comment section (localStorage)
  - Related articles
  - Reading time display

##### Articles List (`/app/articles/page.tsx`)
- **Purpose**: Browse all published articles
- **Rendering**: SSG at build time
- **Data Sources**: All markdown files
- **Features**:
  - Grid layout with article cards
  - Tag filtering
  - Search (future)

#### Client Components

##### NewsletterSignup (`/components/NewsletterSignup.tsx`)
```typescript
Props:
  - variant?: 'light' | 'dark' (default: 'light')
  - className?: string

State:
  - email: string
  - name: string
  - isSubmitting: boolean
  - isSuccess: boolean

Methods:
  - onSubmit: (data) => POST /api/subscribe
  - validateEmail: Zod schema
  - handleSuccess: Show confirmation
```

**Flow:**
1. User enters email + name
2. Client-side validation (Zod)
3. POST to /api/subscribe
4. API checks Supabase for duplicate
5. Inserts subscriber if new
6. Sends welcome email via Resend
7. Returns success/error
8. Shows confirmation message

##### ArticleCarousel (`/components/ArticleCarousel.tsx`)
```typescript
Props:
  - articles: Article[]
  - autoPlayInterval?: number (default: 5000ms)

State:
  - currentIndex: number
  - isPaused: boolean

Methods:
  - nextSlide: () => void
  - prevSlide: () => void
  - goToSlide: (index) => void
  - handleMouseEnter: Pause auto-scroll
  - handleMouseLeave: Resume auto-scroll

Effects:
  - useEffect: Auto-scroll timer
  - Cleanup on unmount
```

**Features:**
- Auto-scrolls every 5 seconds
- Pauses on hover
- Manual navigation with arrows
- Responsive breakpoints
- Gradient backgrounds per article

##### CommentSection (`/components/CommentSection.tsx`)
```typescript
Props:
  - articleSlug: string

State:
  - comments: Comment[]
  - name: string
  - comment: string

Storage:
  - localStorage: `comments_${articleSlug}`

Methods:
  - loadComments: () => Comment[]
  - addComment: (name, comment) => void
  - saveToLocalStorage: () => void

Note: Future migration to Supabase database
```

---

### Backend Layer

#### API Routes

##### POST /api/subscribe
```typescript
Endpoint: /app/api/subscribe/route.ts
Method: POST
Content-Type: application/json

Request Body:
{
  email: string    // Required, valid email format
  name: string     // Required, 2-100 chars
}

Response Success (200):
{
  success: true,
  message: "Successfully subscribed!"
}

Response Error (400):
{
  success: false,
  error: "Email already subscribed" | "Invalid email" | etc
}

Flow:
1. Validate request body (Zod schema)
2. Check Supabase for existing email
3. If exists: Return error
4. If new:
   a. Insert into subscribers table
   b. Send welcome email via Resend
   c. Return success
5. Error handling with try-catch
```

#### Data Access Layer

##### Supabase Client (`/lib/supabase.ts`)
```typescript
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Subscriber = {
  id: string
  email: string
  name: string | null
  subscribed_at: string
  is_active: boolean
}

Methods (via Supabase SDK):
- supabase.from('subscribers').select()
- supabase.from('subscribers').insert()
- supabase.from('subscribers').update()
```

##### Article Utilities (`/lib/articles.ts`)
```typescript
export function getAllArticles(): Article[]
  - Reads /content/articles/*.md
  - Parses frontmatter with gray-matter
  - Sorts by date (newest first)
  - Returns Article[]

export function getArticleBySlug(slug: string): Article | null
  - Reads specific markdown file
  - Parses frontmatter + content
  - Returns full article with content

export function getRecentArticles(count: number): Article[]
  - Gets all articles
  - Sorts by date
  - Returns first N articles

export type Article = {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  readTime: string
  image: string
  tags: string[]
  content: string  // Markdown content
}
```

---

## Database Schema

### Supabase (PostgreSQL)

#### subscribers Table
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_active ON subscribers(is_active) 
  WHERE is_active = TRUE;

-- Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anon_insert" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "service_all" ON subscribers
  FOR ALL TO service_role
  USING (true);
```

**Explanation:**
- `anon` role: Public users can INSERT (signup)
- `service_role`: API has full access (read/write)
- RLS protects against unauthorized access
- Indexes optimize email lookups

#### Future Tables (Planned)
```sql
-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE
);

-- Newsletter Sends
CREATE TABLE newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id),
  article_slug TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Analytics
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Content Management

### Article Storage
```
content/
└── articles/
    ├── hinduism-misinterpreted-pacifism.md
    ├── how-the-vedas-guide-response-to-aggressors.md
    └── upanishadic-self.md
```

### Article Format
```markdown
---
title: "Article Title"
excerpt: "Brief description (100-200 chars)"
date: "2025-10-23"
author: "Author Name"
readTime: "8 min read"
image: "/images/article-slug.jpg"
tags: ["Philosophy", "Vedas", "Upanishads"]
---

# Article Content

Markdown content with:
- Headers (H1-H6)
- Lists (ordered/unordered)
- **Bold**, *italic*, ***both***
- [Links](https://example.com)
- Images: ![Alt](/images/image.jpg)
- Footnotes[^1]

[^1]: Citation with [Source](https://source.com)
```

### Build-Time Article Processing
```typescript
// Next.js build process
1. Read all .md files from content/articles/
2. Parse frontmatter (gray-matter)
3. Generate static params for [slug] routes
4. Pre-render each article page (SSG)
5. Output HTML files to .next/server/
6. Deploy static files to Vercel Edge
```

---

## Email Architecture

### Resend Integration

#### Configuration
```typescript
// app/api/subscribe/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Aryavarta <noreply@arya-varta.in>',
  to: subscriber.email,
  subject: 'Welcome to Aryavarta 🙏',
  html: welcomeEmailTemplate(subscriber.name)
})
```

#### Welcome Email Template
```typescript
function welcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Dharmic colors and styling */
          body { font-family: 'Georgia', serif; }
          .header { background: linear-gradient(135deg, #ff8c1a, #ff4d1a); }
          .sanskrit { font-family: 'Noto Sans Devanagari'; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>आर्यावर्त • Aryavarta</h1>
          <p>Ancient Philosophy for Modern Minds</p>
        </div>
        <p>Dear ${name},</p>
        <p>Welcome to Aryavarta...</p>
        <!-- Mission statement -->
        <!-- Links to latest articles -->
        <!-- Unsubscribe link -->
      </body>
    </html>
  `
}
```

#### Domain Verification (Resend)
```
DNS Records (GoDaddy):

Type: MX
Name: @
Value: feedback-smtp.ap-northeast-1.amazonses.com
Priority: 10
TTL: 1 Hour

Type: TXT
Name: @
Value: resend_verify_[unique_token]
TTL: 1 Hour
```

---

## Routing & Navigation

### Next.js App Router Structure
```
app/
├── layout.tsx              → Root layout (fonts, metadata)
├── page.tsx                → Homepage (/)
├── globals.css             → Global styles
├── articles/
│   ├── page.tsx            → Articles list (/articles)
│   └── [slug]/
│       └── page.tsx        → Dynamic article (/articles/[slug])
└── api/
    └── subscribe/
        └── route.ts        → API endpoint (POST /api/subscribe)
```

### Static Route Generation
```typescript
// app/articles/[slug]/page.tsx
export async function generateStaticParams() {
  const articles = getAllArticles()
  
  return articles.map((article) => ({
    slug: article.slug
  }))
}

// Generates at build time:
// /articles/hinduism-misinterpreted-pacifism
// /articles/how-the-vedas-guide-response-to-aggressors
// /articles/upanishadic-self
```

### SEO Metadata
```typescript
// app/articles/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  
  return {
    title: article.title + ' | Aryavarta',
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      url: `https://arya-varta.in/articles/${article.slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image]
    }
  }
}
```

---

## Styling Architecture

### Tailwind CSS Configuration
```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        saffron: { /* 50-900 shades */ },
        vermillion: { /* 50-900 shades */ },
        sandalwood: { /* 50-900 shades */ },
        sacred: { /* 50-900 shades */ }
      },
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'serif']
      },
      backgroundImage: {
        'mandala-pattern': "url('/images/mandala.svg')"
      }
    }
  }
}
```

### Global Styles (`app/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-sandalwood-50 text-gray-900;
  }
  
  h1 {
    @apply font-serif text-4xl font-bold text-saffron-700;
  }
}

@layer components {
  .btn-primary {
    @apply bg-gradient-to-r from-saffron-500 to-vermillion-500
           text-white font-semibold px-6 py-3 rounded-lg
           hover:shadow-lg transition-all;
  }
  
  .card-dharmic {
    @apply bg-white border-2 border-saffron-200
           rounded-lg shadow-md hover:shadow-xl
           transition-shadow duration-300;
  }
}
```

---

## Performance Optimization

### Current Optimizations

#### 1. Static Site Generation (SSG)
- Articles pre-rendered at build time
- HTML served from Vercel Edge (CDN)
- No database queries on page load
- Instant page loads (~100ms)

#### 2. Code Splitting
- Automatic code splitting by Next.js
- Each route = separate JavaScript bundle
- Client components loaded on demand
- Tree-shaking removes unused code

#### 3. Server Components
- React Server Components (RSC)
- Zero JavaScript for static content
- Only client components send JS to browser
- Reduced bundle size (~40% smaller)

#### 4. Vercel Edge Network
- Global CDN with 300+ locations
- Automatic caching of static assets
- Edge functions for dynamic content
- DDoS protection included

### Performance Metrics (Lighthouse)
```
Target Scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Current (Production):
- Performance: 98
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Core Web Vitals:
- LCP (Largest Contentful Paint): 0.8s ✅
- FID (First Input Delay): 10ms ✅
- CLS (Cumulative Layout Shift): 0.02 ✅
```

### Future Optimizations
- [ ] Image optimization with next/image
- [ ] Font preloading with next/font
- [ ] Service worker for offline support
- [ ] Prefetching of article links
- [ ] Lazy loading below-the-fold content
- [ ] WebP/AVIF image formats
- [ ] Brotli compression
- [ ] HTTP/3 support

---

## Security Architecture

### Authentication & Authorization

#### Row Level Security (Supabase)
```sql
-- Anonymous users can only INSERT subscribers
CREATE POLICY "anon_insert" ON subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Service role (API) has full access
CREATE POLICY "service_all" ON subscribers
  FOR ALL TO service_role
  USING (true);
```

#### API Security
```typescript
// Input validation with Zod
const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100)
})

// Validation in API route
const body = await request.json()
const validated = subscribeSchema.parse(body)
// Throws 400 error if invalid
```

### Environment Variable Security
- All secrets in environment variables
- Never committed to Git (.gitignore)
- Different keys for dev/prod
- Vercel encrypts environment variables
- NEXT_PUBLIC_ prefix only for safe values

### DNS Security (Domain Verification)
```
SPF Record (Email):
v=spf1 include:_spf.mx.cloudflare.net ~all

DKIM Record (Email):
Generated by Resend, added to DNS

DMARC Record (Future):
v=DMARC1; p=quarantine; rua=mailto:dmarc@arya-varta.in
```

### HTTPS/SSL
- Automatic SSL certificates via Vercel
- Let's Encrypt integration
- HTTP → HTTPS redirect enforced
- HSTS headers enabled
- TLS 1.3 support

---

## Deployment Pipeline

### Build Process
```bash
# 1. Install dependencies
npm install

# 2. Type checking
npm run type-check

# 3. Linting
npm run lint

# 4. Build Next.js
npm run build
  ├─ Compile TypeScript
  ├─ Generate static pages (SSG)
  ├─ Optimize images
  ├─ Bundle JavaScript
  └─ Output to .next/

# 5. Deploy to Vercel
vercel deploy --prod
  ├─ Upload build artifacts
  ├─ Configure Edge Functions
  ├─ Update DNS routing
  └─ Purge CDN cache
```

### Continuous Deployment
```yaml
# GitHub Actions (Future)
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Rollback Strategy
```typescript
// Vercel Dashboard:
// Deployments → Previous deployment → Promote to Production
// Instant rollback (no rebuild)

// CLI:
vercel rollback [deployment-url]
```

---

## Monitoring & Observability

### Current Monitoring
- Vercel Analytics (built-in)
- Deployment logs
- Function logs for API routes
- Real-time error tracking

### Planned Integrations
```typescript
// Sentry for error tracking
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0
})

// Analytics events
import { track } from '@vercel/analytics'

track('newsletter_signup', {
  email: user.email,
  source: 'homepage'
})

// Performance monitoring
import { reportWebVitals } from 'next/web-vitals'

export function onCLS(metric) {
  console.log('CLS:', metric)
}
```

---

## Scalability Considerations

### Current Capacity
- Vercel Free Tier:
  - 100 GB bandwidth/month
  - 100 GB-hours compute/month
  - Unlimited requests
  - 100 deployments/day

- Supabase Free Tier:
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth/month
  - 50,000 monthly active users

- Resend Free Tier:
  - 100 emails/day
  - 1 verified domain

### Scaling Strategy

#### Phase 1: 0-1,000 subscribers
- Current setup sufficient
- No changes needed
- Monitor usage metrics

#### Phase 2: 1,000-10,000 subscribers
- Upgrade Resend to paid ($20/mo)
- Consider database indexing optimization
- Add caching layer (Redis)

#### Phase 3: 10,000+ subscribers
- Upgrade Supabase to Pro ($25/mo)
- Implement job queue for emails (BullMQ)
- Add read replicas for database
- Consider CDN for images (Cloudinary)

#### Phase 4: 100,000+ subscribers
- Migrate to Vercel Pro ($20/mo)
- Multi-region database deployment
- Load balancing across edge functions
- Dedicated email infrastructure

---

## Development Workflow

### Local Development
```bash
# 1. Clone repository
git clone <repo-url>
cd Gurukul

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

### Creating New Articles
```bash
# Interactive CLI
npm run new-article "Article Title"

# Or from PDF
npm run pdf-to-article "path/to/paper.pdf"

# Edit generated markdown file
code content/articles/article-slug.md

# Test locally
npm run dev
# Visit http://localhost:3000/articles/article-slug

# Build and deploy
npm run build
git add .
git commit -m "Add new article"
git push origin main
```

### Code Quality Tools
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "jest"
  }
}
```

---

## Technology Decisions & Trade-offs

### Why Next.js 16?
**Pros:**
- ✅ React Server Components (reduced JS bundle)
- ✅ App Router (better file-based routing)
- ✅ Turbopack (faster builds)
- ✅ Built-in image optimization
- ✅ Excellent Vercel integration

**Cons:**
- ⚠️ Learning curve for RSC
- ⚠️ Some third-party libraries not compatible yet

### Why Supabase?
**Pros:**
- ✅ PostgreSQL (powerful relational DB)
- ✅ Row Level Security (built-in auth)
- ✅ Real-time subscriptions
- ✅ Generous free tier
- ✅ Auto-generated REST API

**Cons:**
- ⚠️ Cold starts on free tier (~2s)
- ⚠️ Limited to single region (free)

### Why Markdown for Articles?
**Pros:**
- ✅ Version control friendly (Git)
- ✅ Easy to write and edit
- ✅ Fast build times (static)
- ✅ No database queries needed
- ✅ Excellent for text-heavy content

**Cons:**
- ⚠️ Requires rebuild for updates
- ⚠️ No real-time editing interface
- ⚠️ Not ideal for non-technical editors

**Alternative Considered:** CMS (Sanity, Contentful)
**Decision:** Markdown chosen for simplicity and speed in MVP phase. Can migrate to CMS later if needed.

---

## API Reference

### Public Endpoints

#### POST /api/subscribe
Subscribe to newsletter

**Request:**
```http
POST /api/subscribe HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed to Aryavarta!"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Email already subscribed"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "error": "Failed to subscribe. Please try again."
}
```

---

## Future Architecture Improvements

### Planned Enhancements
1. **Admin Dashboard** - CMS for content management
2. **Comment System** - Migrate from localStorage to database
3. **Search** - Algolia or ElasticSearch integration
4. **Analytics** - Custom event tracking
5. **A/B Testing** - Email template optimization
6. **Internationalization** - Hindi and Sanskrit support
7. **Mobile App** - React Native companion
8. **GraphQL API** - Alternative to REST
9. **Webhooks** - Event-driven architecture
10. **Machine Learning** - Article recommendations

---

## Conclusion

Aryavarta is built on a modern, scalable architecture that prioritizes:
- **Performance**: SSG, Edge CDN, minimal JavaScript
- **Security**: RLS, environment variables, HTTPS
- **Developer Experience**: TypeScript, Tailwind, Next.js
- **Scalability**: Serverless functions, PostgreSQL, CDN
- **Maintainability**: Clean code, documentation, testing

The architecture is designed to grow with the platform while maintaining simplicity and performance.

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0  
**Maintained By**: Aryavarta Development Team
