# Quick Reference Guide

Fast reference for common tasks in the Aryavarta project.

---

## 🚀 Getting Started

### First Time Setup
```bash
# Clone and install
git clone <repo-url>
cd Gurukul
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run locally
npm run dev
# Open http://localhost:3000
```

---

## 📝 Content Management

### Create New Article
```bash
# Interactive CLI
npm run new-article "Your Article Title"

# Opens editor with template
# Edit: content/articles/your-article-title.md
```

### Article Frontmatter Template
```yaml
---
title: "Article Title"
excerpt: "Brief 1-2 sentence description"
date: "2025-10-23"
author: "Author Name"
readTime: "8 min read"
image: "/images/article-slug.jpg"
tags: ["Philosophy", "Vedas"]
---
```

### Convert PDF to Article
```bash
npm run pdf-to-article "path/to/document.pdf"
# Extracts text → content/articles/
```

### Add Citations/Footnotes
```markdown
Ancient texts teach us wisdom[^1].

[^1]: Bhagavad Gita 2.47. [Source](https://example.com)
```

---

## 💻 Development

### Run Dev Server
```bash
npm run dev
# http://localhost:3000
# Hot reload enabled
```

### Build for Production
```bash
npm run build
# Check .next/ folder
# Test: npm run start
```

### Type Check
```bash
npm run type-check
# TypeScript validation
```

### Lint Code
```bash
npm run lint
# ESLint checks
```

### Clear Cache
```bash
rm -rf .next
# Then restart dev server
```

---

## 🗄️ Database

### View Subscribers
```sql
-- Supabase SQL Editor
SELECT * FROM subscribers 
ORDER BY subscribed_at DESC 
LIMIT 10;
```

### Count Subscribers
```sql
SELECT COUNT(*) as total 
FROM subscribers 
WHERE is_active = true;
```

### Find Subscriber by Email
```sql
SELECT * FROM subscribers 
WHERE email = 'user@example.com';
```

### Deactivate Subscriber
```sql
UPDATE subscribers 
SET is_active = false 
WHERE email = 'user@example.com';
```

### Reset Database (Dev Only!)
```sql
-- WARNING: Deletes all data!
DELETE FROM subscribers;
```

---

## 📧 Email

### Test Welcome Email Locally
```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:3000
# 3. Submit newsletter form
# 4. Check Resend dashboard for email log
```

### Resend Dashboard URLs
- Emails: https://resend.com/emails
- Domains: https://resend.com/domains
- API Keys: https://resend.com/api-keys
- Logs: https://resend.com/logs

### Check Email Delivery Status
```bash
# Resend Dashboard → Emails
# Find email by recipient
# Check status: delivered, bounced, etc.
```

---

## 🌐 Deployment

### Deploy to Vercel
```bash
# First time
vercel --name aryavarta --yes

# Subsequent deploys
git add .
git commit -m "Your changes"
git push origin main
# Auto-deploys via Vercel
```

### Manual Deploy
```bash
vercel --prod
```

### Rollback Deployment
```bash
# Via Dashboard:
# Vercel → Deployments → Previous → Promote

# Via CLI:
vercel rollback <deployment-url>
```

### Check Deployment Status
```bash
# View in browser:
# https://vercel.com/<username>/aryavarta
```

---

## 🔐 Environment Variables

### Local (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel Dashboard)
1. Vercel → Project → Settings
2. Environment Variables
3. Add each variable
4. Select: Production, Preview, Development
5. Save

### Verify Variables Loaded
```bash
# In any component/API route:
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
# Should print URL, not undefined
```

---

## 🔍 Debugging

### Check Build Errors
```bash
npm run build
# Read error messages carefully
# Check file paths and syntax
```

### Check Runtime Errors
```bash
# Dev server logs
npm run dev
# Watch terminal for errors
```

### Vercel Function Logs
```bash
# Vercel Dashboard:
# Deployments → Latest → Functions
# Click function → View logs
```

### Database Connection Test
```typescript
// Quick test in any API route
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('subscribers')
  .select('count')
  
console.log('DB Test:', data, error)
```

