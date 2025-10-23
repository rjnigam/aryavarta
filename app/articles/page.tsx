import { Header } from '@/components/Header';
import { getAllArticles } from '@/lib/articles';
import { ArticlesListClient } from '@/components/ArticlesListClient';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Articles - Aryavarta',
  description: 'Explore our collection of articles on ancient Indian philosophy and timeless wisdom.',
};

export default function ArticlesPage() {
  const allArticles = getAllArticles();

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-sandalwood-50">
      <div className="h-2 bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600"></div>
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 px-5 py-2 rounded-full mb-8 text-sm font-semibold border border-saffron-200 shadow-sm">
            <Sparkles size={16} className="text-saffron-600" />
            <span>Explore Timeless Wisdom</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
            Our{' '}
            <span className="bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Deep dives into ancient Indian philosophy with academic rigor and modern relevance.
          </p>
        </div>
      </section>

      {/* Articles List with Filters */}
      <ArticlesListClient articles={allArticles} />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-2xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Never Miss an Article
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Get weekly insights delivered to your inbox. Join our community of seekers.
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
              Sharing timeless wisdom from ancient Indian philosophy
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
