// app/tests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface WordTest {
  word: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

interface TestData {
  test: {
    id: number;
    date: string;
    words: WordTest[];
  };
  alreadyCompleted: boolean;
  previousScore?: number;
}

interface TestResult {
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  const [savingWord, setSavingWord] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetchTest(token);
  }, [testId, router]);

  const fetchTest = async (token: string) => {
    try {
      const response = await fetch(`/api/tests/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/signin');
        return;
      }

      if (response.status === 403) {
        const data = await response.json();
        setError(data.error);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTestData(data);
      setAnswers(new Array(data.test.words.length).fill(''));
    } catch (error) {
      console.error('Error fetching test:', error);
      setError('Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSaveWord = async (word: WordTest) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingWord(word.word);

    try {
      const response = await fetch('/api/saved-words', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word.word,
          meaning: word.correctAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSavedWordIds(prev => new Set(prev).add(word.word));
      } else {
        alert(data.error || 'Failed to save word');
      }
    } catch (error) {
      console.error('Error saving word:', error);
      alert('Failed to save word');
    } finally {
      setSavingWord(null);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (testData?.test.words.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(a => !a)) {
      alert('Please answer all questions before submitting');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-6 text-gray-400 text-lg">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse"></div>
        </div>
        <div className="relative max-w-md w-full mx-4">
          <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
            <p className="text-gray-300 mb-8 text-lg">{error}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pt-24">
          {/* Results Header */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl p-12 text-center mb-8 border border-purple-500/20 shadow-2xl shadow-purple-500/30">
            <div className="mb-6">
              {results.percentage >= 80 ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : results.percentage >= 60 ? (
                <div className="text-6xl mb-4">👏</div>
              ) : (
                <div className="text-6xl mb-4">💪</div>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Test Completed!</h1>
            <div className={`text-7xl font-bold mb-4 bg-gradient-to-r ${
              results.percentage >= 80 ? 'from-emerald-400 to-emerald-600' :
              results.percentage >= 60 ? 'from-amber-400 to-amber-600' :
              'from-red-400 to-red-600'
            } bg-clip-text text-transparent`}>
              {results.percentage.toFixed(1)}%
            </div>
            <p className="text-2xl text-purple-200 mb-6">
              Score: {results.score} / {results.totalQuestions}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border-2 border-purple-500/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                All Tests
              </Link>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Review Your Answers
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {results.results.map((result: TestResult, index: number) => (
                  <div
                    key={index}
                    className={`group p-6 rounded-xl border-2 transition-all duration-300 ${
                      result.isCorrect
                        ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 hover:border-emerald-500/50'
                        : 'border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/10 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">
                        {index + 1}. {result.word}
                      </h3>
                      {result.isCorrect ? (
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-emerald-400 font-semibold">Correct</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-red-400 font-semibold">Incorrect</span>
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {!result.isCorrect && (
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 rounded-lg p-2 mt-0.5">
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-300 mb-1">Your answer:</p>
                            <p className="text-white text-lg">{result.userAnswer}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500/20 rounded-lg p-2 mt-0.5">
                          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-300 mb-1">Correct answer:</p>
                          <p className="text-white text-lg">{result.correctAnswer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testData) return null;

  const currentWord = testData.test.words[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.test.words.length) * 100;
  const answeredCount = answers.filter(a => a).length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-pink-600/90 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Vocabulary Test</h1>
                <p className="text-purple-100">
                  {new Date(testData.test.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-white text-sm mb-1">Question</div>
                <div className="text-3xl font-bold text-white">
                  {currentQuestion + 1}/{testData.test.words.length}
                </div>
                <div className="text-xs text-purple-200 mt-1">
                  {answeredCount} answered
                </div>
              </div>
            </div>
            <div className="relative w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-400 mb-2">TRANSLATE</div>
                  <h2 className="text-5xl font-bold text-white mb-4">{currentWord.word}</h2>
                  <p className="text-gray-400 text-lg">Select the correct Bangla meaning:</p>
                </div>
                <button
                  onClick={() => handleSaveWord(currentWord)}
                  disabled={savingWord === currentWord.word || savedWordIds.has(currentWord.word)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    savedWordIds.has(currentWord.word)
                      ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/30 cursor-not-allowed'
                      : 'bg-purple-500/20 text-purple-300 border-2 border-purple-500/30 hover:bg-purple-500/30 hover:scale-105'
                  }`}
                >
                  {savingWord === currentWord.word ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : savedWordIds.has(currentWord.word) ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentWord.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === option;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-300 hover:scale-102 ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-r from-purple-900/40 to-purple-800/20 shadow-lg shadow-purple-500/20'
                        : 'border-gray-700/50 bg-gradient-to-r from-gray-900/20 to-gray-800/10 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-purple-800/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-gray-700/50 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'
                        }`}
                      >
                        {isSelected ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          optionLetter
                        )}
                      </div>
                      <span className={`text-lg transition-colors ${
                        isSelected ? 'text-white font-medium' : 'text-gray-300'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-700 text-gray-300 font-semibold hover:bg-gray-700/30 hover:border-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-medium">
                    {answeredCount} of {testData.test.words.length} answered
                  </span>
                </div>
              </div>

              {currentQuestion === testData.test.words.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount !== testData.test.words.length}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Submit Test
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion]}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Quick Navigation
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {testData.test.words.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentQuestion === index
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/50 scale-110'
                    : answers[index]
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-gray-700/30 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 hover:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}