import React, { useState, useMemo, useEffect } from 'react';
import { X, Volume2, BookOpen, Sparkles, Info, ArrowRight } from 'lucide-react';
import type { WBWWord, ScriptType } from '../types';
import { getScriptFontClass, getWbwScriptText, getWbwWordAudioUrl } from '../types';
import { analyzeArabicWord, type WordLetterToken } from '../data/arabicLetters';
import {
  playPronunciationClip,
  speakArabicSyllable,
  stopPronunciationAudio,
} from '../utils/pronunciationAudio';

interface WordBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayaNumber: number;
  word: WBWWord | null;
  script: ScriptType;
  onOpenLettersGuide: (initialLetterId?: string) => void;
}

export const WordBreakdownModal: React.FC<WordBreakdownModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  ayaNumber,
  word,
  script,
  onOpenLettersGuide,
}) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [playingTarget, setPlayingTarget] = useState<string | null>(null);
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);

  const wordText = word ? getWbwScriptText(word, script) : '';
  const tokens = useMemo(() => analyzeArabicWord(wordText), [wordText]);

  useEffect(() => {
    return () => {
      stopPronunciationAudio();
    };
  }, []);

  if (!isOpen || !word) return null;

  const selectedToken: WordLetterToken | undefined = tokens[selectedTokenIndex] || tokens[0];
  const wordAudioUrl = getWbwWordAudioUrl(surahNumber, ayaNumber, word.word);

  const handlePlayWord = () => {
    setTtsNotice(null);
    playPronunciationClip(wordAudioUrl, {
      onStart: () => setPlayingTarget('word'),
      onEnd: () => setPlayingTarget(null),
      onError: () => setPlayingTarget(null),
    });
  };

  const handlePlayLetterName = (token: WordLetterToken, idx: number) => {
    setSelectedTokenIndex(idx);
    setTtsNotice(null);
    if (!token.letterInfo?.audioFile) return;
    playPronunciationClip(token.letterInfo.audioFile, {
      onStart: () => setPlayingTarget(`name-${idx}`),
      onEnd: () => setPlayingTarget(null),
      onError: () => setPlayingTarget(null),
    });
  };

  const handlePlaySyllableSound = (token: WordLetterToken, idx: number) => {
    setSelectedTokenIndex(idx);
    setTtsNotice(null);
    speakArabicSyllable(token.ttsArabic, {
      onStart: () => setPlayingTarget(`sound-${idx}`),
      onEnd: () => setPlayingTarget(null),
      onUnavailable: () => {
        setPlayingTarget(null);
        setTtsNotice(
          'Your browser has no Arabic TTS voice installed for isolated syllables. Use "Letter Name" + "Listen to Word" (real human recordings) alongside the phonetic reading badge.'
        );
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-surfaceDark w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center border border-brand-teal/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Letter-by-Letter Breakdown
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Surah {surahNumber}:{ayaNumber} • Word #{word.word} (read right → left)
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Full Word Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-teal/10 via-emerald-50/60 to-transparent dark:from-brand-teal/20 dark:via-brand-cardDark dark:to-brand-surfaceDark border border-brand-teal/25 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              {word.translit && (
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-emerald-400">
                  {word.translit}
                </div>
              )}
              <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                {word.translation}
              </div>
              <button
                onClick={handlePlayWord}
                className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  playingTarget === 'word'
                    ? 'bg-brand-teal text-white ring-2 ring-brand-teal/40'
                    : 'bg-brand-teal hover:bg-brand-tealDark text-white'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${playingTarget === 'word' ? 'animate-pulse' : ''}`} />
                <span>{playingTarget === 'word' ? 'Playing Word...' : 'Listen to Full Word'}</span>
              </button>
            </div>

            <div
              className={`${getScriptFontClass(script)} text-4xl sm:text-5xl text-gray-900 dark:text-gray-100 px-3 py-1 select-text`}
              dir="rtl"
            >
              {wordText}
            </div>
          </div>

          {ttsNotice && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{ttsNotice}</span>
            </div>
          )}

          {/* Letter Tiles Grid (RTL order so novices follow Arabic reading direction) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Letters & Vowels ({tokens.length}) — Right to Left
              </span>
              <span className="text-[11px] text-gray-400">
                Tap a card to hear its letter name
              </span>
            </div>

            <div className="flex flex-wrap flex-row-reverse gap-2.5 justify-start" dir="rtl">
              {tokens.map((token, idx) => {
                const isSelected = idx === selectedTokenIndex;
                const isPlayingName = playingTarget === `name-${idx}`;
                const isPlayingSound = playingTarget === `sound-${idx}`;

                return (
                  <div
                    key={idx}
                    onClick={() => handlePlayLetterName(token, idx)}
                    className={`cursor-pointer rounded-2xl border p-3 min-w-[112px] flex-1 sm:flex-initial sm:w-[132px] flex flex-col items-center justify-between transition-all ${
                      isSelected
                        ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20 ring-1 ring-brand-teal/40 shadow-sm'
                        : 'border-gray-200 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark hover:border-brand-teal/50'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-[10px] text-gray-400 font-semibold" dir="ltr">
                      <span>#{token.index}</span>
                      <span className="text-brand-teal dark:text-emerald-400 font-bold">
                        {token.syllableReading}
                      </span>
                    </div>

                    <div
                      className={`${getScriptFontClass(script)} text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 my-2 leading-relaxed`}
                      dir="rtl"
                    >
                      {token.display}
                    </div>

                    <div className="text-center w-full" dir="ltr">
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {token.letterInfo?.nameEnglish || token.baseChar}
                      </div>
                      {token.diacritics.length > 0 && (
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate" title={token.diacritics.join(' + ')}>
                          {token.diacritics.join(' + ')}
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-1.5 mt-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayLetterName(token, idx);
                          }}
                          disabled={!token.letterInfo?.audioFile}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                            isPlayingName
                              ? 'bg-brand-teal text-white border-brand-teal'
                              : 'bg-white dark:bg-brand-surfaceDark text-gray-700 dark:text-gray-200 border-gray-200 dark:border-brand-borderDark hover:border-brand-teal'
                          }`}
                          title="Hear letter name (human recording)"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Name</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySyllableSound(token, idx);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition border ${
                            isPlayingSound
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-brand-surfaceDark text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500'
                          }`}
                          title="Hear vowelized sound (device speech)"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Sound</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Letter Makhraj & Script Tip */}
          {selectedToken && selectedToken.letterInfo && (
            <div className="rounded-xl bg-gray-50 dark:bg-brand-cardDark border border-gray-200 dark:border-brand-borderDark p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {selectedToken.letterInfo.nameEnglish} ({selectedToken.letterInfo.nameArabic})
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400 font-semibold">
                    {selectedToken.syllableReading}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLettersGuide(selectedToken.letterInfo!.id);
                  }}
                  className="text-xs font-semibold text-brand-teal dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>See all forms</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-800 dark:text-gray-100">Pronunciation (Makhraj):</strong>{' '}
                {selectedToken.letterInfo.makhraj}
              </p>
              {(selectedToken.specialNote || selectedToken.letterInfo.scriptNote) && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
                  {selectedToken.specialNote || selectedToken.letterInfo.scriptNote}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-gray-100 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark/40 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenLettersGuide(selectedToken?.letterInfo?.id);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal dark:text-emerald-400 hover:underline"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Arabic Letters & Harakat Guide</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 dark:bg-brand-cardDark hover:bg-gray-300 dark:hover:bg-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
