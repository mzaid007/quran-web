import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from 'lucide-react';
import type { Reciter } from '../types';

interface AudioPlayerProps {
  surahNumber: number;
  totalVerses: number;
  currentAya: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextAya: () => void;
  onPrevAya: () => void;
  onClose: () => void;
  reciter: Reciter;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surahNumber,
  totalVerses,
  currentAya,
  isPlaying,
  onTogglePlay,
  onNextAya,
  onPrevAya,
  onClose,
  reciter,
  autoScroll,
  onToggleAutoScroll,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pad numbers to 3 digits (e.g. 1 -> 001)
  const suraPad = surahNumber.toString().padStart(3, '0');
  const ayaPad = currentAya.toString().padStart(3, '0');
  const audioUrl = `https://everyayah.com/data/${reciter.subfolder}/${suraPad}${ayaPad}.mp3`;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    audio.src = audioUrl;

    const handleEnded = () => {
      if (currentAya < totalVerses) {
        onNextAya();
      } else {
        onTogglePlay(); // stop at end
      }
    };

    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay may be restricted until user interacts
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, isPlaying, currentAya, totalVerses, onNextAya, onTogglePlay]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-brand-borderDark p-3 px-4 flex items-center justify-between animate-slide-up">
      {/* Track info */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-brand-teal/15 flex items-center justify-center text-brand-teal flex-shrink-0">
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
            Ayah {currentAya} of {totalVerses}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
            {reciter.name}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
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
          title={isPlaying ? "Pause" : "Play"}
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
  );
};
