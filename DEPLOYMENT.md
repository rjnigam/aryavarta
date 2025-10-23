# Deployment Guide

Complete guide for deploying Aryavarta to production on Vercel with custom domain.

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Next.js project built and tested locally
- ✅ Git repository initialized
- ✅ Supabase project created and configured
- ✅ Resend account with API key
- ✅ Custom domain purchased (arya-varta.in)
- ✅ Access to domain DNS management (GoDaddy)
- ✅ Vercel account (free tier works)

---

## Part 1: Prepare Your Code

### 1. Initialize Git Repository

```bash
cd /Users/rajathnigam/Aryavarta

# Initialize Git
git init

# Configure Git identity
git config user.email "contact@arya-varta.in"
git config user.name "Aryavarta"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Aryavarta newsletter platform"
```

**Expected Output:**
```
[main (root-commit) abaebaa] Initial commit: Aryavarta newsletter platform
 40 files changed, 15833 insertions(+)
```

### 2. Verify Environment Variables

Ensure your `.env.local` contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://arya-varta.in
```

⚠️ **Important:** Never commit `.env.local` to Git! Ensure `.gitignore` includes:
```
.env*.local
.env
```

### 3. Test Local Build

```bash
# Build the project
npm run build

# Test production build locally
npm run start
```

Verify everything works at `http://localhost:3000`

---

## Part 2: Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

**Expected Output:**
```
added 38 packages in 2s
```

### 2. Deploy to Vercel

```bash
vercel --name aryavarta --yes
```

**What Happens:**
- Vercel detects Next.js project automatically
- Creates new project: `aryavarta`
- Builds and deploys to production
- Provides preview URL: `https://aryavarta-[hash].vercel.app`

**Initial Deploy May Fail** if environment variables are missing. This is expected!

### 3. Configure Environment Variables

#### Via Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: `aryavarta`
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project].supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
| `RESEND_API_KEY` | `re_xxxxx` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://arya-varta.in` | Production |

5. Click **Save** after each variable

### 4. Redeploy with Environment Variables

#### Option A: Via Dashboard
1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete (~46 seconds)

#### Option B: Via CLI
```bash
vercel --prod
```

**Successful Deployment Output:**
```
✅ Production: https://aryavarta-tau.vercel.app
```

---

## Part 3: Configure Custom Domain

### Step 1: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `arya-varta.in`
5. Click **Add**

Vercel will show you the required DNS records.

### Step 2: Configure DNS Records in GoDaddy

#### Remove Conflicting Records

Vercel will detect conflicting A records. You need to delete:

1. Log into GoDaddy
2. Go to **My Products** → **Domains**
3. Click **DNS** next to `arya-varta.in`
4. Find and **delete** these A records:
   - `216.198.79.1` (old parking page)
   - `WebsiteBuilder Site` (GoDaddy site builder)

#### Add Vercel A Record

Add a new A record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.223.105.230` | 600 seconds |

**Note:** Vercel provides new IP addresses. Use the latest from their dashboard:
- Primary: `76.223.105.230`
- Alternate: `13.248.243.5`

The old `76.76.21.21` still works but new IPs are recommended for better performance.

#### Add WWW CNAME Record

Add a CNAME record for www subdomain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `cname.vercel-dns.com` | 1 Hour |

### Step 3: Keep Email DNS Records

**Don't delete these** - they're for Resend email:

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | @ | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 |
| TXT | @ | `resend_verify_[token]` | - |

### Step 4: Save DNS Changes

1. Click **Save** in GoDaddy DNS management
2. Wait 5-15 minutes for DNS propagation

### Step 5: Verify Domain in Vercel

1. Return to Vercel dashboard → Domains
2. You should see:
   - `arya-varta.in` - Valid Configuration ✅
   - `www.arya-varta.in` - Valid Configuration ✅
3. SSL certificate automatically issued by Vercel
4. Both HTTP and HTTPS work (HTTP redirects to HTTPS)

---

## Part 4: Verify Deployment

### 1. Test Main Domain

```bash
curl -I https://arya-varta.in
```

**Expected Response:**
```
HTTP/2 200
content-type: text/html; charset=utf-8
x-vercel-cache: HIT
```

### 2. Test WWW Subdomain

```bash
curl -I https://www.arya-varta.in
```

Should also return `200 OK`

### 3. Test Newsletter Signup

1. Visit: https://arya-varta.in
2. Enter email and name in newsletter form
3. Click "Subscribe to Aryavarta"
4. Check email for welcome message from `noreply@arya-varta.in`

### 4. Test Articles

Visit each article:
- https://arya-varta.in/articles/hinduism-misinterpreted-pacifism
- https://arya-varta.in/articles/how-the-vedas-guide-response-to-aggressors
- https://arya-varta.in/articles/upanishadic-self

### 5. Verify Database

Check Supabase dashboard → Table Editor → `subscribers`:
- New subscriber should appear
- `subscribed_at` timestamp correct
- `is_active` = true

---

## Part 5: DNS Propagation

### Check DNS Status

Use online tools to verify DNS propagation:

```bash
# Check A record
dig arya-varta.in

