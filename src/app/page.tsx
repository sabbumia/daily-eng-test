// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  PenTool,
  Languages,
  FileText,
  BookMarked,
  TrendingUp,
  Award,
  Clock,
  Users,
  CheckCircle,
  Star,
  Zap,
  Target,
  Brain,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token) {
      setLogin(true);
      return;
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-5 py-2.5 rounded-full text-sm font-semibold border border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 transform">
                ✨ AI-Powered Learning Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
              Master English
              <span className="block bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Vocabulary
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Take daily AI-generated vocabulary tests, track your progress, and
              achieve fluency with personalized learning experiences
            </p>

            {!login && (
              <div
                className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  href="/signup"
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 transform flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </Link>
                <Link
                  href="/signin"
                  className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 transform"
                >
                  Sign In
                </Link>
              </div>
            )}
            {login && (
              <div
                className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  href="/dashboard"
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 transform flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                </Link>
              </div>
            )}

            <p
              className="mt-8 text-gray-500 text-sm animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              No credit card required • Start learning in seconds
            </p>
          </div>

          {/* Stats Section */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400 text-sm">Active Learners</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                5000+
              </div>
              <div className="text-gray-400 text-sm">Vocabulary Words</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Accelerated Learning
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to master English vocabulary in one
              comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                  AI-Powered Tests
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Daily vocabulary tests intelligently generated by advanced
                  LLM, tailored to your learning level
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50 group-hover:shadow-indigo-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors duration-300">
                  Track Progress
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Monitor your scores and improvement over time with detailed
                  analytics and comprehensive insights
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-pink-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-500 to-pink-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 group-hover:shadow-pink-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pink-300 transition-colors duration-300">
                  Daily Challenge
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  New test every day at midnight to keep you learning
                  consistently and building strong habits
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-cyan-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-all duration-300 group-hover:scale-110 transform">
                  <BookMarked className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  Save & Review
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Save your favorite words and create custom vocabulary lists to
                  study anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Tools Section */}
      <section className="relative py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Complete Learning
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Toolkit
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Access all the tools you need to enhance your English vocabulary
              skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/10 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Dashboard</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                View your learning analytics, track progress, and monitor your
                vocabulary growth with interactive charts
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                  Analytics
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                  Progress
                </span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                  Stats
                </span>
              </div>
            </div>

            {/* Tests */}
            <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/10 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50">
                <PenTool className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Vocabulary Tests
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Take AI-generated daily tests with 20 questions, get instant
                feedback, and improve your vocabulary
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium">
                  Daily Tests
                </span>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium">
                  AI-Generated
                </span>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium">
                  Instant Results
                </span>
              </div>
            </div>

            {/* Grammar Checker */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/10 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Grammar Checker
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Correct your English grammar instantly with AI-powered
                suggestions and explanations
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                  AI Corrections
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                  Real-time
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                  Explanations
                </span>
              </div>
            </div>

            {/* Translation */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Translation
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Translate text between English and Bengali with accurate
                AI-powered translations
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                  Bi-directional
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                  Accurate
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                  Fast
                </span>
              </div>
            </div>

            {/* Saved Words */}
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/50">
                <BookMarked className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Saved Words
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Build your personal vocabulary collection and review saved words
                anytime for better retention
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                  Collections
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                  Review
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                  Practice
                </span>
              </div>
            </div>

            {/* More Coming Soon */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 transform">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                More Coming Soon
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                We're constantly adding new features to help you master English
                vocabulary faster
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                  Exciting
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                  Innovative
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                  Powerful
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start your vocabulary learning journey in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 text-white font-bold text-xl">
                  1
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Sign Up Free
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Create your account in seconds. No credit card required,
                    just your email and you're ready to start learning.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 text-white font-bold text-xl">
                  2
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Take Daily Tests
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Complete AI-generated vocabulary tests daily. Each test is
                    personalized to your level and learning pace.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/50 text-white font-bold text-xl">
                  3
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Track Progress
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Monitor your improvement with detailed analytics. Watch your
                    vocabulary grow day by day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Daily Test?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of learners who are improving their English
              vocabulary every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Adaptive Learning
                </h4>
                <p className="text-gray-400">
                  Tests adapt to your skill level, ensuring optimal learning
                  progression
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Proven Results
                </h4>
                <p className="text-gray-400">
                  95% of users report significant vocabulary improvement in 30
                  days
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Engaging Experience
                </h4>
                <p className="text-gray-400">
                  Interactive tests and instant feedback make learning fun and
                  effective
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Community Support
                </h4>
                <p className="text-gray-400">
                  Join a thriving community of learners and achieve your goals
                  together
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Master
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                English Vocabulary?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners today and start your journey to English
              fluency
            </p>
            {!login && (<div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 transform inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Learning Free
              </Link>
              <Link
                href="/signin"
                className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 transform"
              >
                Sign In
              </Link>
            </div>
            )}
            {login && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 transform inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Learning
              </Link>
             
            </div>
            )}
            <p className="mt-6 text-gray-400 text-sm">
              No credit card required • Cancel anytime • Start in seconds
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
