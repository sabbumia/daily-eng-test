// app/tests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestDetails {
  id: number;
  date: string;
  completed: boolean;
  score: number;
  totalWords: number;
  attemptedAt?: string;
}

interface TestStats {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number;
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestDetails[]>([]);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetchTestsData(token);
  }, [router]);

  const fetchTestsData = async (token: string) => {
    try {
      const response = await fetch('/api/tests/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/signin');
        return;
      }

      const data = await response.json();
      setTests(data.tests);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    if (filter === 'completed') return test.completed;
    if (filter === 'pending') return !test.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-6 text-gray-400 text-lg">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            All <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">Tests</span>
          </h1>
          <p className="text-gray-400 text-lg">Complete overview of your vocabulary test history</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-purple-300">Total Attempts</p>
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalAttempts}</p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-emerald-300">Average Score</p>
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.averageScore.toFixed(1)}/10</p>
            </div>

            <div className="group bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-amber-300">Highest Score</p>
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.highestScore}/10</p>
            </div>

            <div className="group bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-300">Completion Rate</p>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{Math.round(stats.completionRate)}%</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 mb-8 inline-flex gap-2 border border-white/10">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Tests ({tests.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Completed ({tests.filter(t => t.completed).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Pending ({tests.filter(t => !t.completed).length})
          </button>
        </div>

        {/* Tests List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Words</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Performance</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-purple-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTests.length > 0 ? (
                  filteredTests.map((test, index) => (
                    <tr
                      key={test.id}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {new Date(test.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        {test.attemptedAt && (
                          <div className="text-xs text-gray-400 mt-1">
                            Attempted: {new Date(test.attemptedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {test.completed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {test.completed ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${
                              test.score >= 8 ? 'text-emerald-400' : test.score >= 6 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {test.score}
                            </span>
                            <span className="text-gray-400">/10</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{test.totalWords} words</span>
                      </td>
                      <td className="px-6 py-4">
                        {test.completed ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[120px] bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  test.score >= 8
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                    : test.score >= 6
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-red-500 to-red-400'
                                }`}
                                style={{ width: `${(test.score / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400 w-12 text-right">
                              {Math.round((test.score / 10) * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not attempted</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/tests/${test.id}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                            test.completed
                              ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                          }`}
                        >
                          {test.completed ? 'View Results' : 'Start Test'}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg">No tests found for this filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}