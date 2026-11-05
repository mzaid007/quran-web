import React, { useState, useEffect } from 'react';
import { X, BookOpen, Copy, Check, Loader2 } from 'lucide-react';
import type { Verse } from '../types';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  verse: Verse | null;
}

export type TafsirId = 'kathir_en' | 'kathir_ur' | 'jalalayn';

// In-memory caches for Tafsir Surah files
const ibnKathirCacheEn: Record<number, Array<{ ayah: number; text: string; surah?: number }>> = {};
const ibnKathirCacheUr: Record<number, Array<{ ayah: number; text: string; surah?: number }>> = {};

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  verse,
}) => {
  const [selectedTafsir, setSelectedTafsir] = useState<TafsirId>(() => {
    const saved = localStorage.getItem('quran_preferred_tafsir');
    if (saved === 'kathir_ur' || saved === 'jalalayn' || saved === 'kathir_en') {
      return saved as TafsirId;
    }
    return 'kathir_en';
  });

  const [kathirEnText, setKathirEnText] = useState<string | null>(null);
  const [kathirUrText, setKathirUrText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch Tafsir Ibn Kathir (English)
  useEffect(() => {
    if (!isOpen || !verse || selectedTafsir !== 'kathir_en') return;

    if (ibnKathirCacheEn[surahNumber]) {
      const match = ibnKathirCacheEn[surahNumber].find((item) => item.ayah === verse.aya);
      setKathirEnText(match ? match.text : null);
      return;
    }

    setLoading(true);
    fetch(`/tafsir/ibn_kathir/${surahNumber}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load English Tafsir Ibn Kathir');
        return res.json();
      })
      .then((data: Array<{ ayah: number; text: string; surah?: number }>) => {
        ibnKathirCacheEn[surahNumber] = data;
        const match = data.find((item) => item.ayah === verse.aya);
        setKathirEnText(match ? match.text : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading English Tafsir Ibn Kathir:', err);
        setKathirEnText(null);
        setLoading(false);
      });
  }, [isOpen, surahNumber, verse, selectedTafsir]);

  // Fetch Tafsir Ibn Kathir (Urdu)
  useEffect(() => {
    if (!isOpen || !verse || selectedTafsir !== 'kathir_ur') return;

    if (ibnKathirCacheUr[surahNumber]) {
      const match = ibnKathirCacheUr[surahNumber].find((item) => item.ayah === verse.aya);
      setKathirUrText(match ? match.text : null);
      return;
    }

    setLoading(true);
    fetch(`/tafsir/ibn_kathir_ur/${surahNumber}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load Urdu Tafsir Ibn Kathir');
        return res.json();
      })
      .then((data: Array<{ ayah: number; text: string; surah?: number }>) => {
        ibnKathirCacheUr[surahNumber] = data;
        const match = data.find((item) => item.ayah === verse.aya);
        setKathirUrText(match ? match.text : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Urdu Tafsir Ibn Kathir:', err);
        setKathirUrText(null);
        setLoading(false);
      });
  }, [isOpen, surahNumber, verse, selectedTafsir]);

  const handleSelectTafsir = (t: TafsirId) => {
    setSelectedTafsir(t);
    localStorage.setItem('quran_preferred_tafsir', t);
  };

  const handleCopyTafsir = () => {
    if (!verse) return;
    let currentText = '';
    let author = '';
    if (selectedTafsir === 'kathir_en') {
      currentText = kathirEnText || '';
      author = 'Tafsir Ibn Kathir (English)';
    } else if (selectedTafsir === 'kathir_ur') {
      currentText = kathirUrText || '';
      author = 'تفسیر ابن کثیر (اردو)';
    } else {
      currentText = verse.jalalayn || '';
      author = 'Tafsir al-Jalalayn';
    }

    const translationLine =
      selectedTafsir === 'kathir_ur' && verse.romanUrdu
        ? `"${verse.romanUrdu}"`
        : `"${verse.khattab || verse.saheeh || ''}"`;

    const textToCopy = `[${author} - Surah ${surahName} ${surahNumber}:${verse.aya}]\n\n${
      verse.indopak || verse.uthmani
    }\n\n${translationLine}\n\n--- Commentary ---\n${currentText}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !verse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-3xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between bg-gray-50/60 dark:bg-brand-cardDark/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>Holy Qur'an Tafsir</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal dark:text-emerald-400 border border-brand-teal/20">
                  {surahNumber}:{verse.aya}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Surah {surahName} • Ayah {verse.aya}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleCopyTafsir}
              className="p-2 text-gray-500 hover:text-brand-teal dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark transition flex items-center gap-1.5 text-xs font-medium"
              title="Copy Tafsir commentary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tafsir Source Switcher Tabs */}
        <div className="flex border-b border-gray-200 dark:border-brand-borderDark px-2 sm:px-4 bg-gray-50/30 dark:bg-brand-cardDark/30 overflow-x-auto">
          <button
            onClick={() => handleSelectTafsir('kathir_en')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              selectedTafsir === 'kathir_en'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400 bg-white/60 dark:bg-brand-surfaceDark/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <span>Ibn Kathir (English)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-teal/10 text-brand-teal font-normal hidden sm:inline">
              Comprehensive
            </span>
          </button>

          <button
            onClick={() => handleSelectTafsir('kathir_ur')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              selectedTafsir === 'kathir_ur'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400 bg-white/60 dark:bg-brand-surfaceDark/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <span className="urdu-nastaliq text-sm sm:text-base leading-none">تفسیر ابن کثیر (اردو)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-normal">
              اردو
            </span>
          </button>

          <button
            onClick={() => handleSelectTafsir('jalalayn')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              selectedTafsir === 'jalalayn'
                ? 'border-brand-teal text-brand-teal dark:text-emerald-400 bg-white/60 dark:bg-brand-surfaceDark/60'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <span>Al-Jalalayn</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal hidden sm:inline">
              Concise
            </span>
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 leading-relaxed flex-1">
          {/* Arabic Verse Preview */}
          <div className="p-4 sm:p-5 bg-brand-teal/5 dark:bg-brand-cardDark rounded-2xl border border-brand-teal/15 text-right quran-indopak text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 select-text leading-loose">
            {verse.indopak || verse.uthmani}
          </div>

          {/* Translation Preview */}
          {selectedTafsir === 'kathir_ur' && verse.romanUrdu ? (
            <div className="p-3.5 bg-gray-50 dark:bg-brand-cardDark/50 rounded-xl border-l-4 border-brand-teal text-sm sm:text-base text-gray-700 dark:text-gray-300 italic select-text">
              "{verse.romanUrdu}"
              <span className="block text-xs not-italic text-brand-teal dark:text-emerald-400 font-semibold mt-1.5">
                — Tafheem-ul-Quran (Syed Abul A'la Maududi - Roman Urdu)
              </span>
            </div>
          ) : (verse.khattab || verse.saheeh) ? (
            <div className="p-3.5 bg-gray-50 dark:bg-brand-cardDark/50 rounded-xl border-l-4 border-brand-teal text-sm sm:text-base text-gray-700 dark:text-gray-300 italic select-text">
              "{verse.khattab || verse.saheeh}"
              <span className="block text-xs not-italic text-brand-teal dark:text-emerald-400 font-semibold mt-1.5">
                — The Clear Quran (Dr. Mustafa Khattab)
              </span>
            </div>
          ) : null}

          {/* Tafsir Commentary Content */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-brand-borderDark pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {selectedTafsir === 'kathir_en' && 'Tafsir Ibn Kathir (English Exegesis)'}
                {selectedTafsir === 'kathir_ur' && 'تفسیر ابن کثیر (مولانا محمد جوناگڑھی)'}
                {selectedTafsir === 'jalalayn' && 'Tafsir al-Jalalayn (English Summary)'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
                <p className="text-xs text-gray-500">
                  {selectedTafsir === 'kathir_ur'
                    ? 'تفسیر ابن کثیر لوڈ ہو رہی ہے...'
                    : 'Loading Tafsir Ibn Kathir...'}
                </p>
              </div>
            ) : selectedTafsir === 'kathir_en' ? (
              kathirEnText ? (
                <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 select-text leading-relaxed font-serif space-y-4">
                  {kathirEnText.split('\n\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    const isHeading =
                      trimmed.length < 90 && !trimmed.endsWith('.') && !trimmed.includes(';');
                    if (isHeading) {
                      return (
                        <h4
                          key={idx}
                          className="font-sans font-bold text-base sm:text-lg text-brand-teal dark:text-emerald-400 mt-4 mb-2"
                        >
                          {trimmed}
                        </h4>
                      );
                    }
                    return (
                      <p key={idx} className="whitespace-pre-line">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                  No additional Tafsir Ibn Kathir commentary found for this specific Ayah.
                </div>
              )
            ) : selectedTafsir === 'kathir_ur' ? (
              kathirUrText ? (
                <div className="urdu-nastaliq text-base sm:text-lg text-gray-900 dark:text-gray-100 select-text leading-[2.6] space-y-4">
                  {kathirUrText.split('  ').map((part, idx) => {
                    const trimmed = part.trim();
                    if (!trimmed) return null;
                    const isHeading = trimmed.length < 75 && !trimmed.endsWith('۔');
                    if (isHeading) {
                      return (
                        <h4
                          key={idx}
                          className="font-bold text-lg sm:text-xl text-brand-teal dark:text-emerald-400 mt-4 mb-2 text-right"
                        >
                          {trimmed}
                        </h4>
                      );
                    }
                    return (
                      <p key={idx} className="text-right leading-[2.6]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 italic urdu-nastaliq">
                  اس آیت کے لیے تفسیر ابن کثیر کا متن دستیاب نہیں ہے۔
                </div>
              )
            ) : (
              <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-serif select-text">
                {verse.jalalayn || 'No additional commentary available for this verse in Tafsir al-Jalalayn.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
