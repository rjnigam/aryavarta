import { Header } from '@/components/Header';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Mail, Sparkles, BookOpen, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Subscribe - Aryavarta Newsletter',
  description: 'Subscribe to receive weekly insights from ancient Indian philosophy delivered to your inbox.',
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-sandalwood-50">
      <div className="h-2 bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600"></div>
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 px-5 py-2 rounded-full mb-8 text-sm font-semibold border border-saffron-200 shadow-sm">
            <Sparkles size={16} className="text-saffron-600" />
            <span>Join Our Community</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
            Subscribe to{' '}
            <span className="bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent">
              Aryavarta
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Receive weekly insights from ancient Indian philosophy delivered to your inbox. 
            Free forever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Newsletter Signup Form */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-saffron-200 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-saffron-600 to-vermillion-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">
                Weekly Wisdom
              </h2>
              <p className="text-gray-600">
                Join thousands of seekers exploring ancient philosophy
              </p>
            </div>
            
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif text-gray-900">
            What You'll Receive
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 bg-white rounded-xl p-6 shadow-md border border-saffron-100 hover:shadow-lg transition">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron-600 to-vermillion-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 font-serif">Weekly Articles</h3>
                <p className="text-gray-600 text-sm">
                  In-depth explorations of Vedic wisdom, Upanishadic philosophy, and Bhagavad Gita teachings
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white rounded-xl p-6 shadow-md border border-vermillion-100 hover:shadow-lg transition">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 font-serif">Practical Insights</h3>
                <p className="text-gray-600 text-sm">
                  Ancient wisdom applied to modern challenges: stress, purpose, relationships, and meaning
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white rounded-xl p-6 shadow-md border border-sandalwood-100 hover:shadow-lg transition">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-sandalwood-600 to-sacred-600 rounded-lg flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 font-serif">Spiritual Healing</h3>
                <p className="text-gray-600 text-sm">
                  Timeless teachings on mindfulness, self-awareness, and living with intention
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white rounded-xl p-6 shadow-md border border-sacred-100 hover:shadow-lg transition">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-sacred-600 to-saffron-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 font-serif">Academic Rigor</h3>
                <p className="text-gray-600 text-sm">
                  40+ citations per article from scholarly sources, ensuring depth and accuracy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Promise Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-saffron-50 to-sandalwood-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif text-gray-900">
            Our Promise
          </h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>
              ✓ <strong>100% Free</strong> - Always has been, always will be
            </p>
            <p>
              ✓ <strong>No Spam</strong> - Only weekly insights, nothing more
            </p>
            <p>
              ✓ <strong>Unsubscribe Anytime</strong> - One click, no questions asked
            </p>
            <p>
              ✓ <strong>Privacy Respected</strong> - Your email is never shared or sold
            </p>
            <p>
              ✓ <strong>Quality Content</strong> - Researched, cited, and thoughtfully written
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-saffron-100 to-vermillion-100 rounded-xl p-8 shadow-lg border border-saffron-200">
              <div className="text-5xl font-bold text-saffron-700 mb-2 font-serif">5000+</div>
              <div className="text-gray-700 font-semibold">Years of Wisdom</div>
              <p className="text-sm text-gray-600 mt-2">From the ancient Vedas to modern insights</p>
            </div>
            <div className="bg-gradient-to-br from-vermillion-100 to-sandalwood-100 rounded-xl p-8 shadow-lg border border-vermillion-200">
              <div className="text-5xl font-bold text-vermillion-700 mb-2 font-serif">40+</div>
              <div className="text-gray-700 font-semibold">Citations per Article</div>
              <p className="text-sm text-gray-600 mt-2">Academic rigor meets accessibility</p>
            </div>
            <div className="bg-gradient-to-br from-sandalwood-100 to-saffron-100 rounded-xl p-8 shadow-lg border border-sandalwood-200">
              <div className="text-5xl font-bold text-sandalwood-700 mb-2 font-serif">Weekly</div>
              <div className="text-gray-700 font-semibold">Fresh Insights</div>
              <p className="text-sm text-gray-600 mt-2">Every week, delivered to your inbox</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-2xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              Ready to Begin?
            </h2>
            <p className="text-xl mb-2 opacity-95">
              Join our community of seekers exploring ancient wisdom
            </p>
            <p className="text-sm opacity-75 mb-8">
              "आर्याणां वर्ते देशः आर्यावर्तः" — The land where noble souls dwell
            </p>
            <a 
              href="#top"
              className="inline-block bg-white text-saffron-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Scroll to Subscribe
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif text-gray-900">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900">How often will I receive emails?</h3>
              <p className="text-gray-600">
                One email per week, every week. We respect your inbox and never spam.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Is this really free?</h3>
              <p className="text-gray-600">
                Yes, completely free. Aryavarta is a labor of love dedicated to sharing wisdom, not extracting profit.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Do I need to be Hindu to subscribe?</h3>
              <p className="text-gray-600">
                Absolutely not! Our content is philosophical, not religious. We welcome seekers of all backgrounds, beliefs, and traditions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Can I unsubscribe anytime?</h3>
              <p className="text-gray-600">
                Yes, every email includes an unsubscribe link. One click, no questions, no hassle.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-saffron-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900">What topics do you cover?</h3>
              <p className="text-gray-600">
                We explore Vedic wisdom, Upanishadic philosophy, Bhagavad Gita teachings, and their relevance to modern life—covering mindfulness, purpose, ethics, and human flourishing.
              </p>
            </div>
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
