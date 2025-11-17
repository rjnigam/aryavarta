# ✅ Live Research Sessions - Quick Start Checklist

## Before You Start
- [ ] Node.js and npm installed
- [ ] Supabase account set up
- [ ] Project already has basic authentication

## Setup Steps (15 minutes)

### 1. Install Package (2 min)
```bash
cd /Users/rajathnigam/gurukul-newsletter
npm install openai
```

### 2. Environment Variables (3 min)
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
PERPLEXITY_API_KEY=pplx-your-key
```

**Get Supabase keys:** Dashboard → Settings → API
**Get Perplexity key:** https://www.perplexity.ai/api-platform

### 3. Database Setup (5 min)
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `/supabase/live-research-sessions-schema.sql`
3. Paste and click Run ▶️
4. Verify tables created: `live_research_sessions`, `session_messages`

### 4. Test It (5 min)
```bash
npm run dev
```

Then test by creating a session in your browser console:
```javascript
const response = await fetch('/api/sessions/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Session',
    ai_model: 'perplexity',
    host_id: 'your-user-id', // Get from Supabase auth
  }),
});
const { session } = await response.json();
console.log('Session ID:', session.id);
// Visit: http://localhost:3000/session/{session.id}
```

---

## 📝 Quick Reference

### Files Created
```
✅ lib/supabase.ts          - Database client
✅ lib/perplexity.ts        - AI client
✅ app/api/sessions/start/route.ts  - Create session
✅ app/api/sessions/ask/route.ts    - Stream AI responses
✅ app/api/sessions/end/route.ts    - End session
✅ components/LiveSessionViewer.tsx - UI component
✅ app/session/[id]/page.tsx        - Session page
✅ supabase/live-research-sessions-schema.sql - DB schema
```

### Database Tables
```
✅ live_research_sessions   - Session details
✅ session_messages         - Q&A messages
✅ session_viewers          - Who's watching
✅ session_reactions        - Likes/reactions
```

### API Endpoints
```
POST /api/sessions/start    - Create new session
POST /api/sessions/ask      - Ask question (streaming)
POST /api/sessions/end      - End session
```

---

## 🎯 What's Next?

### Immediate (Today)
1. Get Perplexity API key
2. Run database schema
3. Test with a live session

### Short-term (This Week)
1. Add session discovery page
2. Style the UI to match your brand
3. Add viewer chat/comments

### Long-term (This Month)
1. Add session recordings
2. Integrate with community posts
3. Add analytics dashboard

---

## 💡 Pro Tips

**Testing without API key:**
Use console logs to verify the flow works before adding real AI

**Cost management:**
Start with Perplexity pay-as-you-go before subscribing

**Performance:**
Enable Supabase connection pooling for production

**Security:**
Always verify `host_id` matches authenticated user

---

## 🆘 Need Help?

**Check:**
1. Browser console for errors
2. Network tab for API responses
3. Supabase logs for database errors

**Common Issues:**
- RLS blocking queries → Check policies
- Streaming not working → Verify API key
- Real-time not updating → Enable Realtime in Supabase

---

Ready to go live? 🚀
