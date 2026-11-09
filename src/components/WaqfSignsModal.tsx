import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { WAQF_SIGNS } from '../data/waqfSigns';

interface WaqfSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAyah?: (surah: number, aya: number) => void;
}

type TabType = 'all' | 'uthmani' | 'indopak' | 'general';

export const WaqfSignsModal: React.FC<WaqfSignsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAyah,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const filteredSigns = useMemo(() => {
    return WAQF_SIGNS.filter((sign) => {
      // Tab filter
      if (activeTab === 'uthmani') {
        if (sign.category !== 'uthmani' && sign.category !== 'both') return false;
      } else if (activeTab === 'indopak') {
        if (sign.category !== 'indopak' && sign.category !== 'both') return false;
      } else if (activeTab === 'general') {
        if (sign.category !== 'general') return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        sign.nameArabic.toLowerCase().includes(term) ||
        sign.nameTranslit.toLowerCase().includes(term) ||
        sign.displaySymbol.toLowerCase().includes(term) ||
        sign.actionBadge.toLowerCase().includes(term) ||
        sign.ruleDescription.toLowerCase().includes(term) ||
        sign.whyItMatters.toLowerCase().includes(term)
      );
    });
  }, [activeTab, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0 bg-white/50 dark:bg-brand-surfaceDark/50 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center shrink-0 border border-brand-teal/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Qur’anic Pause & Stop Signs
                </h2>
                <span className="hidden sm:inline text-xs font-serif text-brand-teal dark:text-emerald-400">
                  (عَلَامَاتُ الْوَقْف)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Authoritative rules from King Fahd Complex (Madinah) & Imam Al-Sajawandi (Indo-Pak)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition hover:bg-gray-100 dark:hover:bg-brand-cardDark"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="px-4 py-3 sm:px-6 bg-gray-50/70 dark:bg-brand-cardDark/50 border-b border-gray-100 dark:border-brand-borderDark shrink-0 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar space-x-1 p-1 bg-gray-200/50 dark:bg-brand-surfaceDark rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-brand-cardDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              All Signs ({WAQF_SIGNS.length})
            </button>
            <button
              onClick={() => setActiveTab('uthmani')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'uthmani'
                  ? 'bg-white dark:bg-brand-cardDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Madinah / Uthmani
            </button>
            <button
              onClick={() => setActiveTab('indopak')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'indopak'
                  ? 'bg-white dark:bg-brand-cardDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Indo-Pak / Sajawandi
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-brand-cardDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Other Markers
            </button>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sign, rule, meaning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-7 py-2 bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5">
          
          {/* Quick Notice Banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-teal/5 dark:bg-brand-teal/10 border border-brand-teal/20 text-xs text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-brand-teal dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Interactive In-Verse Hints:
              </span>
              <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                While reading verses in the Quran reader, simply <strong>hover</strong> on desktop or <strong>tap</strong> on mobile any pause sign to see its instant meaning and rule right on screen!
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredSigns.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
              No stop signs found matching "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSigns.map((sign) => (
                <div
                  key={sign.id}
                  className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-brand-cardDark border border-gray-200/80 dark:border-brand-borderDark shadow-sm hover:border-brand-teal/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Top Row: Arabic Glyph, Name & Action Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Calligraphic Glyph Box */}
                        <div className="min-w-[3.25rem] h-13 px-2 rounded-xl bg-gray-50 dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                          <span
                            className="font-serif text-2xl font-bold text-brand-teal dark:text-emerald-400 select-none text-center leading-normal"
                            dir="rtl"
                          >
                            {sign.displaySymbol}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 leading-tight truncate">
                            {sign.nameTranslit}
                          </h3>
                          <div className="text-xs font-serif text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {sign.nameArabic}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 whitespace-nowrap ${sign.badgeClasses.bg} ${sign.badgeClasses.text} ${sign.badgeClasses.border}`}
                      >
                        {sign.actionBadge}
                      </span>
                    </div>

                    {/* Rule Description */}
                    <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium mb-1.5">
                      {sign.ruleDescription}
                    </p>

                    {/* Theological / Linguistic Reason */}
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal mb-3">
                      {sign.whyItMatters}
                    </p>
                  </div>

                  {/* Quranic Example Box (if available) */}
                  {sign.example && (
                    <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-brand-borderDark/60 bg-gray-50/80 dark:bg-brand-surfaceDark/60 rounded-xl p-3 sm:p-3.5 overflow-hidden">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                        <span className="uppercase tracking-wider">Example:</span>
                        <span className="text-brand-teal dark:text-emerald-400">
                          Surah {sign.example.surahName} ({sign.example.surah}:{sign.example.aya})
                        </span>
                      </div>

                      {/* Arabic Ayah Snippet */}
                      <div
                        className="text-right font-hafs text-base sm:text-lg text-gray-900 dark:text-gray-100 py-1.5 leading-relaxed overflow-x-auto no-scrollbar"
                        dir="rtl"
                      >
                        {sign.example.snippetArabic}
                      </div>

                      {/* English Snippet Translation */}
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 italic mt-1 leading-snug">
                        "{sign.example.snippetTranslation}"
                      </p>

                      {/* Explanation */}
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 leading-tight">
                        <strong>Why:</strong> {sign.example.explanation}
                      </p>

                      {/* Direct Jump to Ayah Button */}
                      {onNavigateToAyah && (
                        <button
                          onClick={() => {
                            onNavigateToAyah(sign.example!.surah, sign.example!.aya);
                            onClose();
                          }}
                          className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-brand-teal dark:text-emerald-400 hover:underline"
                        >
                          <span>Open in Reader</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Educational Tajweed Guide Accordion */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-brand-borderDark">
            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-brand-cardDark hover:bg-gray-100 dark:hover:bg-brand-borderDark/40 transition text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal dark:text-emerald-400" />
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  Scholarly Foundation: The 4 Categories of Waqf in Tajweed
                </span>
              </div>
              <span className="text-xs text-brand-teal dark:text-emerald-400 font-semibold">
                {showGuide ? 'Hide Guide' : 'Read Guide'}
              </span>
            </button>

            {showGuide && (
              <div className="mt-3 p-4 rounded-xl bg-gray-50/60 dark:bg-brand-surfaceDark/60 border border-gray-100 dark:border-brand-borderDark text-xs text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
                <p>
                  Classical scholars of Tajweed (such as Ibn al-Jazari, Abu ‘Amr al-Dani, and Al-Sajawandi) categorized every potential pause into four fundamental legal rulings:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-brand-cardDark border border-gray-200/70 dark:border-brand-borderDark">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">1. Waqf Tāmm (الوقف التام - Complete Stop):</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                      Stopping at a point where the sentence is completely finished and has no grammatical or thematic connection to what follows (often at verse ends or complete stories).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-brand-cardDark border border-gray-200/70 dark:border-brand-borderDark">
                    <span className="font-bold text-teal-600 dark:text-teal-400">2. Waqf Kāfī (الوقف الكافي - Sufficient Stop):</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                      The sentence is grammatically complete, but the thematic discussion continues. Stopping and starting from the next word is entirely permitted.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-brand-cardDark border border-gray-200/70 dark:border-brand-borderDark">
                    <span className="font-bold text-blue-600 dark:text-blue-400">3. Waqf Ḥasan (الوقف الحسن - Good Stop):</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                      The phrase itself conveys an understandable meaning, but is grammatically attached to what follows. Stopping is allowed, but you should back up a word or two when resuming (unless at an Ayah end).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-brand-cardDark border border-gray-200/70 dark:border-brand-borderDark">
                    <span className="font-bold text-rose-600 dark:text-rose-400">4. Waqf Qabīḥ (الوقف القبيح - Reprehensible Stop):</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                      Stopping at a spot that leaves the phrase nonsensical or gives an blasphemous/false meaning (e.g. stopping at "There is no God..." without saying "...except Allah").
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200">
                  <strong>Breathing Rule (*Iḍṭirārī*):</strong> If you run out of breath, cough, or sneeze mid-verse, you may stop anywhere. When resuming, simply step back 1 or 2 words to restore proper sentence context before continuing forward.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-brand-surfaceDark/50 text-xs text-gray-500 dark:text-gray-400">
          <span>Sources: King Fahd Complex (Madinah) & Imam Al-Sajawandi</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-teal hover:bg-brand-tealDark text-white font-bold rounded-xl transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