### Email Send Test
```typescript
// Quick test in API route
const { data, error } = await resend.emails.send({
  from: 'test@arya-varta.in',
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<p>Testing Resend integration</p>'
})

console.log('Email Test:', data, error)
```

---

## 🎨 Styling

### Tailwind Color Classes
```html
<!-- Saffron (Primary) -->
<div class="bg-saffron-500 text-white">

<!-- Vermillion (Accent) -->
<div class="bg-vermillion-500">

<!-- Sandalwood (Neutral) -->
<div class="bg-sandalwood-100 text-sandalwood-900">

<!-- Sacred (Deep) -->
<div class="border-2 border-sacred-600">
```

### Dharmic Components
```html
<!-- Button -->
<button class="btn-primary">Subscribe</button>

<!-- Card -->
<div class="card-dharmic">Content</div>

<!-- Gradient Background -->
<div class="bg-gradient-to-r from-saffron-500 to-vermillion-500">
```

### Typography
```html
<!-- Serif (Headings) -->
<h1 class="font-serif">Title</h1>

<!-- Sans (Body) -->
<p class="font-sans">Body text</p>

<!-- Devanagari -->
<span class="font-devanagari">आर्यावर्त</span>
```

---

## 📊 Analytics

### Vercel Analytics
```bash
# View in dashboard:
# https://vercel.com/<username>/aryavarta/analytics
```

### Lighthouse Report
```bash
# Chrome DevTools:
# F12 → Lighthouse → Generate Report
# Target: 90+ on all metrics
```

### Check Core Web Vitals
```bash
# PageSpeed Insights:
# https://pagespeed.web.dev/
# Enter: https://arya-varta.in
```

---

## 🐛 Common Issues & Fixes

### Issue: "Missing environment variables"
```bash
# Fix:
# 1. Check .env.local exists
# 2. Restart dev server
# 3. Verify variable names (exact match)
```

### Issue: "Module not found"
```bash
# Fix:
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Articles not showing"
```bash
# Check:
# 1. Markdown file in content/articles/
# 2. Valid frontmatter (YAML syntax)
# 3. Rebuild: npm run build
```

### Issue: "Newsletter not sending"
```bash
# Check:
# 1. Resend API key correct
# 2. Domain verified (production)
# 3. Check Resend logs
# 4. Verify email format valid
```

### Issue: "Database connection failed"
```bash
# Check:
# 1. Supabase URL correct
# 2. Anon key correct
# 3. Supabase project not paused
# 4. Network connection
```

### Issue: "Build failed on Vercel"
```bash
# Common causes:
# 1. Missing env variables → Add in Vercel
# 2. TypeScript errors → Fix locally first
# 3. Import errors → Check file paths
```

### Issue: "CSS not updating"
```bash
# Fix:
rm -rf .next
npm run dev
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## 📦 Package Management

### Add New Package
```bash
npm install package-name
# Dev dependency:
npm install -D package-name
```

### Update Packages
```bash
# Check outdated
npm outdated

# Update specific package
npm update package-name

# Update all (careful!)
npm update
```

### Remove Package
```bash
npm uninstall package-name
```

---

## 🔗 Useful URLs

### Development
- Local: http://localhost:3000
- Local Articles: http://localhost:3000/articles

### Production
- Main Site: https://arya-varta.in
- WWW: https://www.arya-varta.in
- Vercel: https://aryavarta-tau.vercel.app

### Dashboards
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Resend: https://resend.com/emails
- GoDaddy DNS: https://dcc.godaddy.com/domains

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Resend: https://resend.com/docs

---

## 🔐 Security Checklist

### Before Committing Code
- [ ] No API keys in code
- [ ] .env.local not committed
- [ ] Sensitive data removed from logs
- [ ] No console.log with user data

### Before Deploying
- [ ] All env vars set in Vercel
- [ ] Database RLS policies enabled
- [ ] API endpoints validated
- [ ] Error messages don't expose internals

