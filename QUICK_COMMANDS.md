# 🚀 Live Sessions - Quick Commands

## Installation
```bash
cd /Users/rajathnigam/gurukul-newsletter
npm install openai
```

## Run Database Migration
1. Go to: https://supabase.com/dashboard
2. Open SQL Editor
3. Copy contents from: `supabase/live-research-sessions-schema.sql`
4. Paste and Run

## Configure Environment
Edit `.env.local` with your keys:
- Get Perplexity key: https://www.perplexity.ai/settings/api
- Get Supabase keys: https://supabase.com/dashboard → Settings → API

## Start Dev Server
```bash
npm run dev
```

## Test URLs
- Start session: http://localhost:3000/start-session
- View session: http://localhost:3000/session/[id]

## Cost
- ~$0.05 per 30-min session
- ~$5 for 100 sessions/month

---

See LIVE_SESSIONS_SETUP.md for detailed instructions!
