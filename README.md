# Aryavarta (आर्यावर्त)

**Ancient Philosophy for Modern Minds**

A weekly newsletter platform dedicated to sharing timeless wisdom from ancient Indian scriptures, offering spiritual and philosophical guidance without religious dogma.

🌐 **Live Site**: [arya-varta.in](https://arya-varta.in)

---

## 📖 Mission

Aryavarta addresses the spiritual gap in modern society by providing philosophical answers from ancient Indian scriptures. In an age of unprecedented comfort yet persistent emptiness, we lack happiness and simplicity. The platform transcends religious boundaries, focusing on universal wisdom, critical thinking, and spiritual healing.

### Etymology
**आर्यावर्त • Āryāvarta • Land of the Noble People**
> "आर्याणां वर्ते देशः आर्यावर्तः" — The land where noble souls dwell

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.0.0** - React framework with App Router and Turbopack
- **React 19.0.0** - UI library with concurrent features
- **Tailwind CSS 3.4.15** - Utility-first CSS with custom dharmic theme
- **TypeScript** - Type-safe development

### Backend & Services
- **Supabase** - PostgreSQL database for subscriber management
- **Resend** - Transactional email service with verified domain (arya-varta.in)
- **Vercel** - Hosting and deployment platform

### Content & Markdown
- **gray-matter 4.0.3** - YAML frontmatter parsing
- **react-markdown 10.1.0** - Markdown rendering
- **remark-gfm 4.0.1** - GitHub Flavored Markdown (footnotes support)

### Forms & Validation
- **react-hook-form 7.54.2** - Form state management
- **zod 3.24.1** - Schema validation
- **@hookform/resolvers** - Validation integration

### UI Components & Icons
- **lucide-react 0.468.0** - Modern icon library

---

## 🎨 Design System

### Custom Color Palette

#### Saffron (Primary)
```
50:  #fff9f0    500: #ff8c1a (Primary)    900: #7a3100
100: #fff1db    600: #f07000
200: #ffe2b8    700: #cc5500
300: #ffcb85    800: #a34200
400: #ffaa47
```

#### Vermillion (Accent)
```
50:  #fff5f0    500: #ff4d1a (Accent)     900: #731a00
100: #ffe9db    600: #e63900
200: #ffd1b8    700: #c22d00
300: #ffb085    800: #992300
400: #ff7d47
```

#### Sandalwood (Neutral Warm)
```
50:  #faf8f5    500: #9d7f52             900: #352a17
100: #f5f1ea    600: #826739
200: #e8dfd0    700: #66502c
300: #d4c4a8    800: #4d3c21
400: #b8a07a
```

#### Sacred (Deep Spiritual)
```
50:  #fef9f3    500: #e87f26             900: #702f10
100: #fdf2e6    600: #d15f0f
200: #fae1c7    700: #ad480c
300: #f5c898    800: #8b3910
400: #efa458
```

### Typography
- **Headings**: Crimson Text (serif) - 400, 600, 700 weights with italics
- **Body**: Inter (sans-serif) - Modern, readable

### Visual Elements
- Mandala pattern SVG backgrounds
- Devanagari script integration (Noto Sans Devanagari)
- Gradient overlays with dharmic colors
- Responsive design with mobile-first approach

---

## � Project Structure

```
Aryavarta/
├── app/
│   ├── page.tsx                    # Homepage with mission & articles
│   ├── layout.tsx                  # Root layout with fonts & metadata
│   ├── globals.css                 # Global styles & Tailwind config
│   ├── articles/
│   │   ├── page.tsx                # Articles listing page
│   │   └── [slug]/
│   │       └── page.tsx            # Dynamic article pages (SSG)
│   └── api/
│       └── subscribe/
│           └── route.ts            # Newsletter signup API
├── components/
│   ├── NewsletterSignup.tsx        # Newsletter form component
│   ├── ArticleCard.tsx             # Article preview card
│   ├── CommentSection.tsx          # Article comments (client-side)
│   └── ArticleCarousel.tsx         # Auto-scrolling carousel
├── content/
│   └── articles/                   # Markdown articles
│       ├── hinduism-misinterpreted-pacifism.md
│       ├── how-the-vedas-guide-response-to-aggressors.md
│       └── upanishadic-self.md
├── lib/
│   ├── articles.ts                 # Article loading utilities
│   └── supabase.ts                 # Supabase client setup
├── public/
│   └── images/                     # Article images & assets
├── scripts/
│   ├── new-article.js              # CLI for creating articles
│   └── extract-pdf-text.js         # PDF to markdown converter
├── tailwind.config.ts              # Tailwind customization
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

---

## 🎯 Key Features

### 1. Newsletter Subscription
- Form with email & name validation
- Supabase database storage
- Automated welcome email via Resend
- Duplicate email detection
- Error handling & success states

### 2. Article Management
- Static generation for optimal performance
- Markdown with YAML frontmatter
- Image optimization
- Reading time calculation
- Tag-based categorization
- Thoroughly researched with scholarly citations

### 3. Article Carousel
- Auto-scrolling every 5 seconds
- Pause on hover
- Manual navigation with arrow buttons
- Responsive design
- Smooth animations with dharmic gradients

### 4. Comment Section
- Client-side comment storage (localStorage)
- Name & message input with timestamps
- Dharmic styling with saffron accents
- Future: Database integration planned

### 5. Citation System
- Footnote support via remark-gfm
- Click to open external academic sources
- Proper academic reference formatting
- New tab opening for external links

### 6. Responsive Design
- Mobile-first approach
- Tablet & desktop optimized
- Touch-friendly interactions
- Accessible navigation with ARIA labels

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account (free tier works)
- Resend account (free tier works)
- Vercel account for deployment (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aryavarta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- Create subscribers table
   CREATE TABLE subscribers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     subscribed_at TIMESTAMPTZ DEFAULT NOW(),
     is_active BOOLEAN DEFAULT TRUE
   );

   -- Enable Row Level Security
   ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous inserts (for public signup)
   CREATE POLICY "Enable insert for anon" ON subscribers
     FOR INSERT TO anon
     WITH CHECK (true);

   -- Allow service role full access (for API)
   CREATE POLICY "Enable all for service role" ON subscribers
     FOR ALL TO service_role
     USING (true);
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Custom Scripts
npm run new-article      # Create new article (interactive CLI)
npm run pdf-to-article   # Convert PDF to markdown article
```

---

## 📝 Creating Articles

### Using the CLI Tool

Create a new article with the interactive CLI:
```bash
npm run new-article "Your Article Title"
```

This generates a markdown file in `content/articles/` with pre-filled frontmatter.

### Article Format

Articles use markdown with YAML frontmatter:

```markdown
---
title: "Article Title"
excerpt: "Brief description for preview cards"
date: "2025-10-23"
author: "Author Name"
readTime: "8 min read"
image: "/images/article-image.jpg"
tags: ["Philosophy", "Vedas", "Upanishads"]
---

# Your Article Content

Markdown content with support for:
- Headings (H1-H6)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- Images: ![Alt text](/images/image.jpg)
- Footnotes for citations[^1]

[^1]: Citation text with [Source Link](https://source.com)
```

### Converting PDF to Article

Extract text from research papers:
```bash
npm run pdf-to-article "path/to/document.pdf"
```

This extracts text and creates a markdown file you can edit.

---

## 📧 Email Configuration

### Resend Setup

1. **Create Resend Account**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from dashboard

2. **Verify Domain** (for production)
   - Add domain in Resend dashboard: `arya-varta.in`
   - Choose region: Tokyo (ap-northeast-1)
   - Add DNS records to GoDaddy:
     ```
     Type    Name    Value                                      TTL
     TXT     @       resend_verify_xxxxx                        1 Hour
     MX      @       feedback-smtp.ap-northeast-1.amazonses.com 1 Hour
                     (Priority: 10)
     ```

3. **Welcome Email**
   
   Automatic email sent on subscription:
   - From: `Aryavarta <noreply@arya-varta.in>`
   - Subject: "Welcome to Aryavarta 🙏"
   - HTML template with dharmic design
   - Sanskrit quotes and mission statement
   - Links to latest articles

---

## 🗄️ Database Schema

### Supabase Tables

#### subscribers
```sql
Column          Type            Constraints
---------------------------------------------------------
id              UUID            PRIMARY KEY, DEFAULT gen_random_uuid()
email           TEXT            UNIQUE NOT NULL
name            TEXT            
subscribed_at   TIMESTAMPTZ     DEFAULT NOW()
is_active       BOOLEAN         DEFAULT TRUE
```

#### Row Level Security Policies
- **anon role**: Can INSERT (for public signup)
- **service_role**: Full access (for API operations)

---

## 🌐 Domain & Deployment

### Production Domain
- **Primary**: [arya-varta.in](https://arya-varta.in)
- **WWW**: [www.arya-varta.in](https://www.arya-varta.in)
- **Vercel**: [aryavarta-tau.vercel.app](https://aryavarta-tau.vercel.app)

### DNS Configuration (GoDaddy)

#### For Vercel Hosting
```
Type    Name    Value                       TTL
A       @       76.223.105.230              600 seconds
CNAME   www     cname.vercel-dns.com        1 Hour
```

#### For Resend Email
```
Type    Name    Value                                               TTL
TXT     @       resend_verify_xxxxx                                 1 Hour
MX      @       feedback-smtp.ap-northeast-1.amazonses.com (10)     1 Hour
```

### Vercel Deployment

1. **Initial Setup**
   ```bash
   # Initialize Git repository
   git init
   git config user.email "contact@arya-varta.in"
   git config user.name "Aryavarta"
   
   # Commit code
   git add .
   git commit -m "Initial commit: Aryavarta newsletter platform"
   
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --name aryavarta --yes
   ```

2. **Environment Variables**
   
   Add in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   RESEND_API_KEY=your_resend_key
   NEXT_PUBLIC_SITE_URL=https://arya-varta.in
   ```

3. **Custom Domain**
   - Add domain in Vercel → Domains
   - Update DNS records in GoDaddy (see above)
   - Wait 5-15 minutes for DNS propagation
   - SSL certificate auto-issued by Vercel ✅

4. **Continuous Deployment**
   - Push to main branch = automatic deployment
   - Preview deployments for pull requests
   - Instant rollback capability

### Build Configuration
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "nodeVersion": "18.x",
  "framework": "nextjs"
}
```

---

## 📊 Current Content

### Published Articles (3)

1. **Hinduism Misinterpreted Pacifism**
   - Slug: `hinduism-misinterpreted-pacifism`
   - 404 lines, extensively researched with scholarly citations
   - Topics: Non-violence, self-defense, dharmic warfare

2. **How the Vedas Guide Response to Aggressors**
   - Slug: `how-the-vedas-guide-response-to-aggressors`
   - Vedic wisdom on protection and righteous action
   - Citations from Rigveda, Atharvaveda

3. **The Upanishadic Self**
   - Slug: `upanishadic-self`
   - Self-knowledge teachings from Upanishads
   - Atman, Brahman, and consciousness

### Content Strategy
- **Frequency**: Weekly newsletter
- **Focus**: Philosophy over religious dogma
- **Sources**: Vedas, Upanishads, Bhagavad Gita, Puranas
- **Tone**: Academic yet accessible
- **Citation**: Scholarly references with external links

---

## 🔮 Roadmap & Future Features

### Phase 1: Core Enhancements (Next 3 Months)
- [ ] **Newsletter Automation** - Vercel Cron for weekly sends
- [ ] **Comment Database** - Migrate from localStorage to Supabase
- [ ] **Admin Dashboard** - Content management UI
- [ ] **Search Functionality** - Full-text article search
- [ ] **Categories & Tags** - Filterable taxonomy

### Phase 2: Engagement (3-6 Months)
- [ ] **Social Sharing** - Twitter, LinkedIn, WhatsApp
- [ ] **Reading Progress** - Save position in articles
- [ ] **Bookmarks** - Save articles for later
- [ ] **User Profiles** - Manage subscriptions & preferences
- [ ] **Discussion Forums** - Community engagement

### Phase 3: Content & Analytics (6-12 Months)
- [ ] **RSS Feed** - Syndication support
- [ ] **Analytics Dashboard** - Track engagement metrics
- [ ] **A/B Testing** - Optimize email templates
- [ ] **Multilingual** - Hindi & Sanskrit translations
- [ ] **Audio Articles** - Text-to-speech integration
- [ ] **Video Content** - YouTube integration

### Phase 4: Platform Expansion (12+ Months)
- [ ] **Mobile App** - React Native/Flutter
- [ ] **Podcast** - Audio discussions
- [ ] **Live Events** - Webinars and Q&A
- [ ] **Courses** - Structured learning paths
- [ ] **API** - Public API for content access

### Technical Improvements
- [ ] Image optimization with next/image
- [ ] Code splitting & lazy loading
- [ ] API rate limiting & security
- [ ] Performance monitoring (Lighthouse)
- [ ] Error tracking (Sentry)
- [ ] SEO optimization (sitemap, robots.txt)
- [ ] PWA support (offline reading)
- [ ] GraphQL API (optional)

---

## 🔒 Security & Best Practices

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate API keys periodically
- Keep Supabase service role key secret

### Database Security
- Row Level Security (RLS) enabled on all tables
- Proper role-based access control
- Input validation on all forms
- SQL injection protection via Supabase client

### Email Security
- SPF, DKIM, DMARC records configured
- Verified domain for sending
- Unsubscribe link in all emails
- Rate limiting on API endpoints

### API Security
- CORS configured for known domains
- Request validation with Zod schemas
- Error handling without exposing internals
- Rate limiting (future implementation)

---

## 📈 Analytics & Monitoring

### Current Setup
- Vercel Analytics (built-in)
- Deployment logs
- Real-time error tracking

### Planned Integrations
- Google Analytics 4
- Plausible Analytics (privacy-focused)
- Custom events tracking
- Email open/click rates
- A/B test results

---

## 🤝 Contributing

This is currently a personal project focused on sharing authentic Indian philosophical wisdom. 

### How to Support
- Subscribe to the newsletter at [arya-varta.in](https://arya-varta.in)
- Share articles with your network
- Provide feedback on content quality
- Suggest topics from ancient texts

### Content Contributions
If you'd like to contribute articles:
- Email: [contact@arya-varta.in](mailto:contact@arya-varta.in)
- Must be well-researched with academic citations
- Focus on philosophy and universal wisdom
- Avoid religious dogma or sectarianism

---

## 📞 Contact & Support

- **Website**: [arya-varta.in](https://arya-varta.in)
- **Email**: [contact@arya-varta.in](mailto:contact@arya-varta.in)
- **Newsletter**: [noreply@arya-varta.in](mailto:noreply@arya-varta.in)

---

## 📄 License

© 2025 Aryavarta. All rights reserved.

Content from ancient texts is in the public domain. Original commentary and modern interpretations are proprietary.

---

## 🙏 Acknowledgments

### Built with Wisdom From
- **Vedas** - The eternal knowledge (Rig, Sama, Yajur, Atharva)
- **Upanishads** - Philosophical teachings on self and reality
- **Bhagavad Gita** - Dialogue on duty, action, and devotion
- **Puranas** - Stories encoding philosophical truths
- **Ancient Rishis** - Whose timeless wisdom continues to enlighten

### Powered By
- Open source community
- Modern web technologies
- Generous free tiers from:
  - Supabase (Database)
  - Resend (Email)
  - Vercel (Hosting)

---

## 📚 Additional Resources

### Recommended Reading
- **Upanishads** (Eknath Easwaran translation)
- **Bhagavad Gita** (Multiple translations)
- **The Vedas** (Academic translations)
- **The Principal Upanishads** (S. Radhakrishnan)

### Academic Sources
- Journal of Indian Philosophy
- International Journal of Hindu Studies
- Sanskrit texts from GRETIL
- Digital Library of India

### Related Projects
- Sacred Texts Archive
- Internet Archive (Sanskrit manuscripts)
- Wikisource (Sanskrit texts)

---

**"आर्याणां वर्ते देशः आर्यावर्तः"**  
*The land where noble souls dwell*

---

Built with ❤️ to share ancient wisdom with modern minds.  
Bridging the gap between timeless philosophy and contemporary life.

🕉️ **Aryavarta** - Where knowledge meets nobility
