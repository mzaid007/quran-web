import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Volume2, BookOpen, Info, Sparkles } from 'lucide-react';
import {
  ARABIC_LETTERS,
  HARAKAT_SIGNS,
  getVowelSyllablesForLetter,
  type ArabicLetterInfo,
  type LetterCategory,
} from '../data/arabicLetters';
import { getScriptFontClass, getWbwWordAudioUrl, type ScriptType } from '../types';
import {
  playPronunciationClip,
  speakArabicSyllable,
  stopPronunciationAudio,
} from '../utils/pronunciationAudio';

interface ArabicLettersGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScript: ScriptType;
  initialLetterId?: string;
}

type GuideSection = 'alphabet' | 'harakat';
type ScriptViewMode = 'both' | 'indopak' | 'uthmani';

export const ArabicLettersGuideModal: React.FC<ArabicLettersGuideModalProps> = ({
  isOpen,
  onClose,
  activeScript,
  initialLetterId,
}) => {
  const [section, setSection] = useState<GuideSection>('alphabet');
  const [scriptView, setScriptView] = useState<ScriptViewMode>('both');
  const [categoryFilter, setCategoryFilter] = useState<'all' | LetterCategory>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLetterId, setSelectedLetterId] = useState<string>(initialLetterId || 'alif');
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopPronunciationAudio();
    };
  }, []);

  const filteredLetters = useMemo(() => {
    return ARABIC_LETTERS.filter((letter) => {
      if (categoryFilter !== 'all' && letter.category !== categoryFilter) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        letter.nameEnglish.toLowerCase().includes(q) ||
        letter.nameArabic.includes(searchTerm) ||
        letter.char.includes(searchTerm) ||
        letter.sound.toLowerCase().includes(q) ||
        letter.makhraj.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchTerm]);

  const selectedLetter: ArabicLetterInfo = useMemo(() => {
    return ARABIC_LETTERS.find((l) => l.id === selectedLetterId) || ARABIC_LETTERS[0];
  }, [selectedLetterId]);

  const syllables = useMemo(() => getVowelSyllablesForLetter(selectedLetter), [selectedLetter]);

  if (!isOpen) return null;

  const indopakFontClass =
    activeScript === 'uthmani' ? 'quran-indopak-majeed' : getScriptFontClass(activeScript);

  const handlePlayLetterAudio = (letter: ArabicLetterInfo, key: string) => {
    setSelectedLetterId(letter.id);
    setTtsNotice(null);
    playPronunciationClip(letter.audioFile, {
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey(null),
      onError: () => setPlayingKey(null),
    });
  };

  const handlePlaySyllable = (ttsText: string, key: string) => {
    setTtsNotice(null);
    speakArabicSyllable(ttsText, {
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey(null),
      onUnavailable: () => {
        setPlayingKey(null);
        setTtsNotice(
          'Your device/browser has no Arabic TTS voice for isolated vowel syllables. Real human Qari audio is available on all Letter Name buttons and in the Harakat & Vowels Qur’anic examples tab.'
        );
      },
    });
  };

  const handlePlayQuranExample = (surah: number, aya: number, word: number, key: string) => {
    setTtsNotice(null);
    const url = getWbwWordAudioUrl(surah, aya, word);
    playPronunciationClip(url, {
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey(null),
      onError: () => setPlayingKey(null),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-surfaceDark w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0 bg-white/50 dark:bg-brand-surfaceDark/50 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center shrink-0 border border-brand-teal/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Arabic Letters & Harakat Guide
                </h2>
                <span className="hidden sm:inline text-xs font-serif text-brand-teal dark:text-emerald-400">
                  (حُرُوفُ الْهِجَاءِ وَالْحَرَكَات)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Learn letter shapes, Makharij, and vowel marks across Uthmani & IndoPak scripts
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

        {/* Section Tabs & Script Comparison Bar */}
        <div className="p-3 sm:px-5 border-b border-gray-100 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Primary Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSection('alphabet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                section === 'alphabet'
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white dark:bg-brand-surfaceDark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-brand-borderDark hover:border-brand-teal/50'
              }`}
            >
              Alphabet (30 Letters)
            </button>
            <button
              onClick={() => setSection('harakat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                section === 'harakat'
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white dark:bg-brand-surfaceDark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-brand-borderDark hover:border-brand-teal/50'
              }`}
            >
              Harakat, Vowels & Script Signs ({HARAKAT_SIGNS.length})
            </button>
          </div>

          {/* Script View Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl p-0.5 text-[11px] font-semibold">
            {([
              { id: 'both', label: 'Uthmani + IndoPak' },
              { id: 'indopak', label: 'IndoPak' },
              { id: 'uthmani', label: 'Uthmani' },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setScriptView(opt.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  scriptView === opt.id
                    ? 'bg-brand-teal/15 text-brand-teal dark:text-emerald-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {ttsNotice && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{ttsNotice}</span>
            </div>
          )}

          {section === 'alphabet' ? (
            <>
              {/* Active Letter Inspector Card */}
              <div className="rounded-2xl border border-brand-teal/30 bg-gradient-to-br from-brand-teal/[0.06] via-emerald-50/40 to-transparent dark:from-brand-teal/15 dark:via-brand-cardDark dark:to-brand-surfaceDark p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Script Comparison Display */}
                    <div className="flex items-center gap-2">
                      {(scriptView === 'both' || scriptView === 'uthmani') && (
                        <div className="flex flex-col items-center bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl px-3.5 py-2 min-w-[68px]">
                          <span className="quran-uthmani text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 leading-tight" dir="rtl">
                            {selectedLetter.char}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                            Uthmani
                          </span>
                        </div>
                      )}
                      {(scriptView === 'both' || scriptView === 'indopak') && (
                        <div className="flex flex-col items-center bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl px-3.5 py-2 min-w-[68px]">
                          <span className={`${indopakFontClass} text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 leading-tight`} dir="rtl">
                            {selectedLetter.indopakChar || selectedLetter.char}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                            IndoPak
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {selectedLetter.nameEnglish}
                        </h3>
                        <span className="text-sm font-serif text-brand-teal dark:text-emerald-400">
                          ({selectedLetter.nameArabic})
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        Sound: <strong className="text-gray-900 dark:text-gray-100">{selectedLetter.sound}</strong>
                      </div>
                      <button
                        onClick={() => handlePlayLetterAudio(selectedLetter, `detail-${selectedLetter.id}`)}
                        className={`mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          playingKey === `detail-${selectedLetter.id}`
                            ? 'bg-brand-teal text-white ring-2 ring-brand-teal/40'
                            : 'bg-brand-teal hover:bg-brand-tealDark text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Letter Name</span>
                      </button>
                    </div>
                  </div>

                  {/* Positional Forms (RTL) */}
                  <div className="grid grid-cols-4 gap-1.5 text-center" dir="rtl">
                    {([
                      { key: 'isolated', label: 'Isolated', val: selectedLetter.forms.isolated },
                      { key: 'initial', label: 'Start', val: selectedLetter.forms.initial },
                      { key: 'medial', label: 'Middle', val: selectedLetter.forms.medial },
                      { key: 'final', label: 'End', val: selectedLetter.forms.final },
                    ] as const).map((form) => (
                      <div
                        key={form.key}
                        className="bg-white/90 dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl px-2.5 py-2 flex flex-col items-center"
                      >
                        <span
                          className={`${
                            scriptView === 'uthmani' ? 'quran-uthmani' : indopakFontClass
                          } text-2xl text-gray-900 dark:text-gray-100 leading-normal`}
                        >
                          {form.val}
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold mt-0.5" dir="ltr">
                          {form.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Makhraj + Script Note */}
                <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/70 dark:bg-brand-surfaceDark/70 rounded-xl p-3 border border-gray-200/70 dark:border-brand-borderDark space-y-1.5">
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Articulation (Makhraj): </strong>
                    {selectedLetter.makhraj}
                  </div>
                  {selectedLetter.scriptNote && (
                    <div className="text-amber-700 dark:text-amber-300">
                      <strong>Uthmani vs. IndoPak Note: </strong>
                      {selectedLetter.scriptNote}
                    </div>
                  )}
                </div>

                {/* Vowelized Syllables Practice */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                      Vowelized Sounds (Tap to practice)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" dir="rtl">
                    {syllables.map((syl, i) => {
                      const sKey = `syl-${selectedLetter.id}-${i}`;
                      return (
                        <button
                          key={syl.label}
                          onClick={() => handlePlaySyllable(syl.tts, sKey)}
                          className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center ${
                            playingKey === sKey
                              ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40'
                              : 'border-gray-200 dark:border-brand-borderDark bg-white dark:bg-brand-surfaceDark hover:border-brand-teal'
                          }`}
                        >
                          <span
                            className={`${
                              scriptView === 'uthmani' ? 'quran-uthmani' : indopakFontClass
                            } text-2xl text-gray-900 dark:text-gray-100 leading-relaxed`}
                          >
                            {syl.glyph}
                          </span>
                          <span className="text-xs font-bold text-brand-teal dark:text-emerald-400" dir="ltr">
                            {syl.reading}
                          </span>
                          <span className="text-[9px] text-gray-400" dir="ltr">
                            {syl.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search letter (e.g. Saad, throat, ب)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-brand-borderDark bg-gray-50 dark:bg-brand-cardDark text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {([
                    { id: 'all', label: 'All' },
                    { id: 'throat', label: 'Throat' },
                    { id: 'heavy', label: 'Heavy (Tafkheem)' },
                    { id: 'tongue', label: 'Tongue' },
                    { id: 'lips', label: 'Lips' },
                    { id: 'vowel', label: 'Vowels / Alif' },
                  ] as const).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        categoryFilter === cat.id
                          ? 'bg-brand-teal text-white'
                          : 'bg-gray-100 dark:bg-brand-cardDark text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 30 Letters Grid (RTL) */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5" dir="rtl">
                {filteredLetters.map((letter) => {
                  const isSelected = letter.id === selectedLetter.id;
                  const isPlaying = playingKey === `grid-${letter.id}` || playingKey === `detail-${letter.id}`;
                  return (
                    <button
                      key={letter.id}
                      onClick={() => handlePlayLetterAudio(letter, `grid-${letter.id}`)}
                      className={`group rounded-2xl border p-3 flex flex-col items-center justify-between transition text-center ${
                        isSelected
                          ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20 ring-1 ring-brand-teal/40 shadow-sm'
                          : 'border-gray-200 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark hover:border-brand-teal/50'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between text-[10px] text-gray-400" dir="ltr">
                        <span>{letter.order}</span>
                        <Volume2 className={`w-3 h-3 ${isPlaying ? 'text-brand-teal animate-pulse' : 'opacity-50 group-hover:opacity-100'}`} />
                      </div>

                      {scriptView === 'both' ? (
                        <div className="flex items-center justify-center gap-2 my-1.5">
                          <span className="quran-uthmani text-2xl text-gray-900 dark:text-gray-100">
                            {letter.char}
                          </span>
                          {letter.indopakChar && (
                            <span className={`${indopakFontClass} text-2xl text-brand-teal dark:text-emerald-400`}>
                              {letter.indopakChar}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`${
                            scriptView === 'uthmani' ? 'quran-uthmani' : indopakFontClass
                          } text-3xl text-gray-900 dark:text-gray-100 my-1.5`}
                        >
                          {scriptView === 'indopak' && letter.indopakChar ? letter.indopakChar : letter.char}
                        </span>
                      )}

                      <div dir="ltr">
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-100">
                          {letter.nameEnglish}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                          {letter.sound}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Harakat & Script Signs Tab */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {HARAKAT_SIGNS.map((sign) => {
                const exKey = `harakah-${sign.id}`;
                return (
                  <div
                    key={sign.id}
                    className="rounded-2xl border border-gray-200 dark:border-brand-borderDark bg-gray-50/60 dark:bg-brand-cardDark p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {sign.nameEnglish}
                          </h3>
                          <span className="text-xs font-serif text-brand-teal dark:text-emerald-400">
                            ({sign.nameArabic})
                          </span>
                        </div>
                        {sign.otherNames && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400">
                            {sign.otherNames}
                          </span>
                        )}
                      </div>

                      {/* Script Symbol Badges */}
                      <div className="flex items-center gap-1.5 shrink-0" dir="rtl">
                        {(scriptView === 'both' || scriptView === 'uthmani') && (
                          <div className="flex flex-col items-center bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl px-2.5 py-1.5 min-w-[52px]">
                            <span className="quran-uthmani text-2xl text-gray-900 dark:text-gray-100 leading-tight">
                              {sign.uthmaniSymbol}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase" dir="ltr">
                              Uthmani
                            </span>
                          </div>
                        )}
                        {(scriptView === 'both' || scriptView === 'indopak') && (
                          <div className="flex flex-col items-center bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-xl px-2.5 py-1.5 min-w-[52px]">
                            <span className={`${indopakFontClass} text-2xl text-gray-900 dark:text-gray-100 leading-tight`}>
                              {sign.indopakSymbol}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase" dir="ltr">
                              IndoPak
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {sign.soundRule}
                    </p>

                    {/* Real Qur'anic Word Audio Example */}
                    {sign.audioExample && (
                      <div className="pt-2 border-t border-gray-200/70 dark:border-brand-borderDark flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              scriptView === 'uthmani' ? 'quran-uthmani' : indopakFontClass
                            } text-xl text-gray-900 dark:text-gray-100`}
                            dir="rtl"
                          >
                            {scriptView === 'uthmani' ? sign.exampleUthmani : sign.exampleIndopak}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {sign.audioExample.translit}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handlePlayQuranExample(
                              sign.audioExample!.surah,
                              sign.audioExample!.aya,
                              sign.audioExample!.word,
                              exKey
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            playingKey === exKey
                              ? 'bg-brand-teal text-white'
                              : 'bg-brand-teal/15 text-brand-teal dark:text-emerald-400 hover:bg-brand-teal hover:text-white'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Hear Example</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
