// app/grammar/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

interface GrammarError {
  original: string;
  corrected: string;
  reason: string;
  position: number;
}

interface Word {
  word: string;
  meaning: string;
  position: number;
}

interface GrammarResult {
  originalText: string;
  correctedText: string;
  translatedText: string;
  hasErrors: boolean;
  errors: GrammarError[];
  words: Word[];
}

export default function GrammarPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingWords, setSavingWords] = useState<Set<number>>(new Set());
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  const handleCheck = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.status === 401) {
        router.push('/signin');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        toast.error(data.error || 'Failed to check grammar');
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast.error('An error occurred while checking grammar');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async (word: Word, index: number) => {
    setSavingWords(prev => new Set(prev).add(index));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/saved-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word: word.word,
          meaning: word.meaning,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSavedWords(prev => new Set(prev).add(word.word));
        toast.success('Word saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save word');
      }
    } catch (error) {
      console.error('Save word error:', error);
      toast.error('An error occurred while saving word');
    } finally {
      setSavingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 mt-12">   
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Grammar Correction
          </h1>
          <p className="text-xl text-gray-400">
            Check your grammar and learn from your mistakes
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 mb-8">
          <label className="block text-lg font-semibold mb-4 text-cyan-300">
            Enter English Text
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your English text here..."
            className="w-full h-40 bg-black/50 border border-cyan-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 resize-none"
            disabled={loading}
          />
          <button
            onClick={handleCheck}
            disabled={loading || !inputText.trim()}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-600/50 hover:shadow-cyan-600/70 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Checking...
              </span>
            ) : (
              'Check Grammar'
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Grammar Status */}
            <div className={`bg-gradient-to-br ${
              result.hasErrors 
                ? 'from-red-900/40 to-orange-900/40 border-red-500/20' 
                : 'from-green-900/40 to-emerald-900/40 border-green-500/20'
            } backdrop-blur-xl rounded-2xl p-8 border`}>
              <div className="flex items-center gap-4 mb-6">
                {result.hasErrors ? (
                  <>
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-red-300">Grammar Errors Found</h2>
                      <p className="text-gray-300">{result.errors.length} error{result.errors.length > 1 ? 's' : ''} detected</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-green-300">Perfect Grammar!</h2>
                      <p className="text-gray-300">No errors detected in your text</p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Original Text:</h3>
                  <p className="text-xl text-white bg-black/30 rounded-lg p-4 border border-white/10">
                    {result.originalText}
                  </p>
                </div>

                {result.hasErrors && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Corrected Text:</h3>
                    <p className="text-xl text-green-300 bg-black/30 rounded-lg p-4 border border-green-500/30 font-semibold">
                      {result.correctedText}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Grammar Errors Detail */}
            {result.hasErrors && result.errors.length > 0 && (
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/20">
                <h2 className="text-2xl font-bold mb-6 text-orange-300">Error Details</h2>
                
                <div className="space-y-4">
                  {result.errors.map((error, index) => (
                    <div
                      key={index}
                      className="bg-black/40 rounded-xl p-5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-red-400 line-through text-lg font-semibold">
                              {error.original}
                            </span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="text-green-400 text-lg font-semibold">
                              {error.corrected}
                            </span>
                          </div>
                          <p className="text-gray-300 text-base">
                            <span className="text-orange-300 font-semibold">Reason:</span> {error.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bangla Translation */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300">Bangla Translation</h2>
              <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 bg-black/30 rounded-lg p-4 border border-indigo-500/30 font-semibold">
                {result.translatedText}
              </p>
            </div>

            {/* Word Meanings */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">Word Meanings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.words.map((word, index) => (
                  <div
                    key={index}
                    className="group bg-black/40 rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 capitalize">
                          {word.word}
                        </h3>
                        <p className="text-lg text-blue-200">
                          {word.meaning}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleSaveWord(word, index)}
                        disabled={savingWords.has(index) || savedWords.has(word.word)}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          savedWords.has(word.word)
                            ? 'bg-green-600 cursor-default'
                            : 'bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-110'
                        } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                        title={savedWords.has(word.word) ? 'Already saved' : 'Save word'}
                      >
                        {savingWords.has(index) ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : savedWords.has(word.word) ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}