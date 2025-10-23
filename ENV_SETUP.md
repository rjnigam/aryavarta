# Environment Variables Guide

Complete reference for all environment variables used in the Aryavarta project.

---

## Overview

Aryavarta uses environment variables to store sensitive configuration data like API keys, database credentials, and site settings. These are **never committed to Git** for security reasons.

---

## Required Variables

### 1. Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Purpose**: URL to your Supabase project
- **Type**: Public (client-side accessible)
- **Format**: `https://[project-id].supabase.co`
- **Where to Find**:
  1. Go to [app.supabase.com](https://app.supabase.com)
  2. Select your project
  3. Settings → API → Project URL

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcdef123.supabase.co
```

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose**: Public anonymous key for client-side Supabase access
- **Type**: Public (client-side accessible, safe to expose)
- **Format**: Long JWT token starting with `eyJ...`
- **Where to Find**:
  1. Supabase Dashboard → Settings → API
  2. Copy **anon / public** key (not the service_role key!)

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZjEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...
```

⚠️ **Security Note**: The anon key is safe to expose in client-side code. Row Level Security (RLS) policies protect your data.

---

### 2. Resend Email Configuration

#### `RESEND_API_KEY`
- **Purpose**: API key for sending emails via Resend
- **Type**: Secret (server-side only)
- **Format**: Starts with `re_`
- **Where to Find**:
  1. Go to [resend.com/api-keys](https://resend.com/api-keys)
  2. Create new API key or copy existing
  3. **Important**: Copy immediately, can't view again!

**Example:**
```bash
RESEND_API_KEY=re_A1b2C3d4_X9Y8Z7W6V5U4T3S2R1Q0P9O8N7M6L5K
```

⚠️ **Security Warning**: Keep this secret! Never commit to Git or expose in client code.

---

### 3. Site Configuration

#### `NEXT_PUBLIC_SITE_URL`
- **Purpose**: Base URL of your deployed site
- **Type**: Public (used for generating links)
- **Format**: Full HTTPS URL without trailing slash
- **Environment Specific**:
  - Development: `http://localhost:3000`
  - Production: `https://arya-varta.in`

**Example:**
```bash
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://arya-varta.in
```

---

## Environment Files

### Local Development: `.env.local`

Create this file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Resend Email
RESEND_API_KEY=re_your_resend_key_here

# Site URL (local)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Never commit this file!** Ensure `.gitignore` includes:
```
.env*.local
.env
```

### Production: Vercel Environment Variables

Set via Vercel Dashboard:

1. Go to your project on Vercel
2. **Settings** → **Environment Variables**
3. Add each variable with these settings:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ Production ✅ Preview ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | ✅ Production ✅ Preview ✅ Development |
| `RESEND_API_KEY` | `re_xxx` | ✅ Production ✅ Preview ✅ Development |
| `NEXT_PUBLIC_SITE_URL` | `https://arya-varta.in` | ✅ Production only |

---

## Variable Naming Convention

### Public vs Private

**Public variables** (prefixed with `NEXT_PUBLIC_`):
- ✅ Accessible in browser JavaScript
- ✅ Bundled in client-side code
- ✅ Safe to expose (like URLs, public keys)
- ❌ Don't use for secrets!

**Private variables** (no prefix):
- ✅ Only available on server-side
- ✅ Not included in browser bundle
- ✅ Use for API keys, secrets
- ❌ Can't access in client components

### Examples

```typescript
// ✅ CORRECT: Public variable in client component
'use client'
export default function Component() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL // Works!
}

// ❌ WRONG: Private variable in client component
'use client'
export default function Component() {
  const key = process.env.RESEND_API_KEY // undefined!
}

// ✅ CORRECT: Private variable in API route
export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY // Works!
}
```

---

## How to Use Environment Variables

### In Code

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### In API Routes

```typescript
// app/api/subscribe/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  // Use resend to send emails
}
```

### Type Safety

Create a types file for type-safe access:

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    RESEND_API_KEY: string
    NEXT_PUBLIC_SITE_URL: string
  }
}
```

---

## Security Best Practices

### ✅ DO:
- Use `.env.local` for local development
- Add `.env*.local` to `.gitignore`
- Use Vercel dashboard for production secrets
- Rotate keys if accidentally exposed
- Use different keys for dev/staging/prod
- Validate environment variables on app startup
- Use `NEXT_PUBLIC_` prefix only for truly public data

### ❌ DON'T:
- Commit `.env.local` to Git
- Hardcode API keys in source code
- Use production keys in development
- Share API keys via email/Slack
- Use `NEXT_PUBLIC_` for secrets
- Expose service role keys (use anon key)
- Store passwords in environment variables

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Cause**: Environment variables not set or misspelled.

**Solution:**
```bash
# Check local .env.local file exists
ls -la .env.local

