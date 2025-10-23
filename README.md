# 🕉️ Gurukul - Ancient Wisdom for Modern Times

A beautiful, modern newsletter platform bringing insights from the Vedas, Upanishads, Ramayana, Mahabharata, and Puranas to contemporary life.

## 🎯 Mission

To counter manufactured hate against Indian culture by sharing authentic, well-researched content that demonstrates the depth, sophistication, and timeless relevance of the world's oldest living civilization.

## ✨ Features

- **Beautiful Landing Page** - Responsive design with gradient aesthetics
- **Email Newsletter System** - Collect subscribers and manage distribution
- **Article Platform** - Rich, readable articles with proper typography
- **Sample Content** - Two fully-written articles demonstrating content quality
- **Modern Stack** - Built with Next.js 15, TypeScript, Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Resend account for email (free tier works)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Configure your `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup (Supabase)

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run this SQL in the Supabase SQL Editor:**

```sql
-- Create subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);

-- Add index for active subscribers
CREATE INDEX idx_subscribers_active ON subscribers(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage subscribers
CREATE POLICY "Service role can manage subscribers"
  ON subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

3. **Get your credentials:**
   - Project URL: Settings → API → Project URL
   - Service Role Key: Settings → API → Service role key (keep this secret!)

## 📧 Email Setup (Resend)

1. **Sign up at [resend.com](https://resend.com)**

2. **Verify your domain** (optional for production, not needed for testing)

3. **Get your API key** from the dashboard

4. **Add the key to `.env.local`**

## 📝 Content Structure

### Articles Location
Articles are in `/app/articles/[slug]/page.tsx`

### Creating New Articles

1. Create a new folder in `/app/articles/` with your article slug
2. Create a `page.tsx` file following the pattern in existing articles
3. Update the home page (`/app/page.tsx`) to link to your new article

### Article Template
```tsx
// See /app/articles/dharma-modern-work/page.tsx for full template
```

## 🎨 Design System

- **Primary Color:** Orange (#ea580c) to Amber (#d97706)
- **Typography:** System fonts for optimal performance
- **Layout:** Mobile-first responsive design
- **Icons:** Lucide React

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 📦 Project Structure

```
gurukul/
├── app/
│   ├── api/
│   │   └── subscribe/        # Newsletter subscription endpoint
│   ├── articles/
│   │   ├── dharma-modern-work/
│   │   └── upanishadic-self/
│   ├── layout.tsx
│   ├── page.tsx              # Landing page
│   └── globals.css
├── components/
│   └── NewsletterSignup.tsx  # Reusable signup form
├── public/                   # Static assets
├── .env.local.example        # Environment variables template
└── package.json
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repo

3. **Add environment variables:**
   - Add all variables from `.env.local` in Vercel settings

4. **Deploy!**

### Environment Variables for Production
Make sure to add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

## 📈 Next Steps (Post-MVP)

- [ ] Admin dashboard for content management
- [ ] Rich text editor for articles
- [ ] Email template design
- [ ] Automated weekly sending
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Social sharing features
- [ ] Comment system
- [ ] Mobile app (Flutter)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this for educational purposes or build your own newsletter platform.

## 🙏 Acknowledgments

Built with the vision of sharing authentic Indian wisdom with the world. Special thanks to the ancient rishis whose timeless teachings continue to enlighten humanity.

---

**Built with ❤️ to counter hate with knowledge**
