'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, Filter, ChevronDown } from 'lucide-react';
import type { ArticleMetadata } from '@/lib/articles';

interface ArticlesListClientProps {
  articles: ArticleMetadata[];
}

export function ArticlesListClient({ articles }: ArticlesListClientProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique years and months from articles
  const { years, months } = useMemo(() => {
    const yearSet = new Set<string>();
    
    articles.forEach(article => {
      const date = new Date(article.date);
      yearSet.add(date.getFullYear().toString());
    });
    
    return {
      years: Array.from(yearSet).sort((a, b) => Number(b) - Number(a)),
      months: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December']
    };
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(article => {
        const date = new Date(article.date);
        return date.getFullYear().toString() === selectedYear;
      });
    }

    // Apply month filter
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(article => {
        const date = new Date(article.date);
        return date.toLocaleString('default', { month: 'long' }) === selectedMonth;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [articles, selectedYear, selectedMonth, sortOrder]);

  return (
    <>
      {/* Filter and Sort Controls */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-saffron-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-saffron-50 text-saffron-800 rounded-lg hover:bg-saffron-100 transition font-semibold"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <span className="text-gray-600 text-sm">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="px-4 py-2 border border-saffron-200 rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 border border-saffron-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    >
                      <option value="all">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-2 border border-saffron-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    >
                      <option value="all">All Months</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(selectedYear !== 'all' || selectedMonth !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedYear('all');
                      setSelectedMonth('all');
                    }}
                    className="mt-4 text-sm text-saffron-700 hover:text-saffron-900 font-semibold"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md border border-saffron-100">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-xl text-gray-600">No articles found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedMonth('all');
                }}
                className="mt-4 text-saffron-700 hover:text-saffron-900 font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="block bg-white rounded-xl shadow-md border border-saffron-100 hover:shadow-xl hover:border-saffron-300 transition-all p-6 group"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-saffron-700 transition font-serif">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(article.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