# Verify contents
cat .env.local

# Ensure no typos in variable names
# Must be EXACT: NEXT_PUBLIC_SUPABASE_URL (not NEXT_PUBLIC_SUPABASE_URl)
```

### Error: "process.env.RESEND_API_KEY is undefined"

**Cause**: Trying to access server-only variable in client component.

**Solution:**
```typescript
// ❌ Wrong - client component
'use client'
const key = process.env.RESEND_API_KEY // undefined

// ✅ Right - API route (server-side)
export async function POST() {
  const key = process.env.RESEND_API_KEY // works
}
```

### Vercel Build Fails

**Cause**: Environment variables not set in Vercel dashboard.

**Solution:**
1. Go to Vercel project → Settings → Environment Variables
2. Add all required variables
3. Redeploy: Deployments → ⋯ → Redeploy

### Variable Changes Not Reflected

**Cause**: Next.js caches environment variables.

**Solution:**
```bash
# Stop dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

For Vercel:
1. Update environment variable in dashboard
2. Redeploy (doesn't require rebuild)

---

## Environment Variable Checklist

Before deployment:

- [ ] ✅ `.env.local` created locally
- [ ] ✅ All 4 required variables set
- [ ] ✅ `.env.local` in `.gitignore`
- [ ] ✅ Vercel environment variables configured
- [ ] ✅ Variables set for Production, Preview, Development
- [ ] ✅ Supabase URL and anon key correct
- [ ] ✅ Resend API key valid
- [ ] ✅ Site URL matches production domain
- [ ] ✅ No hardcoded secrets in code
- [ ] ✅ Environment variables validated on app startup

---

## Getting Your Credentials

### Supabase Credentials

1. **Create Project**:
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Choose organization, name, region (Tokyo for Asia)
   - Set database password (save this!)

2. **Get API Credentials**:
   - Project Dashboard → Settings → API
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ⚠️ Do NOT use service_role key on client side!

3. **Create Subscribers Table**:
   - SQL Editor → New Query
   - Run the SQL from `DEPLOYMENT.md`
   - Enable Row Level Security

### Resend API Key

1. **Create Account**:
   - Go to [resend.com](https://resend.com)
   - Sign up (free tier: 100 emails/day)

2. **Get API Key**:
   - Dashboard → API Keys
   - Click "Create API Key"
   - Name: "Aryavarta Production"
   - Permissions: Full Access (or Send emails only)
   - Copy key immediately (shown once!)

3. **Verify Domain** (optional for testing):
   - Dashboard → Domains
   - Add domain: `arya-varta.in`
   - Region: Tokyo (ap-northeast-1)
   - Add DNS records to GoDaddy
   - Wait for verification

---

## Example .env.local

Complete example file:

```bash
# ==========================================
# Aryavarta Environment Variables
# ==========================================
# NEVER commit this file to Git!
# ==========================================

# ------------------------------------------
# Supabase Database
# ------------------------------------------
# Project URL from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcdef123.supabase.co

# Anon (public) key from Supabase Dashboard → Settings → API
# This is safe to use in browser - protected by RLS policies
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZjEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk1MDAwMDAwLCJleHAiOjIwMTA1NzYwMDB9.abcdefghijklmnopqrstuvwxyz1234567890

# ------------------------------------------
# Resend Email Service
# ------------------------------------------
# API key from Resend Dashboard → API Keys
# KEEP THIS SECRET - server-side only!
RESEND_API_KEY=re_A1b2C3d4_X9Y8Z7W6V5U4T3S2R1Q0P9O8N7M6L5K

# ------------------------------------------
# Site Configuration
# ------------------------------------------
# Base URL of your site
# Development: http://localhost:3000
# Production: https://arya-varta.in
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ------------------------------------------
# Optional: Additional Configuration
# ------------------------------------------
# NODE_ENV=development
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Backup & Recovery

### Save Your Credentials Securely

1. **Use Password Manager**:
   - Store in 1Password, LastPass, Bitwarden
   - Create secure note: "Aryavarta Environment Variables"
   - Include all 4 variables

2. **Team Access**:
   - Share via password manager (not email!)
   - Use Vercel team features
   - Limit access to production keys

3. **Key Rotation Schedule**:
   - Rotate every 90 days
   - Immediately if exposed
   - Update in Vercel + local `.env.local`

---

## Additional Resources

- [Next.js Environment Variables Docs](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API Keys Docs](https://supabase.com/docs/guides/api/api-keys)
- [Resend API Documentation](https://resend.com/docs)

---

**Remember**: Environment variables are your first line of defense against security breaches. Treat them like passwords! 🔐
