# Changelog

All notable changes to the Aryavarta project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-23

## [1.1.0] - 2025-10-23

### Added
- **Auto-moderation for comments (Phase 5B)**
  - Automatic hiding driven by dislike thresholds, banned phrases, and link spam heuristics
  - `comment_flags` audit table records every moderation event with structured metadata
  - API responses now surface moderation state so the UI stays in sync instantly

### Changed
- Comment submission endpoint logs moderation flags and can return "pending review" when auto-hidden
- Reaction endpoint recalculates hide/unhide state after each interaction and returns updated counts

### UI
- Hidden comments display a review notice instead of raw text and disable reaction / reply actions until restored

### Documentation & Tooling
- Added `/docs/PHASE5B-AUTO-MODERATION.sql` and `/docs/PHASE5B-AUTO-MODERATION.md`
- New `deploy-phase5b.sh` script guides the rollout checklist

### 🎉 Initial Public Release

**Aryavarta newsletter platform goes live at arya-varta.in**

### Added
- **Homepage with Mission Statement**
  - Hero section: "Ancient Philosophy for Modern Minds"
  - Mission explanation: Filling the spiritual gap with philosophy
  - Why Aryavarta section: Pure Philosophy, Spiritual Healing, Beyond Division
  - Etymology: आर्यावर्त (Āryāvarta) - Land of the Noble People
  - Sanskrit quote with Devanagari script
  - Statistics section: 5000+ Years, Sanatan, Weekly
  - Newsletter CTA with form integration

- **Article Management System**
  - Dynamic routing with Next.js App Router: `/articles/[slug]`
  - Markdown articles with YAML frontmatter
  - Static site generation (SSG) for optimal performance
  - Article metadata: title, excerpt, date, author, readTime, image, tags
  - Academic citation support with remark-gfm
  - Footnotes with external link opening
  - Reading time calculation
  - Related articles suggestion

- **Article Carousel**
  - Auto-scrolling every 5 seconds
  - Pause on hover interaction
  - Manual navigation with arrow buttons
  - Gradient backgrounds with dharmic colors
  - Responsive layout for mobile/tablet/desktop
  - Smooth animations and transitions

- **Newsletter Subscription System**
  - Email signup form with validation (React Hook Form + Zod)
  - Supabase PostgreSQL database integration
  - Duplicate email detection
  - Name and email collection
  - Success/error state handling
  - Reusable NewsletterSignup component (light/dark variants)

- **Email Integration via Resend**
  - Domain verification: arya-varta.in ✅
  - Verified sender: `noreply@arya-varta.in`
  - Welcome email automation
  - Dharmic HTML email template
  - Sanskrit quotes in emails
  - Mission statement and article links
  - Unsubscribe footer

- **Comment Section**
  - Client-side comment system (localStorage)
  - Name and comment input fields
  - Timestamp tracking
  - Dharmic styling with saffron accents
  - Note: Database integration planned for future

- **Custom Dharmic Design System**
  - Tailwind CSS with custom color palettes:
    * Saffron (primary): 9 shades from #fff9f0 to #7a3100
    * Vermillion (accent): 9 shades from #fff5f0 to #731a00
    * Sandalwood (neutral): 9 shades from #faf8f5 to #352a17
    * Sacred (spiritual): 9 shades from #fef9f3 to #702f10
  - Mandala SVG background patterns
  - Devanagari script integration (Noto Sans Devanagari)
  - Google Fonts: Crimson Text (serif), Inter (sans-serif)
  - Responsive grid layouts
  - Mobile-first design approach

- **Content Management Tools**
  - CLI tool for creating new articles: `npm run new-article`
  - PDF-to-markdown converter: `npm run pdf-to-article`
  - Automated frontmatter generation
  - Text extraction from research papers

- **Initial Content**
  - 3 high-quality philosophical articles:
    1. **Hinduism Misinterpreted Pacifism** (404 lines, 40+ citations)
    2. **How the Vedas Guide Response to Aggressors** (Vedic wisdom)
    3. **The Upanishadic Self** (Self-knowledge teachings)
  - All articles with academic citations
  - External source links to scholarly resources

- **Database Schema**
  - Supabase `subscribers` table:
    * id (UUID, primary key)
    * email (TEXT, unique)
    * name (TEXT)
    * subscribed_at (TIMESTAMPTZ)
    * is_active (BOOLEAN)
  - Row Level Security (RLS) policies:
    * Anonymous role: INSERT only
    * Service role: Full access

- **Deployment & Infrastructure**
  - Vercel hosting with automatic HTTPS
  - Custom domain: arya-varta.in (verified ✅)
  - DNS configuration via GoDaddy
  - Environment variables management
  - Git repository initialization
  - Continuous deployment from main branch

- **Performance Optimizations**
  - Static Site Generation (SSG) for articles
  - Turbopack for fast development builds
  - Image optimization (planned)
  - Code splitting with Next.js
  - Lazy loading components

