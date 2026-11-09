import React from 'react';
import { BookOpen, Search, Settings, Moon, Sun, Volume2, List, BookmarkCheck, Cloud, Pause, HelpCircle } from 'lucide-react';
import type { SurahMeta, LastRead } from '../types';

interface HeaderProps {
  currentSurah: SurahMeta | null;
  onOpenSurahList: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenWaqfSigns: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onPlaySurah: () => void;
  isPlaying: boolean;
  lastRead: LastRead | null;
  onResumeLastRead: () => void;
  syncEmail: string | null;
  onOpenSync: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSurah,
  onOpenSurahList,
  onOpenSearch,
  onOpenSettings,
  onOpenWaqfSigns,
  darkMode,
  onToggleDarkMode,
  onPlaySurah,
  isPlaying,
  lastRead,
  onResumeLastRead,
  syncEmail,
  onOpenSync,
  isSyncing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-md border-b border-gray-200 dark:border-brand-borderDark transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 overflow-hidden">
        {/* Left: App Logo & Current Surah Navigation */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenSurahList}
            className="flex items-center space-x-2 text-brand-teal dark:text-emerald-400 font-semibold hover:opacity-80 transition p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
            title="Open Surah List"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-teal dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-normal leading-tight hidden xs:block">
                {currentSurah ? `Surah ${currentSurah.number} / 114` : "Al Qur'an"}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight flex items-center gap-1">
                <span className="truncate max-w-[120px] sm:max-w-[200px]">
                  {currentSurah ? currentSurah.name : 'Select Surah'}
                </span>
                <List className="w-3 h-3 opacity-60 shrink-0" />
              </div>
            </div>
          </button>
        </div>

        {/* Right: Quick actions (Option 2 - Clean Minimal Toolbar) */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Last Read Quick Pill */}
          {lastRead && (
            <button
              onClick={onResumeLastRead}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition text-xs font-semibold"
              title={`Resume Last Read: ${lastRead.surah}:${lastRead.aya}`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="hidden md:inline">Last Read:</span>
              <span>{lastRead.surah}:{lastRead.aya}</span>
            </button>
          )}

          {/* Audio Recitation Play / Pause */}
          {currentSurah && (
            <button
              onClick={onPlaySurah}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                isPlaying
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
              }`}
              title={isPlaying ? 'Pause Recitation' : 'Play Recitation'}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Search Surahs */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title="Search Surahs"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Multi-Device Cloud Sync */}
          <button
            onClick={onOpenSync}
            className={`p-1.5 sm:p-2 rounded-lg transition relative ${
              syncEmail
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
            }`}
            title={syncEmail ? `Cloud Synced (${syncEmail})` : 'Connect Multi-Device Cloud Sync'}
          >
            <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
            {syncEmail && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-brand-surfaceDark" />
            )}
          </button>

          {/* Qur’anic Pause & Stop Signs Guide */}
          <button
            onClick={onOpenWaqfSigns}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition flex items-center gap-1"
            title="Qur’anic Pause & Stop Signs (علامات الوقف)"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden lg:inline text-xs font-semibold">Stop Signs</span>
          </button>

          {/* Display & Reading Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title="Reading & Font Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
