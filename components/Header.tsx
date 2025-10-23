import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-saffron-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-12 h-12 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent font-serif">
              आर्यवर्त
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Aryavarta</p>
          </div>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/about" className="text-gray-700 hover:text-saffron-700 transition font-medium">
            About
          </Link>
          <Link href="/articles" className="text-gray-700 hover:text-saffron-700 transition font-medium">
            Articles
          </Link>
          <Link href="/subscribe" className="text-gray-700 hover:text-saffron-700 transition font-medium">
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