- **Developer Experience**
  - TypeScript for type safety
  - ESLint for code quality
  - Tailwind CSS IntelliSense support
  - Hot module replacement in development
  - Comprehensive error handling

### Changed
- **Rebranded from "Aryavarta" to "Aryavarta"**
  - New domain: arya-varta.in
  - Updated all branding references
  - New mission statement and messaging
  - Focus on philosophy over religion

- **Homepage Redesign**
  - Removed "Free Forever" stat (redundant)
  - Changed "सनातन" to "Sanatan" for clarity
  - Refined mission section to 3 justified paragraphs
  - Added Sanskrit etymology and meaning
  - Single newsletter CTA (removed duplicate)
  - Improved visual hierarchy

- **Newsletter Signup Button**
  - Changed from "Subscribe to Aryavarta" to "Subscribe to Aryavarta"
  - Updated success message branding

- **Email Configuration**
  - Updated from address to Aryavarta branding
  - Refined email template with clearer mission
  - Added philosophical emphasis in welcome message

### Removed
- **Deleted Articles**
  - `dharma-modern-work.md` (not aligned with mission)
  - `the-power-of-karma-yoga.md` (redundant content)
  - Kept only highest-quality, mission-aligned articles

- **Removed Duplicate Elements**
  - Duplicate newsletter signup section on homepage
  - Redundant "Free Forever" messaging

### Fixed
- **Citation Click Handling**
  - Footnote links now open in new tabs
  - External academic sources accessible
  - Proper href handling for scholarly references

- **Article Carousel Behavior**
  - Fixed auto-scroll timing conflicts
  - Improved pause-on-hover responsiveness
  - Better mobile touch interactions

- **Form Validation**
  - Proper email format validation
  - Name length requirements
  - Error message clarity
  - Success state persistence

### Security
- **Row Level Security**
  - Enabled RLS on subscribers table
  - Proper role-based access control
  - Anonymous users can only insert
  - Service role for API operations

- **Environment Variables**
  - All secrets in environment variables
  - No hardcoded API keys
  - Proper .gitignore configuration
  - Secure deployment via Vercel

- **Email Security**
  - Domain verification with SPF/DKIM
  - Verified sender address
  - Proper MX records
  - Unsubscribe mechanism

### Infrastructure
- **Git Repository**
  - Initial commit: 40 files, 15,833 insertions
  - Author: Aryavarta <contact@arya-varta.in>
  - Commit message: "Initial commit: Aryavarta newsletter platform"

- **Vercel Deployment**
  - Project name: aryavarta
  - Build time: 46 seconds
  - Production URLs:
    * https://aryavarta-tau.vercel.app
    * https://arya-varta.in (custom domain)
  - Environment variables configured
  - Automatic HTTPS/SSL

- **DNS Configuration**
  - A record: 76.223.105.230 (Vercel)
  - CNAME: www → cname.vercel-dns.com
  - MX record: Resend email (Tokyo region)
  - TXT record: Domain verification
  - All records verified ✅

### Technical Stack
- Next.js 16.0.0 (App Router, Turbopack)
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.15
- Supabase (PostgreSQL)
- Resend (Email API)
- Vercel (Hosting)
- gray-matter 4.0.3 (Frontmatter parsing)
- react-markdown 10.1.0 (Markdown rendering)
- remark-gfm 4.0.1 (Footnotes support)
- react-hook-form 7.54.2 (Form management)
- zod 3.24.1 (Schema validation)
- lucide-react 0.468.0 (Icons)

---

## [0.5.0] - 2025-10-22

### Added
- PDF extraction tool for research papers
- Comment section component (client-side)
- Article carousel with auto-scroll
- Citation system with footnotes

### Changed
- Major design overhaul with dharmic theme
- Custom color palette implementation
- Typography update to Crimson Text + Inter

---

## [0.3.0] - 2025-10-21

### Added
- Supabase database integration
- Newsletter signup API endpoint
- Welcome email automation via Resend

---

## [0.2.0] - 2025-10-20

### Added
- Article markdown system with frontmatter
- Dynamic routing for articles
- CLI tool for creating articles

---

## [0.1.0] - 2025-10-19

### Added
- Initial Next.js project setup
- Homepage with mission statement
- Basic newsletter signup form
- Tailwind CSS configuration

---

## Upcoming Changes (Roadmap)

### [1.1.0] - Planned
- Newsletter automation with Vercel Cron
- Comment database integration
- Search functionality
- Admin dashboard (basic)

### [1.2.0] - Planned
- Social sharing buttons
- Reading progress tracking
- User profiles and preferences
- Analytics dashboard

### [2.0.0] - Future
- Mobile app (React Native/Flutter)
- Multilingual support (Hindi, Sanskrit)
- Audio articles
- Discussion forums
- API for content access

---

For the complete project history, see the Git commit log:
```bash
git log --oneline --graph --all
```
