import React from 'react';
import { BookOpen, Search, Settings, Moon, Sun, Volume2, List, BookmarkCheck } from 'lucide-react';
import type { SurahMeta, LastRead } from '../types';

interface HeaderProps {
  currentSurah: SurahMeta | null;
  totalVerses?: number;
  onJumpToAya?: (aya: number) => void;
  onOpenSurahList: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onPlaySurah: () => void;
  isPlaying: boolean;
  lastRead: LastRead | null;
  onResumeLastRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSurah,
  totalVerses,
  onJumpToAya,
  onOpenSurahList,
  onOpenSearch,
  onOpenSettings,
  darkMode,
  onToggleDarkMode,
  onPlaySurah,
  isPlaying,
  lastRead,
  onResumeLastRead,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-md border-b border-gray-200 dark:border-brand-borderDark transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: App Logo & Current Surah Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSurahList}
            className="flex items-center space-x-2 text-brand-teal dark:text-emerald-400 font-semibold hover:opacity-80 transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
            title="Open Surah List"
          >
            <div className="w-9 h-9 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-teal dark:text-emerald-400" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                {currentSurah ? `Surah ${currentSurah.number} of 114` : "Al Qur'an"}
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight flex items-center gap-1.5">
                {currentSurah ? currentSurah.name : "Select Surah"}
                <List className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>
          </button>
        </div>

        {/* Center: Mobile Surah Title */}
        <button
          onClick={onOpenSurahList}
          className="sm:hidden text-center hover:opacity-80 transition"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            {currentSurah ? `Surah ${currentSurah.number}` : "Al Qur'an"}
          </div>
          <div className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-1">
            {currentSurah?.name}
            <List className="w-3 h-3 text-brand-teal" />
          </div>
        </button>

        {/* Right: Quick actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Quick Go-To Ayah Dropdown */}
          {totalVerses && onJumpToAya && (
            <div className="flex items-center mr-1">
              <select
                aria-label="Go to Ayah"
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onJumpToAya(val);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs bg-gray-100 hover:bg-gray-200/80 dark:bg-brand-cardDark dark:hover:bg-gray-800 border border-gray-200 dark:border-brand-borderDark rounded-lg px-2 py-1.5 font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-teal cursor-pointer transition"
              >
                <option value="" disabled>Ayah ▾</option>
                {Array.from({ length: totalVerses }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Ayah {num}
                  </option>
                ))}
              </select>
            </div>
          )}

          {lastRead && (
            <button
              onClick={onResumeLastRead}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition text-xs font-semibold"
              title={`Resume Last Read: Surah ${lastRead.surahName} (${lastRead.surah}:${lastRead.aya})`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Last Read:</span>
              <span>{lastRead.surah}:{lastRead.aya}</span>
            </button>
          )}

          {currentSurah && (
            <button
              onClick={onPlaySurah}
              className={`p-2 rounded-lg transition ${
                isPlaying
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
              }`}
              title={isPlaying ? "Pause Surah" : "Play Surah Recitation"}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title="Search Surahs"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title="Reading & Font Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