# Expected output:
# arya-varta.in.  600  IN  A  76.223.105.230

# Check CNAME
dig www.arya-varta.in

# Expected output:
# www.arya-varta.in.  3600  IN  CNAME  cname.vercel-dns.com.
```

### Online DNS Checkers

- [DNS Checker](https://dnschecker.org) - Check global propagation
- [What's My DNS](https://whatsmydns.net) - Worldwide DNS lookup
- [DNS Propagation Checker](https://www.whatsmydns.net)

**Propagation Time:**
- Typically: 5-15 minutes
- Maximum: 24-48 hours (rare)
- Most users see changes within 10 minutes

---

## Troubleshooting

### Build Fails: "Missing Environment Variables"

**Problem:** Supabase client throws error if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing.

**Solution:**
1. Add environment variables in Vercel dashboard
2. Redeploy: Deployments → ⋯ → Redeploy

### Domain Shows "Invalid Configuration"

**Problem:** DNS records not pointing to Vercel correctly.

**Solution:**
1. Verify A record: `76.223.105.230` (not old IP)
2. Verify CNAME: `cname.vercel-dns.com`
3. Wait 10-15 minutes for propagation
4. Click **Refresh** in Vercel Domains

### SSL Certificate Not Issued

**Problem:** Vercel can't verify domain ownership.

**Solution:**
1. Ensure A record is correct
2. Wait for DNS propagation (check with `dig`)
3. Vercel auto-issues certificate once DNS verified
4. Retry: Domains → ⋯ → Retry SSL

### Email Not Sending

**Problem:** Welcome email not received.

**Solution:**
1. Check spam folder
2. Verify Resend domain status: [resend.com/domains](https://resend.com/domains)
3. Check MX and TXT records in GoDaddy
4. Test email API in Resend dashboard
5. Check Vercel logs: Deployments → View Function Logs

### "Too Many Redirects" Error

**Problem:** Redirect loop between www and non-www.

**Solution:**
1. Check Vercel domain settings
2. Ensure both domains added: `arya-varta.in` and `www.arya-varta.in`
3. Vercel handles redirects automatically
4. Clear browser cache

### 404 on Articles

**Problem:** Articles return 404 error.

**Solution:**
1. Verify markdown files exist: `content/articles/[slug].md`
2. Check frontmatter format (YAML)
3. Rebuild: `npm run build` locally to test
4. Redeploy to Vercel

---

## Continuous Deployment

### Automatic Deployments

Once configured, Vercel automatically deploys when you push to Git:

```bash
# Make changes to code
git add .
git commit -m "Update: Added new article"
git push origin main
```

Vercel detects the push and:
1. Pulls latest code
2. Runs `npm run build`
3. Deploys to production
4. Updates `arya-varta.in` automatically
5. Preserves environment variables

### Preview Deployments

Create preview deployments for branches:

```bash
git checkout -b feature/new-design
# Make changes
git push origin feature/new-design
```

Vercel creates preview URL: `https://aryavarta-[branch]-[hash].vercel.app`

### Rollback

If deployment fails or has issues:

