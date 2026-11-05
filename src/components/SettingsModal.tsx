import React from 'react';
import { X, Type, Globe, Check, Sliders, Volume2 } from 'lucide-react';
import { RECITERS } from '../types';
import type { ScriptType, TranslationChoice, Reciter } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScriptType;
  onChangeScript: (s: ScriptType) => void;
  translation: TranslationChoice;
  onChangeTranslation: (t: TranslationChoice) => void;
  showWBW: boolean;
  onToggleWBW: () => void;
  showTransliteration: boolean;
  onToggleTransliteration: () => void;
  arabicFontSize: number;
  onChangeArabicFontSize: (size: number) => void;
  currentReciter: Reciter;
  onChangeReciter: (r: Reciter) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  script,
  onChangeScript,
  translation,
  onChangeTranslation,
  showWBW,
  onToggleWBW,
  showTransliteration,
  onToggleTransliteration,
  arabicFontSize,
  onChangeArabicFontSize,
  currentReciter,
  onChangeReciter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-brand-teal dark:text-emerald-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Display & Reading Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh] space-y-6">
          {/* 1. Arabic Script & Typography */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-brand-teal" />
                Arabic Script & Font
              </span>
              <span className="text-xs text-brand-teal dark:text-emerald-400 font-medium">Authentic App Fonts</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onChangeScript('uthmani')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  script === 'uthmani'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Uthmani (Hafs)</span>
                  {script === 'uthmani' && <Check className="w-4 h-4 text-brand-teal" />}
                </div>
                <div className="quran-uthmani text-xl mt-2 text-right">
                  بِسۡمِ ٱللَّهِ
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Madani Quran Font</span>
              </button>

              <button
                onClick={() => onChangeScript('indopak')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  script === 'indopak'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">IndoPak (Asian)</span>
                  {script === 'indopak' && <Check className="w-4 h-4 text-brand-teal" />}
                </div>
                <div className="quran-indopak text-xl mt-2 text-right">
                  بِسْمِ اللّٰهِ
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Qalam Majeed 3 Font</span>
              </button>
            </div>
          </div>

          {/* 2. Arabic Font Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Arabic Font Size
              </span>
              <span className="text-xs font-bold text-brand-teal dark:text-emerald-400">
                {arabicFontSize}px
              </span>
            </div>
            <input
              type="range"
              min={22}
              max={54}
              step={2}
              value={arabicFontSize}
              onChange={(e) => onChangeArabicFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-brand-cardDark rounded-lg appearance-none cursor-pointer accent-brand-teal"
            />
          </div>

          {/* 3. Translation Options */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-brand-teal" />
                Translation Option
              </span>
            </div>
            <div className="space-y-2">
              {/* The Clear Quran - Dr. Mustafa Khattab */}
              <button
                onClick={() => onChangeTranslation('khattab')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  translation === 'khattab'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      The Clear Quran
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                      Dr. Mustafa Khattab
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Clear, contemporary, thematic English translation
                  </div>
                </div>
                {translation === 'khattab' && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
              </button>

              {/* Roman Urdu - Syed Abul A'la Maududi */}
              <button
                onClick={() => onChangeTranslation('romanUrdu')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  translation === 'romanUrdu'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Roman Urdu (Tafheem-ul-Quran)
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">
                      Syed Abul A'la Maududi
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Urdu translation in Roman/Latin script for Urdu learners
                  </div>
                </div>
                {translation === 'romanUrdu' && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
              </button>

              {/* Saheeh International */}
              <button
                onClick={() => onChangeTranslation('saheeh')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  translation === 'saheeh'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Saheeh International
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Standard English literal translation
                  </div>
                </div>
                {translation === 'saheeh' && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
              </button>

              {/* Tafsir al-Jalalayn */}
              <button
                onClick={() => onChangeTranslation('jalalayn')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  translation === 'jalalayn'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Tafsir al-Jalalayn (English)
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Classical explanatory verse commentary
                  </div>
                </div>
                {translation === 'jalalayn' && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
              </button>

              {/* None */}
              <button
                onClick={() => onChangeTranslation('none')}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  translation === 'none'
                    ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20'
                    : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                }`}
              >
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Arabic Only (No translation)
                </span>
                {translation === 'none' && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
              </button>
            </div>
          </div>

          {/* 4. Reading Mode Toggles */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-brand-borderDark">
            {/* Word-by-Word Switch */}
            <div className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-500/[0.04] dark:bg-amber-500/[0.08] space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Word-by-Word Breakdown
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                      Beta
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Enable word-by-word Qur'an translation (this feature is still in beta)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showWBW}
                  onChange={onToggleWBW}
                  className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal accent-brand-teal cursor-pointer shrink-0"
                />
              </label>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 bg-white/70 dark:bg-brand-surfaceDark/70 p-2.5 rounded-lg border border-amber-200/40 dark:border-amber-900/30 leading-relaxed">
                <strong className="font-semibold text-amber-900 dark:text-amber-200">Learning Aid Notice:</strong> Word-by-word translation is in beta (retained from the original Al Quran dataset). It is intended as a vocabulary aid for Arabic learners. Because Arabic grammatical particles fuse directly with root words, please always refer to the complete sentence translations below for authoritative theological meaning and full context.
              </p>
            </div>

            {/* Transliteration Switch */}
            <label className="flex items-center justify-between cursor-pointer p-1">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Latin Transliteration
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Show phonetic English pronunciation for each verse
                </div>
              </div>
              <input
                type="checkbox"
                checked={showTransliteration}
                onChange={onToggleTransliteration}
                className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal accent-brand-teal cursor-pointer"
              />
            </label>
          </div>

          {/* 5. Reciter Selector */}
          <div className="pt-2 border-t border-gray-100 dark:border-brand-borderDark">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 mb-2.5">
              <Volume2 className="w-4 h-4 text-brand-teal" />
              Recitation Voice
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onChangeReciter(r)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    currentReciter.id === r.id
                      ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20 font-bold'
                      : 'border-gray-200 dark:border-brand-borderDark hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                  }`}
                >
                  <span className="text-xs text-gray-800 dark:text-gray-200 truncate">{r.name}</span>
                  {currentReciter.id === r.id && <Check className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