### Regular Maintenance
- [ ] Rotate API keys every 90 days
- [ ] Check Supabase logs for unusual activity
- [ ] Monitor Vercel usage/bandwidth
- [ ] Review subscriber list for spam

---

## 📈 Performance Tips

### Image Optimization
```jsx
// Use Next.js Image component (future)
import Image from 'next/image'

<Image 
  src="/images/article.jpg" 
  alt="Article" 
  width={800} 
  height={400}
  priority={false}
/>
```

### Lazy Loading
```jsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

### Font Optimization
```tsx
// Already implemented in layout.tsx
import { Crimson_Text, Inter } from 'next/font/google'
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] All 3 articles accessible
- [ ] Newsletter signup works
- [ ] Email received (check spam)
- [ ] Carousel auto-scrolls
- [ ] Comments can be added
- [ ] Mobile responsive
- [ ] Citations open in new tab

### Browser Testing
```bash
# Test in multiple browsers:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)
```

### Accessibility Testing
```bash
# Chrome DevTools → Lighthouse → Accessibility
# Should score 100

# Keyboard navigation:
# Tab through all interactive elements
# Enter/Space to activate buttons
```

---

## 📞 Support Resources

### Getting Help
1. **Check documentation**:
   - README.md - Overview
   - ARCHITECTURE.md - Technical details
   - DEPLOYMENT.md - Deploy guide
   - ENV_SETUP.md - Environment setup

2. **Search errors**: Copy error message → Google
3. **Community**: Next.js Discord, Stack Overflow
4. **Contact**: contact@arya-varta.in

### Useful Commands
```bash
# Show Next.js version
npm list next

# Show all dependencies
npm list

# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force
```

---

## 💡 Pro Tips

### Faster Development
```bash
# Use Turbopack (already enabled)
npm run dev --turbo

# Open editor and browser together
code . && open http://localhost:3000
```

### Quick Article Preview
```bash
# Edit article in VSCode
# Save (Cmd+S)
# Browser auto-refreshes
# No manual build needed!
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-article
# Make changes
git add .
git commit -m "Add new article"
git push origin feature/new-article
# Create PR on GitHub
```

### Environment Switching
```bash
# Development
npm run dev

# Production test locally
npm run build && npm run start

# Deploy to Vercel preview
vercel
```

---

## 📋 Daily Workflow

### Morning Routine
```bash
# 1. Check for updates
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Check Vercel/Supabase dashboards for issues
```

### Before Ending Day
```bash
# 1. Commit changes
git add .
git commit -m "Description of work"

# 2. Push to GitHub
git push origin main

# 3. Verify deployment succeeded on Vercel

# 4. Check subscriber count in Supabase
```

---

## 🎯 Quick Commands Summary

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Content
npm run new-article      # Create article
npm run pdf-to-article   # Convert PDF

# Quality
npm run lint             # Check code quality
npm run type-check       # TypeScript validation

# Deployment
vercel --prod            # Deploy to production
vercel rollback          # Rollback deployment

# Database
# Use Supabase Dashboard SQL Editor

# Cleaning
rm -rf .next             # Clear build cache
rm -rf node_modules      # Clear packages
npm install              # Reinstall packages
```

---

## 🚨 Emergency Procedures

### Site Down
```bash
# 1. Check Vercel status
# https://www.vercel-status.com

# 2. Check deployment logs
# Vercel Dashboard → Latest Deployment → Logs

# 3. Rollback if needed
# Vercel Dashboard → Deployments → Previous → Promote
```

### Database Issues
```bash
# 1. Check Supabase status
# https://status.supabase.com

# 2. Verify credentials
# Supabase Dashboard → Settings → API

# 3. Test connection
# Use SQL Editor with simple query
```

### Email Not Sending
```bash
# 1. Check Resend status
# https://resend.com/status

# 2. Verify domain
# Resend Dashboard → Domains

# 3. Check API key
# Resend Dashboard → API Keys → Test
```

---

**Keep this guide bookmarked for quick reference!** 📌

For detailed explanations, see:
- README.md
- ARCHITECTURE.md
- DEPLOYMENT.md
- ENV_SETUP.md
