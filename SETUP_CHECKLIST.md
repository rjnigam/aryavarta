# ✅ Setup Checklist for Live Research Sessions

Copy this checklist and check off items as you complete them:

## 🔧 Prerequisites
- [ ] Node.js and npm installed on your machine
- [ ] Supabase account created
- [ ] Perplexity account created

## 📦 Installation
- [ ] Run: `npm install openai`
- [ ] Verify package.json includes "openai"

## 🔑 API Keys
- [ ] Get Perplexity API key from https://www.perplexity.ai/settings/api
- [ ] Get Supabase URL from dashboard
- [ ] Get Supabase Anon Key from dashboard
- [ ] Update `.env.local` with all three keys

## 🗄️ Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Copy content from `supabase/live-research-sessions-schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify tables created (check Tables section in Supabase)
- [ ] Verify Realtime enabled for tables

## 🧪 Testing
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000/start-session
- [ ] Create a test session
- [ ] Ask a test question
- [ ] See streaming response
- [ ] Open session in incognito window (test viewer mode)
- [ ] End the session

## 🎉 Launch Ready
- [ ] All tests passed
- [ ] Feature working smoothly
- [ ] Ready to go live!

---

## 📊 Current Status

**Completed:**
- ✅ Database schema created
- ✅ API routes implemented
- ✅ UI components built
- ✅ Perplexity integration ready
- ✅ Real-time streaming configured

**Your Tasks:**
- ⏳ Install `openai` package
- ⏳ Add API keys to `.env.local`
- ⏳ Run database migration
- ⏳ Test the feature

**Estimated time to complete:** 10-15 minutes

---

Good luck! 🚀
