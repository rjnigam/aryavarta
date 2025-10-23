import { BookOpen, Sparkles, Mail, Heart, Compass } from 'lucide-react';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Header } from '@/components/Header';
import { getRecentArticles } from '@/lib/articles';

export default function Home() {
  const articles = getRecentArticles(6);
  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-sandalwood-50">
      {/* Decorative top border with traditional pattern */}
      <div className="h-2 bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600"></div>
      
      <Header />

      {/* Hero Section with Mandala Pattern */}
      <section className="container mx-auto px-4 py-20 md:py-32 bg-mandala">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 px-5 py-2 rounded-full mb-8 text-sm font-semibold border border-saffron-200 shadow-sm">
            <Sparkles size={16} className="text-saffron-600" />
            <span>सनातन ज्ञान • Ancient Wisdom for Modern Times</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
            Ancient Philosophy for{' '}
            <span className="bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent">
              Modern Minds
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            In an age of unprecedented comfort yet persistent emptiness, rediscover the philosophical wisdom 
            that helps us lead meaningful lives — free from dogma, rich in insight.
          </p>

          <div className="max-w-md mx-auto" id="subscribe">
            <NewsletterSignup />
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Join our community of seekers on this sacred journey
          </p>
        </div>
      </section>

      {/* Stats Section with Traditional Design */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="text-4xl font-bold bg-gradient-to-br from-saffron-700 to-vermillion-700 bg-clip-text text-transparent mb-2 font-serif group-hover:scale-110 transition-transform">5000+</div>
            <div className="text-gray-600 text-sm font-medium">Years of Wisdom</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold bg-gradient-to-br from-saffron-700 to-vermillion-700 bg-clip-text text-transparent mb-2 font-serif group-hover:scale-110 transition-transform">Sanatan</div>
            <div className="text-gray-600 text-sm font-medium">Eternal Dharma</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold bg-gradient-to-br from-saffron-700 to-vermillion-700 bg-clip-text text-transparent mb-2 font-serif group-hover:scale-110 transition-transform">Weekly</div>
            <div className="text-gray-600 text-sm font-medium">New Insights</div>
          </div>
        </div>
      </section>

      {/* About Section with Sacred Design */}
      <section id="about" className="bg-white py-20 border-y border-saffron-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 font-serif">
              Why Aryavarta?
            </h3>
            <p className="text-center text-saffron-700 mb-12 font-serif italic">योगः कर्मसु कौशलम् • Excellence in Action</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-100 to-sandalwood-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-saffron-200 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md">
                  <BookOpen className="text-saffron-700" size={36} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 font-serif">Pure Philosophy</h4>
                <p className="text-gray-600 leading-relaxed">
                  Timeless wisdom from ancient texts — Vedas, Upanishads, Gita — presented as philosophy, 
                  not dogma. Critical thinking over blind faith.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-100 to-sandalwood-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-saffron-200 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md">
                  <Compass className="text-saffron-700" size={36} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 font-serif">Spiritual Healing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Filling the void that wealth and technology cannot — finding happiness in simplicity, 
                  meaning in everyday life, and peace within ourselves.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-100 to-sandalwood-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-saffron-200 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md">
                  <Heart className="text-saffron-700" size={36} />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 font-serif">Beyond Division</h4>
                <p className="text-gray-600 leading-relaxed">
                  Philosophical guidance that transcends religious boundaries — countering hatred and 
                  impulsive conflict with wisdom, compassion, and understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Ornamental Design */}
      <section className="container mx-auto px-4 py-20 bg-mandala">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-2xl p-8 md:p-16 border-2 border-saffron-200 shadow-xl relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-vermillion-600 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-vermillion-600 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-vermillion-600 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-vermillion-600 rounded-br-2xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 font-serif text-center">Our Mission</h3>
            <p className="text-center text-saffron-700 mb-2 font-serif italic">आर्यावर्त • Āryāvarta • Land of the Noble People</p>
            <p className="text-center text-gray-600 mb-8 text-sm font-serif italic">
              "आर्याणां वर्ते देशः आर्यावर्तः" — The land where noble souls dwell
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
              We live in an age of unprecedented material abundance, yet many of us feel spiritually empty. 
              We have technology, comfort, and connection at our fingertips — but we&apos;ve lost the ability 
              to find joy in life&apos;s simple pleasures. We argue endlessly online, spreading division and hatred, 
              not because it&apos;s in our nature, but because we lack philosophical grounding.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
              Ancient Indian philosophy — found in the Vedas, Upanishads, and Bhagavad Gita — addresses the 
              deepest questions of human existence: How do we find meaning? How do we handle suffering? 
              How do we live with purpose? These aren&apos;t religious answers requiring blind faith. 
              They&apos;re philosophical insights that invite critical thinking and personal reflection.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              Aryavarta exists to bridge this spiritual gap — offering timeless wisdom free from dogma, 
              providing philosophical guidance that transcends religious boundaries, and helping us all 
              rediscover the peace, compassion, and clarity we desperately need in our modern world.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Preview Section with Horizontal Auto-Scrolling */}
      <section id="articles" className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 font-serif">
              Latest Wisdom
            </h3>
            <p className="text-center text-gray-600 mb-12">
              Explore our growing collection of sacred insights
            </p>
            
            {/* Auto-scrolling container with defined boundaries */}
            <div className="relative overflow-hidden">
              {/* Gradient masks for fade effect at edges */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex gap-6 animate-scroll hover:pause-scroll pl-4">
                {/* Duplicate articles for seamless loop */}
                {[...articles, ...articles].map((article, index) => (
                  <Link
                    key={`${article.slug}-${index}`}
                    href={`/articles/${article.slug}`}
                    className="group flex-shrink-0 w-[380px] h-[320px] flex flex-col bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 hover:border-vermillion-400 hover:shadow-xl transition-all hover:scale-[1.02] relative overflow-hidden"
                  >
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-saffron-200/30 to-transparent rounded-bl-full"></div>
                    
                    <div className="relative z-10 text-center flex flex-col flex-1">
                      <h4 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-saffron-700 transition font-serif leading-tight">
                        {article.title}
                      </h4>
                      
                      <div className="text-sm text-saffron-700 font-semibold mb-4">
                        {article.readTime}
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2 flex-1">
                        {article.excerpt}
                      </p>
                      
                      <div className="inline-flex items-center gap-2 text-saffron-700 font-semibold px-4 py-2 bg-saffron-100 rounded-full group-hover:bg-saffron-200 transition-colors mx-auto">
                        Read More 
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Traditional Design */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t-2 border-saffron-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif">आर्यवर्त</span>
                <p className="text-xs text-gray-400">Aryavarta</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 font-serif italic">
              नमस्ते • Bringing ancient wisdom to modern life, one insight at a time.
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Aryavarta. All rights reserved. • सत्यं वद धर्मं चर
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
