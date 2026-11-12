import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import type { ScriptType, Verse } from '../types';
import { getScriptFontClass } from '../types';

interface PageVerseRef {
  surah: number;
  aya: number;
}

interface MushafPageData {
  page: number;
  juz: number;
  surahs: { number: number; name: string }[];
  verses: PageVerseRef[];
}

interface MushafPageViewProps {
  initialPage?: number;
  script: ScriptType;
  arabicFontSize: number;
  onSelectAya: (surah: number, aya: number) => void;
  onPlayAya: (surah: number, aya: number) => void;
  onOpenSurahList: () => void;
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  script,
  arabicFontSize,
  onSelectAya,
  onPlayAya,
  onOpenSurahList,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pagesIndex, setPagesIndex] = useState<MushafPageData[]>([]);
  const [pageVerses, setPageVerses] = useState<{ surah: number; aya: number; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageInput, setPageInput] = useState<string>(initialPage.toString());

  // Load master 604 pages mapping
  useEffect(() => {
    fetch('/data/mushaf_pages.json')
      .then((res) => res.json())
      .then((data: MushafPageData[]) => {
        setPagesIndex(data);
      })
      .catch(() => {});
  }, []);

  // When currentPage changes, load the verses for this page
  useEffect(() => {
    if (pagesIndex.length === 0) return;
    const pageData = pagesIndex[currentPage - 1];
    if (!pageData) return;

    setIsLoading(true);
    setPageInput(currentPage.toString());

    // Group verses by surah to fetch
    const surahGroups: Record<number, number[]> = {};
    pageData.verses.forEach((v) => {
      if (!surahGroups[v.surah]) surahGroups[v.surah] = [];
      surahGroups[v.surah].push(v.aya);
    });

    const surahNumbers = Object.keys(surahGroups).map(Number);
    Promise.all(
      surahNumbers.map((sNum) =>
        fetch(`/data/surah_${sNum}.json`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((surahResults) => {
      const versesList: { surah: number; aya: number; text: string }[] = [];
      const surahMap: Record<number, Record<number, Verse>> = {};

      surahResults.forEach((sData) => {
        if (!sData) return;
        surahMap[sData.number] = {};
        sData.verses.forEach((v: Verse) => {
          surahMap[sData.number][v.aya] = v;
        });
      });

      pageData.verses.forEach((ref) => {
        const v = surahMap[ref.surah]?.[ref.aya];
        if (v) {
          const t = script === 'uthmani' ? v.uthmani : v.indopak;
          versesList.push({
            surah: ref.surah,
            aya: ref.aya,
            text: t,
          });
        }
      });

      setPageVerses(versesList);
      setIsLoading(false);
    });
  }, [currentPage, pagesIndex, script]);

  const activePageData = pagesIndex[currentPage - 1];

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= 604) {
      setCurrentPage(p);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 py-4 px-2 sm:px-4 select-none">
      {/* Page Navigation & Header Controls */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-brand-borderDark hover:bg-gray-100 dark:hover:bg-brand-cardDark disabled:opacity-30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Page</span>
        </button>

        <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            min={1}
            max={604}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-14 px-2 py-1 text-center font-bold rounded-lg border border-gray-200 dark:border-brand-borderDark bg-white dark:bg-brand-cardDark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
          />
          <span className="text-gray-400">/ 604</span>
        </form>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= 604}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-brand-borderDark hover:bg-gray-100 dark:hover:bg-brand-cardDark disabled:opacity-30 transition"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* The Mushaf Page Physical Border Frame */}
      <div className="w-full bg-[#fdfbf7] dark:bg-[#0b121f] border-2 sm:border-4 border-[#e6dece] dark:border-[#1e293b] rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 flex flex-col min-h-[580px] sm:min-h-[720px] justify-between relative transition-colors duration-200">
        {/* Mushaf Page Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e6dece] dark:border-[#1e293b] pb-2 sm:pb-3 mb-4 text-xs sm:text-sm font-bold text-[#8c7b64] dark:text-[#94a3b8] uppercase tracking-wider">
          <div>
            Juz {activePageData?.juz || 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (pageVerses.length > 0) {
                  onPlayAya(pageVerses[0].surah, pageVerses[0].aya);
                }
              }}
              className="p-1 rounded-lg text-brand-teal hover:bg-brand-teal/10 transition"
              title="Recite page starting from first ayah"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div className="text-brand-teal dark:text-emerald-400 cursor-pointer hover:underline" onClick={onOpenSurahList}>
              {activePageData?.surahs.map((s) => s.name).join(' • ') || 'Al-Qur\'an'}
            </div>
          </div>
        </div>

        {/* Mushaf Page Body (Continuous Flow Calligraphy) */}
        <div className="flex-1 flex flex-col justify-center items-center text-center my-auto py-2">
          {isLoading ? (
            <div className="text-gray-400 text-sm py-20 animate-pulse">Loading Medina Mushaf Page...</div>
          ) : (
            <p
              className={`${getScriptFontClass(script)} text-gray-900 dark:text-gray-100 leading-[2.6] sm:leading-[2.8] text-justify text-center`}
              style={{ fontSize: `${arabicFontSize}px` }}
              dir="rtl"
            >
              {pageVerses.map((v, idx) => (
                <span
                  key={idx}
                  className="inline hover:bg-brand-teal/10 dark:hover:bg-brand-teal/20 rounded px-1 transition cursor-pointer"
                  onClick={() => onSelectAya(v.surah, v.aya)}
                  title={`Surah ${v.surah}:${v.aya} (Tap to study)`}
                >
                  <span>{v.text}</span>
                  <span className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1 mx-1.5 text-[11px] text-brand-teal border border-brand-teal/40 rounded-full font-sans select-none align-middle font-bold shrink-0">
                    {v.aya}
                  </span>
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Mushaf Page Footer (Page Number) */}
        <div className="flex items-center justify-center border-t border-[#e6dece] dark:border-[#1e293b] pt-2 sm:pt-3 mt-4 text-xs sm:text-sm font-bold text-[#8c7b64] dark:text-[#94a3b8]">
          <span className="px-3 py-1 rounded-full bg-[#f4ede0] dark:bg-[#131d2e] border border-[#e6dece] dark:border-[#1e293b]">
            {currentPage}
          </span>
        </div>
      </div>
    </div>
  );
};
