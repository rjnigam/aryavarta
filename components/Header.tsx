'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import UserMenu from './UserMenu';

export function Header() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/articles', label: 'Articles' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-b border-saffron-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 6, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg transition-all"
          >
            <BookOpen className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent font-serif group-hover:scale-105 transition-transform inline-block">
              आर्यवर्त
            </h1>
            <p className="text-xs text-gray-500 -mt-1 group-hover:text-saffron-600 transition-colors">Aryavarta</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link 
                href={item.href} 
                className={`relative text-gray-700 hover:text-saffron-700 transition font-medium group ${
                  isActive(item.href) ? 'text-saffron-700' : ''
                }`}
              >
                {item.label}
                <span 
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-saffron-600 to-vermillion-600 group-hover:w-full transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : ''
                  }`}
                />
              </Link>
            </motion.div>
          ))}
          
          {/* User Menu with Auth */}
          <UserMenu />
        </nav>
      </div>
    </motion.header>
  );
}
