// app/saved-words/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

interface SavedWord {
  id: number;
  word: string;
  meaning: string;
  notes: string | null;
  createdAt: string;
}

export default function SavedWordsPage() {
  const router = useRouter();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWord, setEditingWord] = useState<SavedWord | null>(null);
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    fetchWords(token);
  }, [router]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = words.filter(
        w =>
          w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWords(filtered);
    } else {
      setFilteredWords(words);
    }
  }, [searchQuery, words]);

  const fetchWords = async (token: string) => {
    try {
      const response = await fetch('/api/saved-words', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/signin');
        return;
      }

      const data = await response.json();
      setWords(data.words);
      setFilteredWords(data.words);
    } catch (error) {
      console.error('Error fetching words:', error);
      toast.error('Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/saved-words', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setWords([data.word, ...words]);
        setFormData({ word: '', meaning: '', notes: '' });
        setShowAddModal(false);
        toast.success('Word added successfully!');
      } else {
        toast.error(data.error || 'Failed to add word');
      }
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error('Failed to add word');
    }
  };

  const handleUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/saved-words/${editingWord.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setWords(words.map(w => w.id === editingWord.id ? data.word : w));
        setFormData({ word: '', meaning: '', notes: '' });
        setEditingWord(null);
        toast.success('Word updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update word');
      }
    } catch (error) {
      console.error('Error updating word:', error);
      toast.error('Failed to update word');
    }
  };

  const handleDeleteWord = async (id: number) => {
    // Show custom confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-white font-semibold">Are you sure you want to delete this word?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(id);
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#1a1a1a',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '320px',
      },
    });
  };

  const confirmDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/saved-words/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWords(words.filter(w => w.id !== id));
        toast.success('Word deleted successfully!');
      } else {
        toast.error('Failed to delete word');
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      toast.error('Failed to delete word');
    }
  };

  const openEditModal = (word: SavedWord) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      meaning: word.meaning,
      notes: word.notes || '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-6 text-gray-400 text-lg">Loading your vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 top-1/2 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 -bottom-48 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  Saved Words
                </span>
              </h1>
              <p className="text-gray-400 mt-1">Build and manage your vocabulary collection</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setFormData({ word: '', meaning: '', notes: '' });
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Word
          </button>
        </div>

        {/* Search and Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search your vocabulary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10"
              />
              <svg
                className="absolute left-5 top-4.5 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Total Words Card */}
          <div className="group relative bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-indigo-500/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300 font-medium mb-1">Total Words</p>
                <p className="text-4xl font-bold text-white">{words.length}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:shadow-indigo-500/70 transition-all duration-300 group-hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Words Grid */}
        {filteredWords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 transform hover:shadow-2xl hover:shadow-purple-500/30"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        {word.word}
                      </h3>
                      <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(word)}
                        className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 transition-all duration-300 hover:scale-110 transform"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 hover:scale-110 transform"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{word.meaning}</p>
                  
                  {word.notes && (
                    <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
                      <p className="text-sm text-gray-400 italic">
                        💡 {word.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(word.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-16 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchQuery ? 'No matches found' : 'No saved words yet'}
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start building your vocabulary collection today!'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/50 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Word
              </button>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingWord) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-md w-full p-8 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {editingWord ? 'Edit Word' : 'Add New Word'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingWord(null);
                    setFormData({ word: '', meaning: '', notes: '' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={editingWord ? handleUpdateWord : handleAddWord}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Word *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.word}
                      onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10"
                      placeholder="e.g., Serendipity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Meaning *
                    </label>
                    <textarea
                      required
                      value={formData.meaning}
                      onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10 resize-none"
                      placeholder="e.g., The occurrence of events by chance in a happy way"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 hover:bg-white/10 resize-none"
                      placeholder="Add context, examples, or personal notes..."
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWord(null);
                      setFormData({ word: '', meaning: '', notes: '' });
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 transform"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 transform shadow-lg shadow-purple-600/50"
                  >
                    {editingWord ? 'Update' : 'Add'} Word
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}