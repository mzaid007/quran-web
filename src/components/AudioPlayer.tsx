import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Volume2, Repeat, Repeat1, SlidersHorizontal } from 'lucide-react';
import type { Reciter } from '../types';

interface AudioPlayerProps {
  surahNumber: number;
  totalVerses: number;
  currentAya: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextAya: () => void;
  onPrevAya: () => void;
  onSelectAya: (aya: number) => void;
  onClose: () => void;
  reciter: Reciter;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export type RepeatOption = 1 | 3 | 5 | 10 | 'infinity';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surahNumber,
  totalVerses,
  currentAya,
  isPlaying,
  onTogglePlay,
  onNextAya,
  onPrevAya,
  onSelectAya,
  onClose,
  reciter,
  autoScroll,
  onToggleAutoScroll,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Repeat & Range State
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(1);
  const [playedCountThisAya, setPlayedCountThisAya] = useState<number>(0);
  const [showRangeModal, setShowRangeModal] = useState<boolean>(false);
  const [rangeMode, setRangeMode] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(Math.min(10, totalVerses));
  const [rangeLoopsRemaining, setRangeLoopsRemaining] = useState<number>(3);

  // Pad numbers to 3 digits (e.g. 1 -> 001)
  const suraPad = surahNumber.toString().padStart(3, '0');
  const ayaPad = currentAya.toString().padStart(3, '0');
  const audioUrl = `https://everyayah.com/data/${reciter.subfolder}/${suraPad}${ayaPad}.mp3`;

  // Reset played count when user manually jumps aya
  useEffect(() => {
    setPlayedCountThisAya(0);
  }, [currentAya]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = audioUrl;

    const handleEnded = () => {
      // 1. Check if current Ayah should repeat
      if (repeatOption === 'infinity' || playedCountThisAya + 1 < (typeof repeatOption === 'number' ? repeatOption : 1)) {
        setPlayedCountThisAya((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      // Reset aya repeat counter
      setPlayedCountThisAya(0);

      // 2. Check if Range Mode is active
      if (rangeMode) {
        if (currentAya < rangeEnd) {
          onNextAya();
        } else {
          // Reached end of range
          if (rangeLoopsRemaining > 1) {
            setRangeLoopsRemaining((prev) => prev - 1);
            onSelectAya(rangeStart);
          } else {
            // Finished range repetition
            onTogglePlay();
          }
        }
        return;
      }

      // 3. Normal sequential playback
      if (currentAya < totalVerses) {
        onNextAya();
      } else {
        onTogglePlay(); // stop at end
      }
    };

    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [
    audioUrl,
    isPlaying,
    currentAya,
    totalVerses,
    onNextAya,
    onTogglePlay,
    repeatOption,
    playedCountThisAya,
    rangeMode,
    rangeStart,
    rangeEnd,
    rangeLoopsRemaining,
    onSelectAya,
  ]);

  const cycleRepeat = () => {
    if (repeatOption === 1) setRepeatOption(3);
    else if (repeatOption === 3) setRepeatOption(5);
    else if (repeatOption === 5) setRepeatOption(10);
    else if (repeatOption === 10) setRepeatOption('infinity');
    else setRepeatOption(1);
    setPlayedCountThisAya(0);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-brand-borderDark p-3 px-4 flex flex-col gap-2 animate-slide-up">
      <div className="flex items-center justify-between">
        {/* Track info */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-brand-teal/15 flex items-center justify-center text-brand-teal shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1.5">
              <span>Ayah {currentAya} of {totalVerses}</span>
              {repeatOption !== 1 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {repeatOption === 'infinity' ? '∞ Repeat' : `${playedCountThisAya + 1}/${repeatOption}x`}
                </span>
              )}
              {rangeMode && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-teal/15 text-brand-teal dark:text-emerald-400">
                  Range {rangeStart}–{rangeEnd} ({rangeLoopsRemaining} loops left)
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              {reciter.name}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Repeat Counter Button */}
          <button
            onClick={cycleRepeat}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-0.5 ${
              repeatOption !== 1
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
            }`}
            title={`Repeat each Ayah: current ${repeatOption === 'infinity' ? '∞' : `${repeatOption}x`} (Tap to cycle)`}
          >
            {repeatOption === 1 ? <Repeat className="w-4 h-4" /> : <Repeat1 className="w-4 h-4" />}
            {repeatOption !== 1 && <span>{repeatOption === 'infinity' ? '∞' : `${repeatOption}x`}</span>}
          </button>

          {/* Range Modal Toggle */}
          <button
            onClick={() => setShowRangeModal((prev) => !prev)}
            className={`p-1.5 rounded-lg text-xs font-bold transition ${
              rangeMode
                ? 'bg-brand-teal/20 text-brand-teal dark:text-emerald-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
            }`}
            title="Range Loop / Hifz Memorization Repeater"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevAya}
            disabled={currentAya <= 1}
            className="p-1.5 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg"
            title="Previous Ayah"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-2 rounded-full bg-brand-teal text-white hover:bg-brand-tealDark shadow-sm transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={onNextAya}
            disabled={currentAya >= totalVerses}
            className="p-1.5 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg"
            title="Next Ayah"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleAutoScroll}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition ${
              autoScroll
                ? 'bg-brand-teal/20 text-brand-teal border-brand-teal/40'
                : 'border-gray-200 dark:border-brand-borderDark text-gray-400'
            }`}
            title="Auto-scroll to currently reciting Ayah"
          >
            Scroll
          </button>

          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg ml-1"
            title="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Range Loop Popover Drawer */}
      {showRangeModal && (
        <div className="pt-2.5 mt-1 border-t border-gray-100 dark:border-brand-borderDark flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Repeat Range:</span>
            <label className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              From
              <input
                type="number"
                min={1}
                max={totalVerses}
                value={rangeStart}
                onChange={(e) => setRangeStart(Math.max(1, Math.min(totalVerses, Number(e.target.value))))}
                className="w-12 px-1.5 py-0.5 text-center font-bold rounded border border-gray-200 dark:border-brand-borderDark bg-white dark:bg-brand-cardDark text-gray-900 dark:text-gray-100"
              />
            </label>
            <label className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              To
              <input
                type="number"
                min={1}
                max={totalVerses}
                value={rangeEnd}
                onChange={(e) => setRangeEnd(Math.max(1, Math.min(totalVerses, Number(e.target.value))))}
                className="w-12 px-1.5 py-0.5 text-center font-bold rounded border border-gray-200 dark:border-brand-borderDark bg-white dark:bg-brand-cardDark text-gray-900 dark:text-gray-100"
              />
            </label>
            <label className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              Loops
              <input
                type="number"
                min={1}
                max={50}
                value={rangeLoopsRemaining}
                onChange={(e) => setRangeLoopsRemaining(Math.max(1, Number(e.target.value)))}
                className="w-10 px-1 py-0.5 text-center font-bold rounded border border-gray-200 dark:border-brand-borderDark bg-white dark:bg-brand-cardDark text-gray-900 dark:text-gray-100"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRangeMode((prev) => !prev);
                if (!rangeMode) {
                  onSelectAya(rangeStart);
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm ${
                rangeMode
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-brand-teal text-white hover:bg-brand-tealDark'
              }`}
            >
              {rangeMode ? 'Stop Range' : 'Start Range Loop'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
