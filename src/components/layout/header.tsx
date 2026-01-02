'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/firebase/client';
import SearchRenterModal from '@/components/search/SearchRenterModal';
import { UserNav } from '@/components/layout/UserNav';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { user, loading } = useAuth();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-[#1A2540]">
            Rent<span className="text-[#D4A017]">FAX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 text-gray-700 font-medium">
            <Link href="/#features" className="hover:text-[#D4A017] transition">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-[#D4A017] transition">
              Pricing
            </Link>
            <Link href="/partners" className="hover:text-[#D4A017] transition">
              Partners
            </Link>
            <Link href="/blog" className="hover:text-[#D4A017] transition">
              Blog
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-9 w-32 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="px-5 py-2 bg-[#1A2540] text-white rounded-lg shadow-md font-semibold hover:bg-[#2a3660] transition"
                >
                  Start Screening
                </button>
                <UserNav />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Log In
                </Link>
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="px-5 py-2 bg-[#1A2540] text-white rounded-lg shadow-md font-semibold hover:bg-[#2a3660] transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#1A2540]">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden h-screen w-full bg-white/90 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center h-full -mt-16">
              <nav className="flex flex-col items-center space-y-8 text-xl font-medium text-gray-800">
                <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="hover:text-[#D4A017] transition">
                  Features
                </Link>
                <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="hover:text-[#D4A017] transition">
                  Pricing
                </Link>
                <Link href="/partners" onClick={() => setIsMenuOpen(false)} className="hover:text-[#D4A017] transition">
                  Partners
                </Link>
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="hover:text-[#D4A017] transition">
                  Blog
                </Link>
              </nav>
              <div className="flex flex-col items-center space-y-6 mt-12">
                 {user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsSearchModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="px-8 py-3 w-64 text-center bg-[#1A2540] text-white rounded-lg shadow-md font-semibold hover:bg-[#2a3660] transition"
                    >
                      Start Screening
                    </button>
                    <UserNav />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-8 py-3 w-64 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                      Log In
                    </Link>
                    <button
                      onClick={() => {
                        setIsSearchModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="px-8 py-3 w-64 text-center bg-[#1A2540] text-white rounded-lg shadow-md font-semibold hover:bg-[#2a3660] transition"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchRenterModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
}
