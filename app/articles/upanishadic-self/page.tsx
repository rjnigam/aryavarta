import { BookOpen, ArrowLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export default function UpanishadicSelfArticle() {
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
              6 min read
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              Upanishads
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            The Upanishadic Self: Ancient Psychology Meets Modern Mindfulness
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            2,500 years before Freud and Jung, the Upanishads mapped human consciousness with 
            remarkable precision. Here&apos;s what they can teach us about the mind today.
          </p>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-12 flex items-center justify-center">
          <BookOpen className="text-orange-300" size={80} />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Crisis of Self-Awareness</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Anxiety, stress, burnout, identity crisis — these terms dominate modern mental health 
            discussions. We turn to therapy, meditation apps, and self-help books seeking answers 
            to fundamental questions: <em>Who am I? Why do I suffer? How do I find peace?</em>
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            What many don&apos;t realize is that these questions were explored with astonishing depth 
            in the Upanishads, composed between 800 and 200 BCE. These philosophical texts didn&apos;t 
            just theorize — they offered practical frameworks for understanding consciousness that 
            align remarkably with modern neuroscience and psychology.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Five Sheaths (Pancha Kosha)</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The <strong>Taittiriya Upanishad</strong> describes human existence as composed of five 
            layers or &quot;sheaths&quot; (koshas), each more subtle than the last:
          </p>

          <div className="bg-orange-50 rounded-xl p-6 my-8 border border-orange-100">
            <ol className="space-y-4 text-gray-700">
              <li>
                <strong className="text-orange-700">1. Annamaya Kosha (Physical Body)</strong>
                <p className="mt-1">The tangible body made of food. Modern equivalent: Your physical health, 
                fitness, and bodily sensations.</p>
              </li>
              <li>
                <strong className="text-orange-700">2. Pranamaya Kosha (Energy Body)</strong>
                <p className="mt-1">The vital life force. Modern equivalent: Your energy levels, breath, 
                and autonomic nervous system.</p>
              </li>
              <li>
                <strong className="text-orange-700">3. Manomaya Kosha (Mental Body)</strong>
                <p className="mt-1">The thinking mind and emotions. Modern equivalent: Your thoughts, 
                feelings, and reactive patterns.</p>
              </li>
              <li>
                <strong className="text-orange-700">4. Vijnanamaya Kosha (Wisdom Body)</strong>
                <p className="mt-1">The intellect and discernment. Modern equivalent: Your capacity for 
                insight, intuition, and higher reasoning.</p>
              </li>
              <li>
                <strong className="text-orange-700">5. Anandamaya Kosha (Bliss Body)</strong>
                <p className="mt-1">Pure consciousness and joy. Modern equivalent: States of flow, deep 
                peace, and transcendent experience.</p>
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Why This Matters Today</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Understanding Your Reactions</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Most people operate primarily in the <em>Manomaya Kosha</em> — reacting emotionally to 
            every stimulus. Your boss criticizes you, and immediately you feel anger or shame. The 
            Upanishads teach that this reactive layer isn&apos;t the &quot;real you.&quot;
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            By recognizing these layers, you can create distance: <em>&quot;That&apos;s my mental body reacting, 
            but I can access my wisdom body to respond differently.&quot;</em> This is essentially what 
            cognitive behavioral therapy teaches — but the Upanishads got there first.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">The Witness Consciousness</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            One of the most powerful concepts is <strong>Sakshi Bhava</strong> — the witness. The 
            Upanishads describe a part of you that observes thoughts and emotions without being 
            consumed by them.
          </p>

          <blockquote className="border-l-4 border-orange-500 pl-6 italic text-gray-700 my-8 bg-orange-50 py-4 rounded-r-lg">
            &quot;The Self is not the body, not the mind, not the ego. The Self is the eternal witness, 
            untouched by joy or sorrow.&quot;
            <footer className="text-sm text-gray-600 mt-2 not-italic">— Katha Upanishad</footer>
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Modern application:</strong> This is the foundation of mindfulness meditation. When 
            you notice &quot;I&apos;m anxious&quot; instead of simply being anxious, you&apos;ve activated witness 
            consciousness. You&apos;re no longer identified with the emotion — you&apos;re observing it.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">The Illusion of Separation</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The Upanishads repeatedly emphasize <strong>Advaita</strong> — non-duality. The apparent 
            separation between self and other, between you and the world, is an illusion created by 
            the mind.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Modern validation:</strong> Neuroscience now shows that the brain constructs the 
            sense of &quot;self&quot; — it&apos;s not a fixed entity. Studies on meditation show that experienced 
            practitioners report decreased activity in the &quot;default mode network,&quot; the brain region 
            associated with self-referential thinking. They literally experience less separation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Practical Exercises from the Upanishads</h2>
          
          <div className="space-y-6 my-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <h4 className="font-bold text-gray-900 mb-3">1. Neti Neti (Not This, Not That)</h4>
              <p className="text-gray-700 mb-3">
                When anxious or upset, practice discrimination:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>&quot;Am I my thoughts? No, I can observe my thoughts.&quot;</li>
                <li>&quot;Am I my emotions? No, I can notice my emotions changing.&quot;</li>
                <li>&quot;Am I my body? No, my body changes but my awareness remains.&quot;</li>
              </ul>
              <p className="text-gray-700 mt-3">
                What remains after this process is pure awareness — your true self.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <h4 className="font-bold text-gray-900 mb-3">2. Atma Vichara (Self-Inquiry)</h4>
              <p className="text-gray-700 mb-3">
                When making decisions, ask: &quot;Which layer is driving this?&quot;
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Is it physical comfort seeking? (Annamaya)</li>
                <li>Is it emotional reactivity? (Manomaya)</li>
                <li>Is it coming from deeper wisdom? (Vijnanamaya)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                This brings clarity to impulsive patterns.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <h4 className="font-bold text-gray-900 mb-3">3. Breath Awareness (Pranayama)</h4>
              <p className="text-gray-700">
                The Upanishads recognized that breath links body and mind. Conscious breathing 
                (even just 5 deep breaths) can shift you from reactive (Manomaya) to responsive 
                (Vijnanamaya) mode. Modern science confirms this activates the parasympathetic 
                nervous system.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Bridge Between Ancient and Modern</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            What makes the Upanishads extraordinary isn&apos;t that they&apos;re ancient — it&apos;s that they&apos;re 
            <em>accurate</em>. Millennia before brain scans and psychology labs, these sages mapped 
            consciousness through disciplined introspection.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Today&apos;s mindfulness movement, therapy models, and neuroscience research are essentially 
            rediscovering and validating what the Upanishads articulated centuries ago. The difference? 
            We now have scientific language to describe it.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            But perhaps the real gift of the Upanishads isn&apos;t just intellectual understanding — it&apos;s 
            the invitation to experiential knowledge. To not just read about consciousness, but to 
            explore it directly within yourself.
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 my-12 border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Turn: Self-Reflection</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Can you identify which &quot;kosha&quot; you typically operate from?</li>
              <li>• When was the last time you experienced witness consciousness?</li>
              <li>• What happens when you try the &quot;Neti Neti&quot; exercise during stress?</li>
              <li>• How might understanding these layers change your relationship with anxiety or fear?</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed">
            The Upanishads don&apos;t offer quick fixes or positive thinking mantras. They offer something 
            far more profound: a map of consciousness itself, drawn with precision that modern science 
            is only beginning to validate. In a world of mental health crises, perhaps we should look 
            not just forward, but also back — to wisdom that has already stood the test of millennia.
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
