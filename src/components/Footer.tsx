// src/components/Footer.tsx
"use client";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  Languages,
  FileText,
  BookMarked,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 -bottom-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 -bottom-48 -right-48"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Daily Test
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Master English vocabulary with AI-powered daily tests, grammar
              correction, translation tools, and personalized learning
              experiences.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="mailto:support@dailytest.com"
                className="w-10 h-10 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/tests"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <PenTool className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Vocabulary Tests
                </Link>
              </li>
              <li>
                <Link
                  href="/grammar"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Grammar Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/translate"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <Languages className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Translation
                </Link>
              </li>
              <li>
                <Link
                  href="/saved-words"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <BookMarked className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Saved Words
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                >
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Daily Test. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Made with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              for learners worldwide
            </p>
          </div>
        </div> */}
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Daily Test. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                Made with
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                for learners worldwide
              </p>
              <span className="hidden md:inline text-gray-600">|</span>
              <p>
                Developed by{" "}
                <a
                  href="https://sazzadadib.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-pink-400 transition-colors"
                >
                  Sazzad Hossain
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
