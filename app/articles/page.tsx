import { Header } from '@/components/Header';
import { getAllArticles } from '@/lib/articles';
import { ArticlesListClient } from '@/components/ArticlesListClient';
import { ConditionalSubscribeCTA } from '@/components/ConditionalSubscribeCTA';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { Sparkles } from 'lucide-react';

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

      {/* Conditional CTA Section - only shows for non-authenticated users */}
      <ConditionalSubscribeCTA />

      {/* Footer */}
      <ConditionalFooter />
    </main>
  );
}
