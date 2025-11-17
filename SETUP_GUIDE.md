# 🎯 Aryavarta Live Research Sessions - Setup Guide

## What You've Built 🚀

**Live AI Research Sessions** - A revolutionary feature where users can conduct live philosophical research with AI, and followers can watch in real-time! Think "Twitch for philosophical inquiry" 🧠

### Key Features:
- ✅ Real-time AI responses with Perplexity
- ✅ Live viewer count
- ✅ Streaming responses (character-by-character)
- ✅ Citations and sources
- ✅ Host and viewer modes
- ✅ Session history saved to database

---

## 📋 Setup Instructions

### Step 1: Install Dependencies

```bash
cd /Users/rajathnigam/gurukul-newsletter
npm install openai
```

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your credentials:

```env
# Get these from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Get this from Perplexity API
PERPLEXITY_API_KEY=pplx-your-api-key-here
```

### Step 3: Set Up Supabase Database

1. Go to your Supabase Dashboard
2. Click on **SQL Editor**
3. Copy the entire contents of `/supabase/live-research-sessions-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** ▶️

This will create:
- `live_research_sessions` table
- `session_messages` table
- `session_viewers` table
- `session_reactions` table
- All necessary indexes and triggers
- Row Level Security policies
- Real-time subscriptions

### Step 4: Get Perplexity API Key

1. Go to [Perplexity API](https://www.perplexity.ai/api-platform)
2. Sign up for an account
3. Subscribe to Perplexity Pro ($20/month) for $5 API credit
   - OR start with pay-as-you-go ($1 per 1M tokens)
4. Get your API key from the dashboard
5. Add it to your `.env.local` file

### Step 5: Run the Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`!

---

## 🎨 How to Use

### As a Host (Starting a Session):


1. **Create a session** by calling the API:
```javascript
const response = await fetch('/api/sessions/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Understanding Karma in Bhagavad Gita',
    topic: 'Vedic Philosophy',
    ai_model: 'perplexity',
    host_id: 'your-user-id', // Get from Supabase auth
  }),
});

const { session } = await response.json();
```

2. **Share the link** with your followers:
```
https://arya-varta.in/session/{session.id}
```

3. **Ask questions** - Type in the input box and hit "Ask"
4. **Watch AI respond** - See the response stream in real-time
5. **End session** - Click "End Session" when done

### As a Viewer (Watching a Session):

1. **Click the session link** shared by the host
2. **Watch in real-time** - See questions and AI responses as they happen
3. **See other viewers** - View count updates live
4. **React to insights** - (Coming soon!)

---

## 🏗️ Project Structure

```
gurukul-newsletter/
├── app/
│   ├── api/
│   │   └── sessions/
│   │       ├── start/route.ts      # Create new session
│   │       ├── ask/route.ts        # Stream AI responses
│   │       └── end/route.ts        # End session
│   └── session/
│       └── [id]/page.tsx           # Live session viewer page
├── components/
│   └── LiveSessionViewer.tsx       # Main UI component
├── lib/
│   ├── supabase.ts                 # Supabase client & types
│   └── perplexity.ts               # Perplexity AI client
└── supabase/
    └── live-research-sessions-schema.sql  # Database schema
```

---

## 💰 Cost Breakdown

### Perplexity Sonar Model ($1 per 1M tokens)

**Example Session (30 minutes, 10 questions):**
- Input: ~20,000 tokens (questions + context)
- Output: ~30,000 tokens (detailed answers)
- **Total Cost: $0.05 per session** ✅

**Monthly Estimates:**
- 100 sessions/month = **$5**
- 500 sessions/month = **$25**
- 1,000 sessions/month = **$50**

**This is incredibly affordable!** 🎉

---

## 🚀 Next Steps

### Phase 1: Basic Testing ✅
- [x] Set up database schema
- [x] Create API routes
- [x] Build UI components
- [ ] Test with real Perplexity API key

### Phase 2: Enhancements
- [ ] Add session discovery page (browse live sessions)
- [ ] Add chat for viewers (live comments)
- [ ] Add reactions (👍 💡 🔥)
- [ ] Add "Save as Post" feature
- [ ] Add session recordings

### Phase 3: Advanced Features
- [ ] Add Claude integration (for philosophical analysis)
- [ ] Add multi-user co-hosting
- [ ] Add polls during sessions
- [ ] Add session analytics

---

## 🐛 Troubleshooting

### "Module not found: 'openai'"
**Solution:** Run `npm install openai`

### "Perplexity API key invalid"
**Solution:** Double-check your API key in `.env.local`

### "Session not found"
**Solution:** Make sure you've run the SQL schema in Supabase

### Messages not appearing in real-time
**Solution:** 
1. Check if Realtime is enabled in Supabase
2. Verify RLS policies are correct
3. Check browser console for errors

### Streaming not working
**Solution:**
1. Verify your Perplexity API key
2. Check API rate limits
3. Ensure Edge Runtime is enabled in route

---

## 📚 API Reference

### Start Session
```typescript
POST /api/sessions/start
Body: {
  title: string;
  topic?: string;
  ai_model: 'perplexity' | 'claude';
  host_id: string;
}
Response: { session: LiveResearchSession }
```

### Ask Question (Streaming)
```typescript
POST /api/sessions/ask
Body: {
  session_id: string;
  question: string;
  ai_model?: 'perplexity';
}
Response: Server-Sent Events stream
```

### End Session
```typescript
POST /api/sessions/end
Body: {
  session_id: string;
  host_id: string;
}
Response: { session: LiveResearchSession }
```

---

## 🎉 You're All Set!

You now have a fully functional **Live AI Research Sessions** feature!

**What makes this special:**
1. **Real-time collaboration** - Followers learn as you learn
2. **Transparent research** - Everything is cited and sourced
3. **Scalable** - Supabase handles all the real-time complexity
4. **Affordable** - Only pay for what you use

**Questions?** Check the comments in the code or reach out for help!

---

Built with ❤️ for Aryavarta
Powered by Perplexity AI + Supabase + Next.js
