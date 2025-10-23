import { BookOpen, ArrowLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { CommentSection } from '@/components/CommentSection';

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Aryavarta`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-sandalwood-50">
      {/* Decorative top border */}
      <div className="h-2 bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600"></div>
      
      {/* Header */}
      <header className="border-b border-saffron-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent font-serif">
                आर्यवर्त
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Aryavarta</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Link */}
        <Link 
          href="/articles"
          className="inline-flex items-center gap-2 text-saffron-700 hover:text-vermillion-700 mb-8 transition font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header with Traditional Design */}
        <div className="mb-12 bg-gradient-to-br from-white to-saffron-50 rounded-2xl p-8 border-2 border-saffron-200 shadow-md">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar size={16} className="text-saffron-600" />
              {formattedDate}
            </span>
            <span className="text-saffron-400">•</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock size={16} className="text-saffron-600" />
              {article.readTime}
            </span>
            <span className="text-saffron-400">•</span>
            <span className="px-3 py-1 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 rounded-full text-xs font-semibold border border-saffron-300">
              {article.source}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight font-serif">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed font-serif italic">
            {article.excerpt}
          </p>
        </div>

        {/* Featured Image with Om Symbol */}
        <div className="w-full h-64 bg-gradient-to-br from-saffron-100 via-sandalwood-100 to-vermillion-100 rounded-2xl mb-12 flex items-center justify-center border-2 border-saffron-200 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-5 bg-mandala"></div>
          <div className="text-8xl text-saffron-300 font-serif relative z-10">ॐ</div>
        </div>

        {/* Article Body - Markdown Rendered with Sacred Typography */}
        <div className="prose prose-lg max-w-none font-serif">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Tags with Sacred Design */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-saffron-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 text-saffron-800 rounded-full text-sm font-semibold border border-saffron-300 hover:scale-105 transition-transform"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="mt-12">
          <CommentSection author={article.author} />
        </div>
      </article>

      {/* Footer with Traditional Design */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20 border-t-2 border-saffron-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif block">आर्यवर्त</span>
                <span className="text-xs text-gray-400">Aryavarta</span>
              </div>
            </Link>
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
