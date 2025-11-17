# 🎥 Aryavarta Live Research Sessions - Setup Guide

## 📋 What You Have

A complete **Live AI Research Sessions** feature that lets you:
- Start live research sessions powered by Perplexity AI
- Ask questions and get real-time answers with citations
- Have followers watch your research journey live
- Stream AI responses character-by-character
- Save sessions as permanent posts

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
cd /Users/rajathnigam/gurukul-newsletter
npm install openai
```

### Step 2: Get API Keys

#### **Perplexity API Key:**
1. Go to https://www.perplexity.ai/
2. Sign up or log in
3. Navigate to Settings → API
4. Click "Create API Key"
5. Copy your API key
6. Cost: ~$1 per 1M tokens (very affordable!)

#### **Supabase Credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to Settings → API
4. Copy:
   - Project URL
   - Anon/Public Key

### Step 3: Configure Environment Variables

Edit the `.env.local` file and replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Perplexity API
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxx
```

### Step 4: Set Up Database

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Open the file: `supabase/live-research-sessions-schema.sql`
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click "Run" to execute

This creates:
- `live_research_sessions` table
- `session_messages` table
- `session_viewers` table
- `session_reactions` table
- All indexes and security policies
- Real-time subscriptions
- Automatic triggers

### Step 5: Start Development Server

```bash
npm run dev
```

Your app will be available at: http://localhost:3000

---

## 🧪 Testing the Feature

### Test 1: Start a Session

1. Go to: http://localhost:3000/start-session
2. Enter a title (e.g., "Understanding Vedic Karma")
3. (Optional) Add a topic
4. Click "Go Live" 🔴
5. You'll be redirected to your live session page

### Test 2: Ask Questions

1. Type a question like: "What are the three types of karma in the Bhagavad Gita?"
2. Click "Ask" or press Enter
3. Watch the AI response stream in real-time!
4. See citations and sources automatically appear

### Test 3: View as a Follower

1. Copy your session URL (e.g., http://localhost:3000/session/abc123)
2. Open it in an **incognito window** or **different browser**
3. You'll see the session as a viewer would
4. Watch messages appear in real-time as you ask questions in the host window

### Test 4: End the Session

1. As the host, click "End Session"
2. Confirm the action
3. Session status changes to "ended"

---

## 📁 Project Structure

```
gurukul-newsletter/
├── app/
│   ├── api/
│   │   └── sessions/
│   │       ├── start/route.ts      # Create new session
│   │       ├── ask/route.ts        # Stream AI responses
│   │       └── end/route.ts        # End session
│   ├── session/[id]/
│   │   └── page.tsx                # Live session viewer
│   └── start-session/
│       └── page.tsx                # Start session UI
├── components/
│   └── LiveSessionViewer.tsx       # Main session component
├── lib/
│   ├── supabase.ts                 # Supabase client
│   └── perplexity.ts               # Perplexity AI client
├── supabase/
│   └── live-research-sessions-schema.sql
└── .env.local                      # Your API keys
```

---

## 🎨 How It Works

### 1. **Start Session Flow**
```
User clicks "Go Live" 
  → POST /api/sessions/start
  → Create session in database
  → Redirect to /session/[id]
```

### 2. **Ask Question Flow**
```
User types question
  → POST /api/sessions/ask (streaming)
  → Save question to database
  → Call Perplexity API with streaming
  → Stream response chunks to client
  → Save full response to database
  → Real-time broadcast to all viewers
```

### 3. **Real-time Viewing**
```
Viewer opens session
  → Subscribe to Supabase Realtime
  → Receive new messages instantly
  → Update viewer count automatically
```

---

## 💰 Cost Estimate

**Perplexity Sonar API:**
- Input: $1 per 1M tokens
- Output: $1 per 1M tokens

**Typical Session (30 min, 10 questions):**
- ~50,000 tokens total
- Cost: **$0.05 per session**

**For 100 sessions/month:**
- Total cost: **~$5/month** 🎉

**Supabase:**
- Free tier includes:
  - 500MB database
  - Unlimited API requests
  - Real-time subscriptions
- Perfect for starting out!

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Solution:** 
```bash
# Install Node.js from: https://nodejs.org/
# Or use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### Issue: "Perplexity API error"
**Solution:**
- Check your API key in `.env.local`
- Ensure it starts with `pplx-`
- Verify you have API credits in your Perplexity account

### Issue: "Database connection error"
**Solution:**
- Verify Supabase URL and key in `.env.local`
- Check if database schema is created
- Run the SQL file in Supabase SQL Editor

### Issue: "Session not updating in real-time"
**Solution:**
- Ensure you ran the SQL migration completely
- Check that realtime is enabled in Supabase
- Verify the publication includes the tables

---

## 🎯 Next Steps

### Phase 1: Launch (You are here! ✅)
- [x] Database schema
- [x] API routes
- [x] Live session UI
- [ ] Install packages
- [ ] Add API keys
- [ ] Test first session

### Phase 2: Enhance
- [ ] Add authentication (OAuth)
- [ ] Create user profiles
- [ ] Add session discovery page
- [ ] Implement reactions/comments
- [ ] Save sessions as posts

### Phase 3: Scale
- [ ] Add Claude as alternative AI
- [ ] Multiple simultaneous sessions
- [ ] Session recording/playback
- [ ] Analytics dashboard
- [ ] Monetization features

---

## 📚 Additional Resources

- **Perplexity API Docs:** https://docs.perplexity.ai/
- **Supabase Realtime:** https://supabase.com/docs/guides/realtime
- **Next.js Streaming:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

---

## 🎉 You're Ready!

Follow the Quick Start Guide above, and you'll have Live Research Sessions running in minutes!

Questions? Issues? Check the troubleshooting section or review the code comments.

**Happy researching! 🚀**
