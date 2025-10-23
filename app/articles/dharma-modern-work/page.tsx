import { BookOpen, ArrowLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export default function DharmaModernWorkArticle() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Gurukul
            </h1>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Link */}
        <Link 
          href="/#articles"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="inline-flex items-center gap-1">
              <Calendar size={16} />
              October 22, 2025
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={16} />
              5 min read
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              Bhagavad Gita
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Dharma in the Modern Workplace: Finding Purpose Beyond Profit
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            How Krishna&apos;s timeless teachings on duty and purpose offer a powerful framework 
            for navigating career choices and finding meaning in today&apos;s work environment.
          </p>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-12 flex items-center justify-center">
          <BookOpen className="text-orange-300" size={80} />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Modern Dilemma</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            In today&apos;s fast-paced corporate world, millions wake up each day feeling disconnected 
            from their work. The pursuit of promotions, salary hikes, and quarterly targets has 
            left many asking: <em>&quot;Is this all there is?&quot;</em>
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            This isn&apos;t a new problem. Over 5,000 years ago, on the battlefield of Kurukshetra, 
            Arjuna faced a similar crisis. Confronted with the prospect of fighting his own family, 
            he questioned the very purpose of his actions. His charioteer, Krishna, responded with 
            teachings that remain profoundly relevant today.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Understanding Dharma</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The concept of <strong>dharma</strong> is often mistranslated as &quot;duty&quot; or &quot;righteousness,&quot; 
            but it&apos;s far more nuanced. Dharma is about aligning your actions with your inherent 
            nature and the role you play in the larger cosmic order.
          </p>

          <blockquote className="border-l-4 border-orange-500 pl-6 italic text-gray-700 my-8 bg-orange-50 py-4 rounded-r-lg">
            &quot;Better to do one&apos;s own dharma imperfectly than to do another&apos;s dharma perfectly.&quot;
            <footer className="text-sm text-gray-600 mt-2 not-italic">— Bhagavad Gita 3.35</footer>
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            This verse challenges our modern obsession with comparison. Your colleague might be 
            excelling in sales, but if your dharma lies in creative work, trying to become them 
            will only lead to frustration. The key is discovering and honoring your unique path.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Three Practical Applications</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Work as Service, Not Transaction</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Krishna teaches the concept of <em>Nishkama Karma</em> — action without attachment to 
            results. This doesn&apos;t mean being careless about outcomes. Instead, it means focusing 
            on excellence in execution rather than obsessing over rewards.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Modern translation:</strong> Do your best work because it aligns with your values, 
            not just for the next promotion. Paradoxically, this mindset often leads to better results 
            than anxious striving.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Your Role, Your Rules</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Just as Arjuna was a warrior and Krishna a guide, each of us has a unique role shaped 
            by our skills, circumstances, and inner calling. The Gita doesn&apos;t say all paths are 
            the same — it says your path is uniquely yours.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Modern translation:</strong> Stop following someone else&apos;s career playbook. 
            If you&apos;re naturally analytical, don&apos;t force yourself into people-facing roles just 
            because they seem prestigious. Find work that honors your authentic strengths.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Higher Purpose Over Paycheck</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The Gita asks us to see our work as part of a larger cosmic order. This doesn&apos;t require 
            religious belief — it&apos;s about recognizing that your work impacts others and contributes 
            to something beyond yourself.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Modern translation:</strong> Find the meaning in your work. Even if you&apos;re writing 
            code or managing spreadsheets, ask: Who does this serve? How does it help? What problem 
            does it solve? Purpose isn&apos;t found in grand gestures — it&apos;s in understanding your 
            work&apos;s ripple effect.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Timeless Wisdom</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            What makes the Bhagavad Gita remarkable is that it was delivered not in a temple or ashram, 
            but on a battlefield — the ultimate high-pressure environment. Krishna didn&apos;t tell Arjuna 
            to abandon his responsibilities and meditate in a cave. He taught him to act with wisdom, 
            clarity, and purpose right where he stood.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Similarly, you don&apos;t need to quit your job to find dharma. You need to transform your 
            relationship with work — seeing it not as a burden to endure or a prize to win, but as 
            an expression of who you are and what you&apos;re meant to contribute.
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 my-12 border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Turn: Reflection Questions</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• What aspects of your work feel most aligned with your natural strengths?</li>
              <li>• Are you pursuing goals because they&apos;re truly yours, or because of external pressure?</li>
              <li>• How does your work serve others or contribute to something larger?</li>
              <li>• What would change if you focused on excellence in action rather than attachment to results?</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed">
            The Bhagavad Gita doesn&apos;t promise easy answers, but it offers something more valuable: 
            a framework for living with purpose, clarity, and inner peace — whether you&apos;re on a 
            battlefield or in a boardroom.
          </p>
        </div>

        {/* Author Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Gurukul Editorial Team</h3>
              <p className="text-gray-600 text-sm">
                Dedicated to making ancient Indian wisdom accessible and relevant to modern life. 
                Each article is thoroughly researched and presented with respect for original sources.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            More Wisdom Every Week
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Subscribe to receive articles like this directly to your inbox
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white">Gurukul</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Bringing ancient wisdom to modern life, one story at a time.
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Gurukul. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
