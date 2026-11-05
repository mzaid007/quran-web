import React from 'react';
import { BookOpen, Search, Settings, Moon, Sun, Volume2, List, BookmarkCheck, Cloud, Pause } from 'lucide-react';
import type { SurahMeta, LastRead } from '../types';
import type { UiOption } from './DemoSwitcher';

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
  syncEmail: string | null;
  onOpenSync: () => void;
  isSyncing: boolean;
  uiVariant: UiOption;
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
  syncEmail,
  onOpenSync,
  isSyncing,
  uiVariant,
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
                <span className="truncate max-w-[110px] sm:max-w-[180px]">
                  {currentSurah ? currentSurah.name : 'Select Surah'}
                </span>
                <List className="w-3 h-3 opacity-60 shrink-0" />
              </div>
            </div>
          </button>
        </div>

        {/* =========================================================================
            OPTION 3: MINIMAL TOP HEADER (on mobile, heavy controls live in Bottom Dock)
           ========================================================================= */}
        {uiVariant === 'option3' ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop only expanded actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {lastRead && (
                <button
                  onClick={onResumeLastRead}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition text-xs font-semibold"
                  title={`Resume Last Read: ${lastRead.surah}:${lastRead.aya}`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Last Read: {lastRead.surah}:{lastRead.aya}</span>
                </button>
              )}

              {currentSurah && (
                <button
                  onClick={onPlaySurah}
                  className={`p-2 rounded-lg transition ${
                    isPlaying ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
                  }`}
                  title={isPlaying ? 'Pause Surah' : 'Play Recitation'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={onOpenSync}
                className="p-2 rounded-lg transition relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark"
                title={syncEmail ? `Cloud Synced (${syncEmail})` : 'Cloud Sync'}
              >
                <Cloud className={`w-5 h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
                {syncEmail && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {/* Mobile & Desktop common clean icons */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title="Search Surahs"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={onOpenSettings}
              className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        ) : uiVariant === 'option2' ? (
          /* =========================================================================
             OPTION 2: MINIMAL TOP NAV (No Ayah select in header; Jump is in Surah Card)
             ========================================================================= */
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {lastRead && (
              <button
                onClick={onResumeLastRead}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition text-xs font-semibold"
                title={`Resume ${lastRead.surah}:${lastRead.aya}`}
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Last Read:</span>
                <span>{lastRead.surah}:{lastRead.aya}</span>
              </button>
            )}

            {currentSurah && (
              <button
                onClick={onPlaySurah}
                className={`p-1.5 sm:p-2 rounded-lg transition ${
                  isPlaying ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
                }`}
                title={isPlaying ? 'Pause Surah' : 'Play Recitation'}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}

            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title="Search Surahs"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onOpenSync}
              className="p-1.5 sm:p-2 rounded-lg transition relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark"
              title={syncEmail ? `Cloud Synced (${syncEmail})` : 'Cloud Sync'}
            >
              <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
              {syncEmail && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />}
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onToggleDarkMode}
              className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          /* =========================================================================
             OPTION 1: RESPONSIVE HIERARCHY (Compact mobile elements, full desktop)
             ========================================================================= */
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Ayah selector: Compact on mobile, full on desktop */}
            {totalVerses && onJumpToAya && (
              <div className="flex items-center">
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
                  className="text-[11px] sm:text-xs bg-gray-100 hover:bg-gray-200/80 dark:bg-brand-cardDark dark:hover:bg-gray-800 border border-gray-200 dark:border-brand-borderDark rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5 font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-teal cursor-pointer transition max-w-[68px] sm:max-w-none"
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

            {/* Last Read: Visible only on tablet/desktop to avoid mobile header wrapping */}
            {lastRead && (
              <button
                onClick={onResumeLastRead}
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 transition text-xs font-semibold"
                title={`Resume Last Read: ${lastRead.surah}:${lastRead.aya}`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Last Read: {lastRead.surah}:{lastRead.aya}</span>
              </button>
            )}

            {/* Play Button */}
            {currentSurah && (
              <button
                onClick={onPlaySurah}
                className={`p-1.5 sm:p-2 rounded-lg transition ${
                  isPlaying ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
                }`}
                title={isPlaying ? 'Pause Surah' : 'Play Recitation'}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title="Search Surahs"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cloud Sync: Icon on desktop; accessible via Settings on mobile */}
            <button
              onClick={onOpenSync}
              className="hidden sm:inline-flex p-2 rounded-lg transition relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark"
              title={syncEmail ? `Cloud Synced (${syncEmail})` : 'Cloud Sync'}
            >
              <Cloud className={`w-5 h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
              {syncEmail && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />}
            </button>

            {/* Settings (Shows green sync dot on mobile if cloud is connected) */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition relative"
              title="Settings & Cloud Sync"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              {syncEmail && (
                <span className="sm:hidden absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-brand-surfaceDark" />
              )}
            </button>

            {/* Dark Mode toggle: Visible on desktop */}
            <button
              onClick={onToggleDarkMode}
              className="hidden sm:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
