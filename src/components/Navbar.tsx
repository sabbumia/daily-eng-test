// src/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Home, BookOpen, Languages, FileText, BookMarked, PenTool, Mic } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]); // Re-check on route change

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
    toggleMenu();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full text-white shadow-lg transition-all duration-300 z-50 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-purple-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-tight hover:text-purple-300 transition-all duration-300 flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              </div>
              <span className="sm:inline bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Daily Test
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium hover:bg-purple-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                isActive('/') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 text-sm font-medium hover:bg-indigo-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/dashboard') ? 'bg-indigo-500/20 text-indigo-300' : ''
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/tests"
                  className={`px-4 py-2 text-sm font-medium hover:bg-pink-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/tests') ? 'bg-pink-500/20 text-pink-300' : ''
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  Tests
                </Link>

                <Link
                  href="/grammar"
                  className={`px-4 py-2 text-sm font-medium hover:bg-cyan-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/grammar') ? 'bg-cyan-500/20 text-cyan-300' : ''
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Grammar
                </Link>

                <Link
                  href="/translate"
                  className={`px-4 py-2 text-sm font-medium hover:bg-emerald-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/translate') ? 'bg-emerald-500/20 text-emerald-300' : ''
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  Translate
                </Link>

                <Link
                  href="/speaking-practice"
                  className={`px-4 py-2 text-sm font-medium hover:bg-blue-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/speaking-practice') ? 'bg-blue-500/20 text-blue-300' : ''
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  Speaking
                </Link>

                <Link
                  href="/saved-words"
                  className={`px-4 py-2 text-sm font-medium hover:bg-amber-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 ${
                    isActive('/saved-words') ? 'bg-amber-500/20 text-amber-300' : ''
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  Saved Words
                </Link>

                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium hover:bg-red-500/20 hover:scale-105 transform transition-all duration-300 rounded-lg flex items-center gap-2 text-red-300 hover:text-red-200 ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-6 py-2 text-sm font-medium hover:bg-white/10 hover:scale-105 transform transition-all duration-300 rounded-lg ml-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transform transition-all duration-300 rounded-xl shadow-lg shadow-purple-600/50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden animate-slideDown">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-xl rounded-lg mb-4 border border-purple-500/20">
              <Link
                href="/"
                className={`block px-3 py-2 text-base font-medium hover:bg-purple-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                  isActive('/') ? 'bg-purple-500/20 text-purple-300' : ''
                }`}
                onClick={toggleMenu}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 text-base font-medium hover:bg-indigo-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/dashboard') ? 'bg-indigo-500/20 text-indigo-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <BookOpen className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/tests"
                    className={`block px-3 py-2 text-base font-medium hover:bg-pink-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/tests') ? 'bg-pink-500/20 text-pink-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <PenTool className="w-4 h-4" />
                    Tests
                  </Link>

                  <Link
                    href="/grammar"
                    className={`block px-3 py-2 text-base font-medium hover:bg-cyan-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/grammar') ? 'bg-cyan-500/20 text-cyan-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <FileText className="w-4 h-4" />
                    Grammar Correction
                  </Link>

                  <Link
                    href="/translate"
                    className={`block px-3 py-2 text-base font-medium hover:bg-emerald-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/translate') ? 'bg-emerald-500/20 text-emerald-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <Languages className="w-4 h-4" />
                    Translate
                  </Link>

                  <Link
                    href="/speaking-practice"
                    className={`block px-3 py-2 text-base font-medium hover:bg-blue-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/speaking-practice') ? 'bg-blue-500/20 text-blue-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <Mic className="w-4 h-4" />
                    Speaking Practice
                  </Link>

                  <Link
                    href="/saved-words"
                    className={`block px-3 py-2 text-base font-medium hover:bg-amber-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                      isActive('/saved-words') ? 'bg-amber-500/20 text-amber-300' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    <BookMarked className="w-4 h-4" />
                    Saved Words
                  </Link>

                  <div className="border-t border-purple-500/20 my-2"></div>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-red-500/20 rounded-lg transition-colors duration-300 flex items-center gap-2 text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-purple-500/20 my-2"></div>
                  
                  <Link
                    href="/signin"
                    className="block px-3 py-2 text-base font-medium hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-colors duration-300 text-center shadow-lg shadow-purple-600/50"
                    onClick={toggleMenu}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}