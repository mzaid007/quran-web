import React from 'react';
import { X, BookOpen } from 'lucide-react';
import type { Verse } from '../types';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  verse: Verse | null;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  verse,
}) => {
  if (!isOpen || !verse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between bg-gray-50/50 dark:bg-brand-cardDark/50">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-teal" />
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Tafsir al-Jalalayn
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Surah {surahName} ({surahNumber}), Ayah {verse.aya}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 leading-relaxed">
          {/* Arabic Verse Preview */}
          <div className="p-4 bg-brand-teal/5 dark:bg-brand-cardDark rounded-xl border border-brand-teal/15 text-right quran-uthmani text-2xl text-gray-900 dark:text-gray-100">
            {verse.uthmani}
          </div>

          {/* Translation Preview */}
          {verse.khattab && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 italic border-l-2 border-brand-teal pl-3">
              "{verse.khattab}"
              <span className="block text-[11px] not-italic text-brand-teal font-normal mt-1">
                — The Clear Quran (Dr. Mustafa Khattab)
              </span>
            </div>
          )}

          {/* Tafsir Commentary */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Commentary & Analysis
            </div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-7 font-serif">
              {verse.jalalayn || "No additional commentary available for this verse."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
