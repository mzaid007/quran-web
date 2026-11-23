import React, { useState, useEffect } from 'react';
import { X, Search, Bookmark, Compass, BookmarkCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import type { SurahMeta, LastRead } from '../types';

interface SurahListModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: SurahMeta[];
  currentSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
  onSelectAyah?: (surahNumber: number, ayaNumber: number) => void;
  bookmarks: { surah: number; aya: number }[];
  lastRead: LastRead | null;
  onResumeLastRead: () => void;
  initialSurahForAyah?: number | null;
}

export const SurahListModal: React.FC<SurahListModalProps> = ({
  isOpen,
  onClose,
  surahs,
  currentSurahNumber,
  onSelectSurah,
  onSelectAyah,
  bookmarks,
  lastRead,
  onResumeLastRead,
  initialSurahForAyah,
}) => {
  const [tab, setTab] = useState<'surah' | 'juz' | 'bookmark'>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurahForAyah, setSelectedSurahForAyah] = useState<SurahMeta | null>(null);
  const [ayahInput, setAyahInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialSurahForAyah) {
        const found = surahs.find((s) => s.number === initialSurahForAyah);
        setSelectedSurahForAyah(found || null);
      } else {
        setSelectedSurahForAyah(null);
      }
      setAyahInput('');
      setSearchQuery('');
    } else {
      setSelectedSurahForAyah(null);
    }
  }, [isOpen, initialSurahForAyah, surahs]);

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
        {selectedSurahForAyah ? (
          /* ================= STEP 2: AYAH PICKER ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Modal Header for Ayah Picker */}
            <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedSurahForAyah(null);
                  setAyahInput('');
                }}
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-brand-teal dark:text-emerald-400 hover:text-brand-tealDark p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-brand-teal/10 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Surahs</span>
              </button>

              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                Jump to Ayah
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Surah Details & Quick Jump Controls */}
            <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold text-sm flex items-center justify-center border border-brand-teal/25 shrink-0">
                    {selectedSurahForAyah.number}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                      Surah {selectedSurahForAyah.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        selectedSurahForAyah.revelationType === 'Meccan' ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />
                      <span>{selectedSurahForAyah.revelationType}</span>
                      <span>•</span>
                      <span>{selectedSurahForAyah.totalVerses} Ayahs</span>
                    </div>
                  </div>
                </div>

                {/* Quick button: Read from Ayah 1 */}
                <button
                  onClick={() => {
                    if (onSelectAyah) {
                      onSelectAyah(selectedSurahForAyah.number, 1);
                    } else {
                      onSelectSurah(selectedSurahForAyah.number);
                    }
                    onClose();
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-tealDark transition text-xs font-bold shadow-sm shrink-0"
                  title="Read from Beginning"
                >
                  <span>Ayah 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Input Jump Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = parseInt(ayahInput.trim(), 10);
                  if (!isNaN(target) && target >= 1 && target <= selectedSurahForAyah.totalVerses) {
                    if (onSelectAyah) {
                      onSelectAyah(selectedSurahForAyah.number, target);
                    } else {
                      onSelectSurah(selectedSurahForAyah.number);
                    }
                    onClose();
                  }
                }}
                className="mt-3 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max={selectedSurahForAyah.totalVerses}
                    placeholder={`Enter Ayah number (1 - ${selectedSurahForAyah.totalVerses})...`}
                    value={ayahInput}
                    onChange={(e) => setAyahInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-brand-cardDark border border-gray-200 dark:border-brand-borderDark rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!ayahInput || parseInt(ayahInput, 10) < 1 || parseInt(ayahInput, 10) > selectedSurahForAyah.totalVerses}
                  className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-brand-teal hover:bg-brand-tealDark text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Ayah Grid Picker */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5 px-0.5">
                Select an Ayah:
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: selectedSurahForAyah.totalVerses }, (_, i) => i + 1).map((ayaNum) => {
                  const isLastRead = lastRead?.surah === selectedSurahForAyah.number && lastRead?.aya === ayaNum;
                  const isBookmarked = bookmarks.some(b => b.surah === selectedSurahForAyah.number && b.aya === ayaNum);

                  return (
                    <button
                      key={ayaNum}
                      onClick={() => {
                        if (onSelectAyah) {
                          onSelectAyah(selectedSurahForAyah.number, ayaNum);
                        } else {
                          onSelectSurah(selectedSurahForAyah.number);
                        }
                        onClose();
                      }}
                      className={`relative h-11 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition border ${
                        isLastRead
                          ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30 font-extrabold'
                          : isBookmarked
                          ? 'border-brand-teal bg-brand-teal/10 text-brand-teal dark:text-emerald-400 font-bold'
                          : 'border-gray-200 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark text-gray-800 dark:text-gray-200 hover:border-brand-teal hover:bg-brand-teal hover:text-white dark:hover:bg-brand-teal dark:hover:text-white shadow-xs'
                      }`}
                      title={`Ayah ${ayaNum}${isLastRead ? ' (Last Read)' : ''}${isBookmarked ? ' (Bookmarked)' : ''}`}
                    >
                      <span>{ayaNum}</span>
                      {isLastRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-brand-surfaceDark" />
                      )}
                      {isBookmarked && !isLastRead && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-teal rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ================= STEP 1: SURAH / JUZ / BOOKMARKS LIST ================= */
          <>
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
                        setSelectedSurahForAyah(surah);
                        setAyahInput('');
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

                      {/* Right: Authentic Extracted Calligraphy Image Badge & Arrow */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={`/snames/${surah.image}`}
                          alt={surah.name}
                          className="h-8 max-w-[120px] object-contain dark:invert dark:brightness-125 opacity-90 hover:opacity-100 transition hidden xs:block"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-brand-borderDark/60 flex items-center justify-center text-gray-400 group-hover:text-brand-teal transition">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
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
                        if (onSelectAyah) {
                          onSelectAyah(bm.surah, bm.aya);
                        } else {
                          onSelectSurah(bm.surah);
                        }
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
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
