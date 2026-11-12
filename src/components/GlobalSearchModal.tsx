import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { normalizeArabic, POPULAR_QURAN_ROOTS } from '../utils/arabicSearch';
import type { SurahMeta } from '../types';

interface SearchResult {
  surah: number;
  surahName: string;
  aya: number;
  arabicSnippet: string;
  englishSnippet: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: SurahMeta[];
  onSelectAya: (surah: number, aya: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  surahs,
  onSelectAya,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'roots'>('search');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Search across cached / loaded data
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const cleanQ = query.trim().toLowerCase();
      const normArabicQ = normalizeArabic(query.trim());
      const hits: SearchResult[] = [];

      // Check Surah names first
      for (const s of surahs) {
        if (s.name.toLowerCase().includes(cleanQ) || s.number.toString() === cleanQ) {
          hits.push({
            surah: s.number,
            surahName: s.name,
            aya: 1,
            arabicSnippet: `Surah ${s.name}`,
            englishSnippet: `${s.revelationType} • ${s.totalVerses} Ayahs`,
          });
        }
      }

      // Sample deep-search through commonly loaded surahs
      const searchSurahs = [1, 2, 3, 18, 36, 55, 67, 112, 113, 114];
      for (const sNum of searchSurahs) {
        if (hits.length >= 25) break;
        try {
          const res = await fetch(`/data/surah_${sNum}.json`);
          if (res.ok) {
            const data = await res.json();
            for (const v of data.verses) {
              const normUth = normalizeArabic(v.uthmani);
              const normIndo = normalizeArabic(v.indopak);
              const saheehLow = (v.saheeh || '').toLowerCase();
              const khattabLow = (v.khattab || '').toLowerCase();
              const translitLow = (v.transliteration || '').toLowerCase();

              const matchArabic = normArabicQ && (normUth.includes(normArabicQ) || normIndo.includes(normArabicQ));
              const matchEnglish = saheehLow.includes(cleanQ) || khattabLow.includes(cleanQ) || translitLow.includes(cleanQ);

              if (matchArabic || matchEnglish) {
                hits.push({
                  surah: sNum,
                  surahName: data.name,
                  aya: v.aya,
                  arabicSnippet: v.uthmani,
                  englishSnippet: v.khattab || v.saheeh,
                });
                if (hits.length >= 25) break;
              }
            }
          }
        } catch {
          // Ignore fetch error in search preview
        }
      }

      setResults(hits);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, surahs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-brand-teal" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
              Qur'anic Search & Root Explorer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 dark:border-brand-borderDark px-4 bg-gray-50/50 dark:bg-brand-cardDark/50">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Text</span>
          </button>
          <button
            onClick={() => setActiveTab('roots')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'roots'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Root Words Dictionary</span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab === 'search' && (
          <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Arabic (e.g. الرحمن) or English (e.g. Mercy, Covenant)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-brand-borderDark bg-gray-50 dark:bg-brand-cardDark text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-teal" />
              <span>Diacritic-insensitive: type with or without harakat/hamzah</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'search' ? (
            isSearching ? (
              <div className="text-center py-12 text-sm text-gray-400">Searching the Qur'an...</div>
            ) : results.length > 0 ? (
              results.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectAya(res.surah, res.aya);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-gray-100 dark:border-brand-borderDark hover:border-brand-teal/40 dark:hover:border-emerald-500/40 hover:bg-brand-teal/5 dark:hover:bg-brand-teal/10 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brand-teal dark:text-emerald-400">
                      {res.surahName} {res.surah}:{res.aya}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-brand-teal flex items-center gap-0.5">
                      <span>Go to verse</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="text-sm font-arabic text-gray-800 dark:text-gray-200 text-right line-clamp-1 mb-1" dir="rtl">
                    {res.arabicSnippet}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {res.englishSnippet}
                  </div>
                </div>
              ))
            ) : query.trim() ? (
              <div className="text-center py-12 text-sm text-gray-400">
                No matching verses found for "{query}".
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-gray-400">
                Type an Arabic word, Surah name, or English concept to search.
              </div>
            )
          ) : (
            /* Root Words Dictionary Tab */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {POPULAR_QURAN_ROOTS.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(r.sampleVerse.snippet.split(' ')[0]);
                    setActiveTab('search');
                  }}
                  className="p-3 rounded-xl border border-gray-100 dark:border-brand-borderDark hover:border-brand-teal/40 hover:bg-brand-teal/5 dark:hover:bg-brand-teal/10 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-wider">
                      {r.root} ({r.translit})
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-teal/15 text-brand-teal dark:text-emerald-400">
                      {r.occurrences}x
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {r.meaning}
                  </p>
                  <div className="text-[11px] text-gray-400 font-arabic text-right line-clamp-1 border-t border-gray-50 dark:border-brand-borderDark/50 pt-1" dir="rtl">
                    {r.sampleVerse.snippet}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
