import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image?: string;
  tags?: string[];
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl overflow-hidden border-2 border-saffron-200 hover:border-vermillion-400 hover:shadow-2xl transition-all hover:scale-[1.02] duration-300"
    >
      {/* Image section */}
      {article.image && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-saffron-100 to-sandalwood-100">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Content section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 bg-saffron-100 text-saffron-700 rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-saffron-700 transition font-serif leading-tight">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed flex-1 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-saffron-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-saffron-600" />
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-saffron-600" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
