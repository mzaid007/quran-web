import React, { useState } from 'react';
import { X, Search, Bookmark, Compass, BookmarkCheck, ArrowRight } from 'lucide-react';
import type { SurahMeta, LastRead } from '../types';

interface SurahListModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: SurahMeta[];
  currentSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
  bookmarks: { surah: number; aya: number }[];
  lastRead: LastRead | null;
  onResumeLastRead: () => void;
}

export const SurahListModal: React.FC<SurahListModalProps> = ({
  isOpen,
  onClose,
  surahs,
  currentSurahNumber,
  onSelectSurah,
  bookmarks,
  lastRead,
  onResumeLastRead,
}) => {
  const [tab, setTab] = useState<'surah' | 'juz' | 'bookmark'>('surah');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSurahs = surahs.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.number.toString() === q ||
      s.name.toLowerCase().includes(q) ||
      s.revelationType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Read Qur'an
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Last Read Quick Resume Banner */}
        {lastRead && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Last Read Position
                </div>
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Surah {lastRead.surahName} • Ayah {lastRead.aya}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onResumeLastRead();
                onClose();
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-tealDark transition text-xs font-bold shadow-sm"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Surah name (e.g. Baqarah) or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-brand-cardDark border border-gray-200 dark:border-brand-borderDark rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs: SURAH | JUZ | BOOKMARK */}
        <div className="flex border-b border-gray-200 dark:border-brand-borderDark px-4 bg-gray-50/50 dark:bg-brand-cardDark/50">
          <button
            onClick={() => setTab('surah')}
            className={`py-3 px-4 text-xs font-bold tracking-wider transition border-b-2 ${
              tab === 'surah'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            SURAH ({surahs.length})
          </button>
          <button
            onClick={() => setTab('juz')}
            className={`py-3 px-4 text-xs font-bold tracking-wider transition border-b-2 ${
              tab === 'juz'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            JUZ (30)
          </button>
          <button
            onClick={() => setTab('bookmark')}
            className={`py-3 px-4 text-xs font-bold tracking-wider transition border-b-2 flex items-center gap-1 ${
              tab === 'bookmark'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            BOOKMARKS ({bookmarks.length})
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-brand-borderDark">
          {tab === 'surah' && (
            filteredSurahs.map((surah) => {
              const isSelected = surah.number === currentSurahNumber;
              return (
                <div
                  key={surah.number}
                  onClick={() => {
                    onSelectSurah(surah.number);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3.5 px-5 hover:bg-gray-50 dark:hover:bg-brand-cardDark cursor-pointer transition ${
                    isSelected ? 'bg-brand-teal/5 dark:bg-brand-teal/15 font-medium' : ''
                  }`}
                >
                  {/* Left: Number & Titles */}
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-brand-teal/20">
                      {surah.number}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {surah.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          surah.revelationType === 'Meccan' ? 'bg-amber-400' : 'bg-emerald-500'
                        }`} />
                        <span>{surah.revelationType}</span>
                        <span>•</span>
                        <span>{surah.totalVerses} Verses</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Authentic Extracted Calligraphy Image Badge */}
                  <div className="h-9 flex items-center">
                    <img
                      src={`/snames/${surah.image}`}
                      alt={surah.name}
                      className="h-8 max-w-[130px] object-contain dark:invert dark:brightness-125 opacity-90 hover:opacity-100 transition"
                      onError={(e) => {
                        // Fallback if image fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}

          {tab === 'juz' && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                <button
                  key={juzNum}
                  onClick={() => {
                    // Quick approximation of Juz starting Surahs
                    const juzStarts = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 11, 12, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];
                    onSelectSurah(juzStarts[juzNum - 1]);
                    onClose();
                  }}
                  className="p-3 text-center rounded-xl border border-gray-200 dark:border-brand-borderDark hover:border-brand-teal dark:hover:border-brand-teal hover:bg-brand-teal/5 transition"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Juz {juzNum}</div>
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 flex items-center justify-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-brand-teal" />
                    Open Juz
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'bookmark' && (
            bookmarks.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No bookmarks saved yet. Click the bookmark icon next to any verse to pin it here.
              </div>
            ) : (
              bookmarks.map((bm, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectSurah(bm.surah);
                    onClose();
                  }}
                  className="p-3.5 px-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-brand-cardDark cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Bookmark className="w-4 h-4 text-brand-teal" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Surah {bm.surah}, Ayah {bm.aya}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
