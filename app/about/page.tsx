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
              In an age of unprecedented material comfort yet persistent spiritual emptiness, we find ourselves 
              searching for meaning. We have achieved technological marvels and economic prosperity, yet we lack 
              the happiness and simplicity that brings true fulfillment. Modern society often feels disconnected 
              from deeper purpose, leaving many of us yearning for guidance.
            </p>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
              Aryavarta was born from the belief that our timeless scriptures hold the answers we seek. The ancient 
              Indian philosophical tradition offers profound insights into human nature, consciousness, duty, and the 
              pursuit of meaning—wisdom that is as relevant today as it was thousands of years ago. But this wisdom 
              must be presented in a way that resonates with contemporary minds, free from religious dogma and accessible 
              to all seekers.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              We believe in spiritual and philosophical guidance that transcends religious boundaries. Our mission is 
              to share the universal truths found in the Vedas, Upanishads, Bhagavad Gita, and other ancient texts—not 
              as religious doctrine, but as philosophical inquiry into the nature of existence, consciousness, and human 
              flourishing. Aryavarta is a space where critical thinking meets ancient wisdom, where modern seekers can 
              find answers to timeless questions.
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
                We focus on philosophical inquiry and intellectual exploration, not religious doctrine. 
                Every article is rigorously researched with 40+ academic citations, ensuring scholarly 
                integrity while remaining accessible to all.
              </p>
            </div>

            {/* Spiritual Healing */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-vermillion-100 hover:shadow-2xl transition-all hover:scale-105 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-vermillion-600 to-sandalwood-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-gray-900">Spiritual Healing</h3>
              <p className="text-gray-600 leading-relaxed">
                Ancient wisdom offers profound insights for modern mental health, mindfulness, and 
                well-being. We translate timeless teachings into practical guidance for living a 
                meaningful, balanced life in today's world.
              </p>
            </div>

            {/* Beyond Division */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-sandalwood-100 hover:shadow-2xl transition-all hover:scale-105 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-sandalwood-600 to-saffron-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <Compass className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-gray-900">Beyond Division</h3>
              <p className="text-gray-600 leading-relaxed">
                Truth transcends religious labels. Whether you're Hindu, Buddhist, Christian, Muslim, 
                atheist, or simply curious—these philosophical insights are universal. We seek wisdom, 
                not conversion; understanding, not dogma.
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
              <h3 className="text-xl font-bold mb-3 text-saffron-700 font-serif">Academic Rigor</h3>
              <p className="text-gray-600">
                Every article includes 40+ citations from scholarly sources, ensuring accuracy and depth 
                in our exploration of ancient texts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-vermillion-100">
              <h3 className="text-xl font-bold mb-3 text-vermillion-700 font-serif">Accessible Language</h3>
              <p className="text-gray-600">
                Complex philosophical concepts are explained in clear, modern language that anyone can 
                understand and apply to their life.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-sandalwood-100">
              <h3 className="text-xl font-bold mb-3 text-sandalwood-700 font-serif">Critical Thinking</h3>
              <p className="text-gray-600">
                We encourage questioning, reflection, and personal interpretation rather than blind 
                acceptance of tradition.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-sacred-100">
              <h3 className="text-xl font-bold mb-3 text-sacred-700 font-serif">Modern Relevance</h3>
              <p className="text-gray-600">
                Ancient wisdom is connected to contemporary issues, from mental health to ethics, 
                showing timeless truths in modern contexts.
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
