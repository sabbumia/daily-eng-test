// // app/dashboard/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface TestProgress {
//   id: number;
//   date: string;
//   completed: boolean;
//   score: number;
// }

// interface DashboardData {
//   nextTest: {
//     id: number;
//     testDate: string;
//   } | null;
//   progress: TestProgress[];
//   totalTests: number;
//   completedCount: number;
//   registrationDate?: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');

//     if (!token) {
//       router.push('/signin');
//       return;
//     }

//     if (userData) {
//       setUser(JSON.parse(userData));
//     }

//     fetchDashboardData(token);
//   }, [router]);

//   const fetchDashboardData = async (token: string) => {
//     try {
//       const response = await fetch('/api/tests/available', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         router.push('/signin');
//         return;
//       }

//       const data = await response.json();
//       setData(data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
//           <p className="mt-6 text-gray-400 text-lg">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
//       </div>

//       <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
//         {/* Welcome Section */}
//         <div className="mb-8 animate-fade-in-up">
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
//             Welcome back, <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">{user?.name}!</span>
//           </h1>
//           <p className="text-gray-400 text-lg">Track your progress and continue your learning journey</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
//           {/* Total Tests */}
//           <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-purple-500/30">
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-purple-300 mb-2">Total Tests</p>
//                 <p className="text-4xl font-bold text-white">{data?.totalTests || 0}</p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
//                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Completed Tests */}
//           <div className="group relative bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-emerald-500/30">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-emerald-300 mb-2">Completed</p>
//                 <p className="text-4xl font-bold text-white">{data?.completedCount || 0}</p>
//               </div>
//               <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-500/70 transition-all duration-300 group-hover:scale-110 transform">
//                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Success Rate */}
//           <div className="group relative bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-amber-500/30">
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-amber-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-amber-300 mb-2">Success Rate</p>
//                 <p className="text-4xl font-bold text-white">
//                   {data && data.totalTests > 0 
//                     ? Math.round((data.completedCount / data.totalTests) * 100)
//                     : 0}%
//                 </p>
//               </div>
//               <div className="bg-gradient-to-br from-amber-500 to-amber-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/50 group-hover:shadow-amber-500/70 transition-all duration-300 group-hover:scale-110 transform">
//                 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Next Test Card */}
//         {data?.nextTest && (
//           <div className="relative bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-pink-600/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/50 p-8 mb-8 border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
//             <div className="relative">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
//                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <h2 className="text-2xl md:text-3xl font-bold text-white">Ready for Today's Test?</h2>
//               </div>
//               <p className="text-purple-100 mb-6 text-lg">
//                 📅 {new Date(data.nextTest.testDate).toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </p>
//               <Link
//                 href={`/test/${data.nextTest.id}`}
//                 className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/20"
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                 </svg>
//                 Start Test Now
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Test History */}
//         <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
//           <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//               <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//               Test History
//             </h2>
//             {data && data.registrationDate && (
//               <p className="text-sm text-gray-400 mt-2">
//                 Tracking since {new Date(data.registrationDate).toLocaleDateString('en-US', {
//                   month: 'long',
//                   day: 'numeric',
//                   year: 'numeric'
//                 })}
//               </p>
//             )}
//           </div>
//           <div className="p-6">
//             {data && data.progress.length > 0 ? (
//               <div className="space-y-4">
//                 {data.progress.map((test, index) => (
//                   <div
//                     key={test.id}
//                     className={`group relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-102 transform ${
//                       test.completed
//                         ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20'
//                         : 'border-gray-700/30 bg-gradient-to-r from-gray-900/20 to-gray-800/10 hover:border-gray-600/50'
//                     }`}
//                     style={{ animationDelay: `${0.1 * index}s` }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 transform ${
//                           test.completed 
//                             ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/50' 
//                             : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-500/30'
//                         }`}>
//                           {test.completed ? (
//                             <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                             </svg>
//                           ) : (
//                             <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                             </svg>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-bold text-white text-lg">
//                             {new Date(test.date).toLocaleDateString('en-US', {
//                               weekday: 'short',
//                               month: 'short',
//                               day: 'numeric',
//                               year: 'numeric',
//                             })}
//                           </p>
//                           <p className={`text-sm mt-1 ${test.completed ? 'text-emerald-300' : 'text-gray-400'}`}>
//                             {test.completed ? `✓ Score: ${test.score}/10` : '⏳ Not completed yet'}
//                           </p>
//                         </div>
//                       </div>
//                       {test.completed && (
//                         <div className="text-right">
//                           <div className={`text-3xl font-bold ${
//                             test.score >= 8 ? 'text-emerald-400' : test.score >= 6 ? 'text-amber-400' : 'text-red-400'
//                           }`}>
//                             {Math.round((test.score / 10) * 100)}%
//                           </div>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {test.score >= 8 ? '🎉 Excellent!' : test.score >= 6 ? '👍 Good Job!' : '💪 Keep Going!'}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                   <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">No tests available yet</h3>
//                 <p className="text-gray-400">Your test history will appear here once you start taking tests</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }







// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestProgress {
  id: number;
  date: string;
  completed: boolean;
  score: number;
}

interface SavedWord {
  id: number;
  word: string;
  meaning: string;
  createdAt: string;
}

interface DashboardData {
  nextTest: {
    id: number;
    testDate: string;
  } | null;
  progress: TestProgress[];
  totalTests: number;
  completedCount: number;
  registrationDate?: string;
  savedWordsCount: number;
  averageScore: number;
  recentSavedWords: SavedWord[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/signin');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch('/api/dashboard', {
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
      setData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-6 text-gray-400 text-lg">Loading your dashboard...</p>
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
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-400 text-lg">Master English vocabulary, translation, and grammar</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Total Tests */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300 mb-2">Total Tests</p>
                <p className="text-4xl font-bold text-white">{data?.totalTests || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Tests */}
          <div className="group relative bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-emerald-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300 mb-2">Completed</p>
                <p className="text-4xl font-bold text-white">{data?.completedCount || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="group relative bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-amber-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-amber-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-300 mb-2">Average Score</p>
                <p className="text-4xl font-bold text-white">
                  {data?.averageScore ? data.averageScore.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/50 group-hover:shadow-amber-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Saved Words */}
          <div className="group relative bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-cyan-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-300 mb-2">Saved Words</p>
                <p className="text-4xl font-bold text-white">{data?.savedWordsCount || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {/* English to Bangla */}
          <Link
            href="/translate"
            className="group relative bg-gradient-to-br from-rose-900/40 to-rose-800/20 backdrop-blur-xl rounded-2xl p-6 border border-rose-500/20 hover:border-rose-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-rose-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/0 to-rose-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-500 to-rose-700 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-rose-500/50 group-hover:shadow-rose-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">English to Bangla</h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Translate English words and sentences to Bangla</p>
            </div>
          </Link>

          {/* Grammar Check */}
          <Link
            href="/grammar"
            className="group relative bg-gradient-to-br from-violet-900/40 to-violet-800/20 backdrop-blur-xl rounded-2xl p-6 border border-violet-500/20 hover:border-violet-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-violet-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-500 to-violet-700 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/50 group-hover:shadow-violet-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">Grammar Check</h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Check and correct your English grammar instantly</p>
            </div>
          </Link>

          {/* Saved Words */}
          <Link
            href="/saved-words"
            className="group relative bg-gradient-to-br from-teal-900/40 to-teal-800/20 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-teal-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/0 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/50 group-hover:shadow-teal-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">My Vocabulary</h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">View and manage your saved words collection</p>
            </div>
          </Link>
        </div>

        {/* Next Test Card */}
        {data?.nextTest && (
          <div className="relative bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-pink-600/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/50 p-8 mb-8 border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Ready for Today's Vocabulary Test?</h2>
              </div>
              <p className="text-purple-100 mb-6 text-lg">
                📅 {new Date(data.nextTest.testDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/tests/${data.nextTest.id}`}
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Start Test Now
                </Link>
                <Link
                  href="/tests"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  View All Tests
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Test History */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Recent Tests
              </h2>
              <Link
                href="/tests"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-6">
              {data && data.progress.length > 0 ? (
                <div className="space-y-4">
                  {data.progress.slice(0, 5).map((test, index) => (
                    <div
                      key={test.id}
                      className={`group relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-102 transform ${
                        test.completed
                          ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20'
                          : 'border-gray-700/30 bg-gradient-to-r from-gray-900/20 to-gray-800/10 hover:border-gray-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 transform ${
                            test.completed 
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/50' 
                              : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-500/30'
                          }`}>
                            {test.completed ? (
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {new Date(test.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className={`text-sm mt-1 ${test.completed ? 'text-emerald-300' : 'text-gray-400'}`}>
                              {test.completed ? `Score: ${test.score}/10` : 'Not completed'}
                            </p>
                          </div>
                        </div>
                        {test.completed && (
                          <div className={`text-2xl font-bold ${
                            test.score >= 8 ? 'text-emerald-400' : test.score >= 6 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {Math.round((test.score / 10) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No tests yet</h3>
                  <p className="text-gray-400 text-sm">Start your first test to track progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Recently Saved Words */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Saved Words
              </h2>
              <Link
                href="/saved-words"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-6">
              {data && data.recentSavedWords && data.recentSavedWords.length > 0 ? (
                <div className="space-y-3">
                  {data.recentSavedWords.slice(0, 5).map((word, index) => (
                    <div
                      key={word.id}
                      className="group p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-teal-900/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-102"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-1">{word.word}</h4>
                          <p className="text-gray-400 text-sm line-clamp-2">{word.meaning}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No saved words</h3>
                  <p className="text-gray-400 text-sm">Save words while taking tests to build your vocabulary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}