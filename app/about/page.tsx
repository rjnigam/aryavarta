import { Header } from '@/components/Header';
import { Heart, Compass, BookOpen, Sparkles } from 'lucide-react';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import Link from 'next/link';

export const metadata = {
  title: 'About Aryavarta - Ancient Philosophy for Modern Minds',
  description: 'Learn about our mission to share ancient Indian philosophical wisdom for modern spiritual and intellectual guidance.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-sandalwood-50">
      <div className="h-2 bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600"></div>
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 px-5 py-2 rounded-full mb-8 text-sm font-semibold border border-saffron-200 shadow-sm">
            <Sparkles size={16} className="text-saffron-600" />
            <span>Our Mission</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
            About{' '}
            <span className="bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent">
              Aryavarta
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Ancient Philosophy for Modern Minds
          </p>
        </div>
      </section>

      {/* What is Aryavarta */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-saffron-100 p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
              Aryavarta was founded on a simple conviction: that the wisdom preserved in India&apos;s ancient philosophical 
              texts deserves a place in modern intellectual discourse. For too long, these profound teachings have been 
              misunderstood as mere religious doctrine, when in truth they represent some of humanity&apos;s deepest inquiries 
              into consciousness, ethics, and the art of living well.
            </p>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
              Our approach is grounded in academic rigor and intellectual honesty. We study the original Sanskrit texts, 
              consult scholarly interpretations across centuries, and present these ideas with the seriousness they deserve. 
              This isn&apos;t self-help dressed in Sanskrit terms—it&apos;s genuine philosophical exploration that invites 
              critical engagement, not blind acceptance.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              What makes Aryavarta different is our commitment to philosophy over preaching. We explore ideas like dharma, 
              moksha, and the nature of the self not as religious imperatives, but as frameworks for understanding human 
              experience. Whether you&apos;re a philosophy student, a spiritual seeker, or simply curious about ideas that have 
              shaped civilizations, you&apos;ll find substantive content here—intellectually challenging yet accessible to all.
            </p>
          </div>
        </div>
      </section>

      {/* Why Aryavarta - Three Pillars */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-serif text-gray-900">
            Why Aryavarta?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our approach to sharing ancient wisdom with modern minds
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pure Philosophy */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-saffron-100 hover:shadow-2xl transition-all hover:scale-105 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-saffron-600 to-vermillion-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <BookOpen className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-gray-900">Pure Philosophy</h3>
              <p className="text-gray-600 leading-relaxed">
                Every piece we publish undergoes thorough research, drawing from original Sanskrit texts, 
                academic commentaries, and scholarly interpretations. We cite our sources extensively, 
                ensuring intellectual honesty while making complex ideas understandable for modern readers.
              </p>
            </div>

            {/* Spiritual Healing */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-vermillion-100 hover:shadow-2xl transition-all hover:scale-105 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-vermillion-600 to-sandalwood-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-gray-900">Practical Wisdom</h3>
              <p className="text-gray-600 leading-relaxed">
                Philosophy shouldn&apos;t remain abstract theory. We connect ancient teachings to contemporary 
                challenges—navigating career pressures, finding purpose, managing relationships, and cultivating 
                mental clarity in an age of constant distraction.
              </p>
            </div>

            {/* Beyond Division */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-sandalwood-100 hover:shadow-2xl transition-all hover:scale-105 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-sandalwood-600 to-saffron-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Compass className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-gray-900">Beyond Division</h3>
              <p className="text-gray-600 leading-relaxed">
                These teachings belong to humanity, not to any single tradition. We welcome readers from every 
                background—philosophers, theologians, scientists, artists, skeptics—anyone seeking deeper 
                understanding through intellectual inquiry rather than sectarian boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-saffron-50 to-sandalwood-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif text-gray-900">
            Our Approach
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="text-xl font-bold mb-3 text-saffron-700 font-serif">Scholarly Foundation</h3>
              <p className="text-gray-600">
                We consult primary texts, classical commentaries, and contemporary academic research to ensure 
                our interpretations are well-grounded and intellectually responsible.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-vermillion-100">
              <h3 className="text-xl font-bold mb-3 text-vermillion-700 font-serif">Clear Communication</h3>
              <p className="text-gray-600">
                Sanskrit philosophy can be dense, but it doesn&apos;t have to be inaccessible. We explain 
                complex ideas in straightforward language without sacrificing nuance or depth.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-sandalwood-100">
              <h3 className="text-xl font-bold mb-3 text-sandalwood-700 font-serif">Intellectual Honesty</h3>
              <p className="text-gray-600">
                We present multiple interpretations, acknowledge scholarly debates, and encourage readers 
                to engage critically rather than accept our views uncritically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-sacred-100">
              <h3 className="text-xl font-bold mb-3 text-sacred-700 font-serif">Contemporary Context</h3>
              <p className="text-gray-600">
                Ancient questions about consciousness, morality, and meaning remain urgently relevant. 
                We show how these timeless inquiries speak to modern life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-saffron-100 to-vermillion-100 rounded-xl p-8 shadow-lg border border-saffron-200">
              <div className="text-5xl font-bold text-saffron-700 mb-2 font-serif">5000+</div>
              <div className="text-gray-700 font-semibold">Years of Wisdom</div>
            </div>
            <div className="bg-gradient-to-br from-vermillion-100 to-sandalwood-100 rounded-xl p-8 shadow-lg border border-vermillion-200">
              <div className="text-5xl font-bold text-vermillion-700 mb-2 font-serif">Sanatan</div>
              <div className="text-gray-700 font-semibold">Eternal Truth</div>
            </div>
            <div className="bg-gradient-to-br from-sandalwood-100 to-saffron-100 rounded-xl p-8 shadow-lg border border-sandalwood-200">
              <div className="text-5xl font-bold text-sandalwood-700 mb-2 font-serif">Weekly</div>
              <div className="text-gray-700 font-semibold">New Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-2xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Join Our Journey
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Receive weekly insights from ancient Indian philosophy, delivered to your inbox every week.
            </p>
            <Link 
              href="/subscribe"
              className="inline-block bg-white text-saffron-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Subscribe to Aryavarta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 font-serif">आर्यवर्त</h3>
              <p className="text-sm">Ancient Philosophy for Modern Minds</p>
            </div>
            <p className="text-sm mb-6">
              Sharing timeless wisdom from the Vedas, Upanishads, and Bhagavad Gita
            </p>
            <div className="flex justify-center gap-8 mb-6">
              <Link href="/" className="hover:text-saffron-400 transition">Home</Link>
              <Link href="/about" className="hover:text-saffron-400 transition">About</Link>
              <Link href="/articles" className="hover:text-saffron-400 transition">Articles</Link>
              <Link href="/subscribe" className="hover:text-saffron-400 transition">Subscribe</Link>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 Aryavarta. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