1. Go to Vercel dashboard → **Deployments**
2. Find previous successful deployment
3. Click **⋯** → **Promote to Production**
4. Instant rollback (no rebuild needed)

---

## Post-Deployment Checklist

After successful deployment:

- [ ] ✅ Main domain works: https://arya-varta.in
- [ ] ✅ WWW subdomain works: https://www.arya-varta.in
- [ ] ✅ SSL certificate active (HTTPS)
- [ ] ✅ Newsletter signup functional
- [ ] ✅ Welcome email received
- [ ] ✅ All 3 articles accessible
- [ ] ✅ Images loading correctly
- [ ] ✅ Citations/footnotes working
- [ ] ✅ Comment section visible
- [ ] ✅ Mobile responsive design
- [ ] ✅ Article carousel auto-scrolling
- [ ] ✅ Database storing subscribers
- [ ] ✅ Email domain verified (Resend)
- [ ] ✅ Vercel analytics active
- [ ] ✅ Build time < 60 seconds
- [ ] ✅ Lighthouse score > 90

---

## Monitoring & Maintenance

### Vercel Dashboard

Monitor your deployment:

- **Analytics**: View page views and performance
- **Logs**: Check function logs for errors
- **Usage**: Monitor bandwidth and function invocations
- **Speed Insights**: Track Core Web Vitals

### Supabase Dashboard

Monitor database:

- **Table Editor**: View subscribers
- **SQL Editor**: Run queries
- **API Logs**: Check request logs
- **Database Health**: Monitor performance

### Resend Dashboard

Monitor emails:

- **Emails**: View sent emails and status
- **Domain Status**: Check verification
- **API Keys**: Manage access
- **Usage**: Track email quota

---

## Performance Optimization

### Current Setup
- ✅ Static Site Generation (SSG) for articles
- ✅ Turbopack for fast builds
- ✅ Vercel Edge Network (global CDN)
- ✅ Automatic image optimization (planned)
- ✅ Code splitting via Next.js

### Future Improvements
- [ ] Image optimization with next/image
- [ ] Font optimization with next/font
- [ ] Lazy loading for below-the-fold content
- [ ] Service worker for offline support
- [ ] Cache optimization

---

## Security Checklist

After deployment:

- [ ] ✅ All environment variables secure (not in Git)
- [ ] ✅ Supabase RLS policies enabled
- [ ] ✅ API keys rotated (if exposed during testing)
- [ ] ✅ HTTPS enforced (HTTP redirects to HTTPS)
- [ ] ✅ Email domain verified (SPF, DKIM, DMARC)
- [ ] ✅ CORS configured properly
- [ ] ✅ Rate limiting (future implementation)
- [ ] ✅ Input validation on all forms
- [ ] ✅ SQL injection protection (via Supabase client)

---

## Deployment Summary

**Final URLs:**
- Production: https://arya-varta.in
- WWW: https://www.arya-varta.in
- Vercel: https://aryavarta-tau.vercel.app

**Build Info:**
- Framework: Next.js 16.0.0
- Build Time: 46 seconds
- Output: Static + Server Components
- Node Version: 18.x

**DNS Configuration:**
- Registrar: GoDaddy
- Nameservers: GoDaddy (ns53/ns54.domaincontrol.com)
- A Record: 76.223.105.230 → Vercel
- CNAME: www → cname.vercel-dns.com
- MX Record: Resend (Tokyo region)

**Services:**
- Hosting: Vercel (Free tier)
- Database: Supabase (Free tier)
- Email: Resend (Free tier)
- Domain: GoDaddy (Paid)

**Status: LIVE ✅**

---

## Next Steps

1. **Monitor Analytics**
   - Track user engagement
   - Identify popular articles
   - Monitor newsletter signups

2. **Content Strategy**
   - Publish weekly articles
   - Build email automation
   - Grow subscriber base

3. **Feature Development**
   - Implement planned roadmap
   - Gather user feedback
   - Iterate and improve

4. **Marketing**
   - Share on social media
   - SEO optimization
   - Community engagement

---

**Deployment completed successfully!** 🎉

For support, contact: [contact@arya-varta.in](mailto:contact@arya-varta.in)
