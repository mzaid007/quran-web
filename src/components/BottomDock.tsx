import React, { useState } from 'react';
import { Pause, Play, Hash, Cloud, Settings, BookmarkCheck } from 'lucide-react';
import type { LastRead } from '../types';

interface BottomDockProps {
  isPlaying: boolean;
  onPlaySurah: () => void;
  totalVerses?: number;
  onJumpToAya?: (aya: number) => void;
  syncEmail: string | null;
  onOpenSync: () => void;
  onOpenSettings: () => void;
  lastRead: LastRead | null;
  onResumeLastRead: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  isPlaying,
  onPlaySurah,
  totalVerses,
  onJumpToAya,
  syncEmail,
  onOpenSync,
  onOpenSettings,
  lastRead,
  onResumeLastRead,
}) => {
  const [showAyahPicker, setShowAyahPicker] = useState(false);

  return (
    <div className="sm:hidden fixed bottom-16 inset-x-3 z-40 animate-fade-in pointer-events-none">
      <div className="bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-lg border border-gray-200/80 dark:border-brand-borderDark shadow-xl rounded-2xl p-2 flex items-center justify-around pointer-events-auto max-w-sm mx-auto">
        {/* 1. Recite Play/Pause */}
        <button
          onClick={onPlaySurah}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
            isPlaying
              ? 'text-brand-teal font-bold bg-brand-teal/10'
              : 'text-gray-600 dark:text-gray-300 hover:text-brand-teal'
          }`}
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-brand-teal" /> : <Play className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* 2. Jump to Ayah */}
        {totalVerses && onJumpToAya && (
          <div className="relative">
            <button
              onClick={() => setShowAyahPicker(!showAyahPicker)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-brand-teal transition"
              title="Jump to Ayah"
            >
              <Hash className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Ayah</span>
            </button>

            {/* Quick Popover dropdown */}
            {showAyahPicker && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white dark:bg-brand-cardDark border border-gray-200 dark:border-brand-borderDark shadow-2xl rounded-2xl p-3 w-48 text-center">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-2">
                  Jump to Ayah (1 - {totalVerses})
                </span>
                <select
                  size={5}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    if (!isNaN(num)) {
                      onJumpToAya(num);
                      setShowAyahPicker(false);
                    }
                  }}
                  className="w-full text-xs bg-gray-50 dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-lg p-1 text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  {Array.from({ length: totalVerses }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n} className="py-1">
                      Ayah {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* 3. Last Read Quick Jump */}
        {lastRead && (
          <button
            onClick={onResumeLastRead}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition"
            title={`Resume ${lastRead.surah}:${lastRead.aya}`}
          >
            <BookmarkCheck className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] mt-0.5">{lastRead.surah}:{lastRead.aya}</span>
          </button>
        )}

        {/* 4. Cloud Sync */}
        <button
          onClick={onOpenSync}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition relative ${
            syncEmail
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-brand-teal'
          }`}
          title={syncEmail ? `Synced (${syncEmail})` : 'Cloud Sync'}
        >
          <Cloud className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{syncEmail ? 'Synced' : 'Sync'}</span>
          {syncEmail && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* 5. Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-brand-teal transition"
          title="Display & Settings"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </div>
    </div>
  );
};
