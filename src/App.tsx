import { useState, useEffect, useRef } from 'react';
import { RECITERS } from './types';
import type { SurahMeta, SurahDetail, Verse, ScriptType, TranslationChoice, Reciter, LastRead, CloudSyncData, SyncConflict } from './types';
import { Header } from './components/Header';
import { SurahListModal } from './components/SurahListModal';
import { SettingsModal } from './components/SettingsModal';
import { TafsirModal } from './components/TafsirModal';
import { AudioPlayer } from './components/AudioPlayer';
import { SyncModal } from './components/SyncModal';
import { SyncConflictModal } from './components/SyncConflictModal';
import { Play, Pause, Bookmark, BookOpen, Copy, Check, ChevronLeft, ChevronRight, BookmarkCheck } from 'lucide-react';

export default function App() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const surahParam = urlParams.get('surah');
      if (surahParam) {
        const num = parseInt(surahParam, 10);
        if (!isNaN(num) && num >= 1 && num <= 114) return num;
      }
      const saved = localStorage.getItem('quran_current_surah');
      if (saved) {
        const num = parseInt(saved, 10);
        if (!isNaN(num) && num >= 1 && num <= 114) return num;
      }
    } catch {
      // fallback
    }
    return 1;
  });
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Settings with LocalStorage Persistence (IndoPak script & Roman Urdu translation as defaults, WBW disabled by default)
  const [script, setScript] = useState<ScriptType>(() => {
    const migrated = localStorage.getItem('quran_defaults_migrated_v4');
    if (!migrated) {
      localStorage.setItem('quran_defaults_migrated_v4', 'true');
      localStorage.setItem('quran_script', 'indopak');
      localStorage.setItem('quran_translation', 'romanUrdu');
      localStorage.setItem('quran_show_wbw', 'false');
      return 'indopak';
    }
    const saved = localStorage.getItem('quran_script');
    return saved === 'uthmani' || saved === 'indopak' ? saved : 'indopak';
  });
  const [translation, setTranslation] = useState<TranslationChoice>(() => {
    const migrated = localStorage.getItem('quran_defaults_migrated_v4');
    if (!migrated) {
      return 'romanUrdu';
    }
    const saved = localStorage.getItem('quran_translation');
    if (saved === 'khattab' || saved === 'saheeh' || saved === 'jalalayn' || saved === 'romanUrdu' || saved === 'none') {
      return saved;
    }
    return 'romanUrdu';
  });
  const [showWBW, setShowWBW] = useState<boolean>(() => {
    const migrated = localStorage.getItem('quran_defaults_migrated_v4');
    if (!migrated) {
      return false;
    }
    const saved = localStorage.getItem('quran_show_wbw');
    return saved !== null ? saved === 'true' : false;
  });
  const [showTransliteration, setShowTransliteration] = useState<boolean>(() => {
    const saved = localStorage.getItem('quran_show_translit');
    return saved !== null ? saved === 'true' : true;
  });
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('quran_font_size');
    const parsed = saved ? parseInt(saved, 10) : 28;
    return !isNaN(parsed) && parsed >= 18 && parsed <= 60 ? parsed : 28;
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('quran_theme') === 'dark';
  });

  // Audio State with LocalStorage Persistence
  const [currentReciter, setCurrentReciter] = useState<Reciter>(() => {
    const savedId = localStorage.getItem('quran_reciter_id');
    if (savedId) {
      const match = RECITERS.find((r) => r.id === savedId);
      if (match) return match;
    }
    return RECITERS[0];
  });
  const [playingAya, setPlayingAya] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(() => {
    const saved = localStorage.getItem('quran_auto_scroll');
    return saved !== null ? saved === 'true' : true;
  });

  // Modals
  const [isSurahListOpen, setIsSurahListOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [tafsirVerse, setTafsirVerse] = useState<Verse | null>(null);

  // Bookmarks & Copy state
  const [bookmarks, setBookmarks] = useState<{ surah: number; aya: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [copiedAya, setCopiedAya] = useState<number | null>(null);
  const [highlightedAya, setHighlightedAya] = useState<number | null>(null);
  const [jumpInputVal, setJumpInputVal] = useState<string>('');

  // Last Read state
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [targetScrollAya, setTargetScrollAya] = useState<number | null>(null);

  // Verse refs for auto-scrolling
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleJumpToAya = (ayaNum: number) => {
    if (!surahData || ayaNum < 1 || ayaNum > surahData.totalVerses) return;
    const el = verseRefs.current[ayaNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedAya(ayaNum);
      setTimeout(() => setHighlightedAya(null), 2500);
    }
  };

  // Cloud Sync State (Neon DB)
  const [syncEmail, setSyncEmail] = useState<string | null>(() => {
    return localStorage.getItem('quran_sync_email') || null;
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [syncConflict, setSyncConflict] = useState<SyncConflict | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const autoSyncTimerRef = useRef<any>(null);

  const buildLocalSyncData = (): CloudSyncData => {
    return {
      email: syncEmail || '',
      lastRead: lastRead,
      bookmarks: bookmarks,
      settings: {
        script,
        translation,
        showWBW,
        showTransliteration,
        arabicFontSize,
        darkMode,
        reciterId: currentReciter.id,
        autoScroll,
      },
    };
  };

  const applyCloudData = (data: CloudSyncData) => {
    if (data.lastRead) {
      setLastRead(data.lastRead);
      localStorage.setItem('quran_last_read', JSON.stringify(data.lastRead));
      if (data.lastRead.surah !== currentSurahNumber) {
        setTargetScrollAya(data.lastRead.aya);
        setCurrentSurahNumber(data.lastRead.surah);
      } else {
        setTimeout(() => {
          handleJumpToAya(data.lastRead!.aya);
        }, 300);
      }
    }
    if (Array.isArray(data.bookmarks)) {
      setBookmarks(data.bookmarks);
      localStorage.setItem('quran_bookmarks', JSON.stringify(data.bookmarks));
    }
    if (data.settings) {
      const s = data.settings;
      if (s.script) setScript(s.script);
      if (s.translation) setTranslation(s.translation);
      if (typeof s.showWBW === 'boolean') setShowWBW(s.showWBW);
      if (typeof s.showTransliteration === 'boolean') setShowTransliteration(s.showTransliteration);
      if (typeof s.arabicFontSize === 'number') setArabicFontSize(s.arabicFontSize);
      if (typeof s.darkMode === 'boolean') setDarkMode(s.darkMode);
      if (s.reciterId) {
        const found = RECITERS.find((r) => r.id === s.reciterId);
        if (found) setCurrentReciter(found);
      }
      if (typeof s.autoScroll === 'boolean') setAutoScroll(s.autoScroll);
    }
    setLastSyncedAt(new Date());
  };

  const handleConnectEmail = async (email: string) => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/sync?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to connect to Neon sync.');

      if (json.exists && json.data) {
        const cloudData: CloudSyncData = json.data;
        const localData = buildLocalSyncData();

        // Check for progress conflict
        const hasConflict =
          cloudData.lastRead &&
          localData.lastRead &&
          (cloudData.lastRead.surah !== localData.lastRead.surah ||
            cloudData.lastRead.aya !== localData.lastRead.aya);

        if (hasConflict) {
          setSyncEmail(email);
          localStorage.setItem('quran_sync_email', email);
          setSyncConflict({ cloud: cloudData, local: { ...localData, email } });
          setIsSyncModalOpen(false);
          return;
        }

        applyCloudData(cloudData);
        setSyncEmail(email);
        localStorage.setItem('quran_sync_email', email);
      } else {
        // First time email registered: push current local state to Neon
        const localData = buildLocalSyncData();
        const saveRes = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            lastRead: localData.lastRead || { surah: 1, surahName: 'Al-Faatiha', aya: 1, timestamp: Date.now() },
            bookmarks: localData.bookmarks,
            settings: localData.settings,
          }),
        });
        const saveJson = await saveRes.json();
        if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to initialize Neon save.');

        setSyncEmail(email);
        localStorage.setItem('quran_sync_email', email);
        setLastSyncedAt(new Date());
      }
      setIsSyncModalOpen(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResumeFromCloud = () => {
    if (!syncConflict) return;
    applyCloudData(syncConflict.cloud);
    setSyncConflict(null);
  };

  const handleOverrideCloud = async () => {
    if (!syncConflict) return;
    setIsSyncing(true);
    try {
      const localData = buildLocalSyncData();
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: syncConflict.cloud.email,
          lastRead: localData.lastRead || { surah: 1, surahName: 'Al-Faatiha', aya: 1, timestamp: Date.now() },
          bookmarks: localData.bookmarks,
          settings: localData.settings,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to override cloud save.');
      setLastSyncedAt(new Date());
      setSyncConflict(null);
    } catch (e: any) {
      alert(`Error overriding cloud: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSyncNow = async () => {
    if (!syncEmail) return;
    setIsSyncing(true);
    try {
      const localData = buildLocalSyncData();
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: syncEmail,
          lastRead: localData.lastRead || { surah: 1, surahName: 'Al-Faatiha', aya: 1, timestamp: Date.now() },
          bookmarks: localData.bookmarks,
          settings: localData.settings,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to sync with Neon.');
      setLastSyncedAt(new Date());
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectSync = () => {
    setSyncEmail(null);
    localStorage.removeItem('quran_sync_email');
    setLastSyncedAt(null);
    setIsSyncModalOpen(false);
  };

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('quran_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('quran_theme', 'light');
    }
  }, [darkMode]);

  // Persist settings changes
  useEffect(() => {
    localStorage.setItem('quran_script', script);
  }, [script]);

  useEffect(() => {
    localStorage.setItem('quran_translation', translation);
  }, [translation]);

  useEffect(() => {
    localStorage.setItem('quran_show_wbw', String(showWBW));
  }, [showWBW]);

  useEffect(() => {
    localStorage.setItem('quran_show_translit', String(showTransliteration));
  }, [showTransliteration]);

  useEffect(() => {
    localStorage.setItem('quran_font_size', String(arabicFontSize));
  }, [arabicFontSize]);

  useEffect(() => {
    localStorage.setItem('quran_reciter_id', currentReciter.id);
  }, [currentReciter]);

  useEffect(() => {
    localStorage.setItem('quran_auto_scroll', String(autoScroll));
  }, [autoScroll]);

  useEffect(() => {
    localStorage.setItem('quran_current_surah', String(currentSurahNumber));
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('surah') !== String(currentSurahNumber)) {
        url.searchParams.set('surah', String(currentSurahNumber));
        window.history.replaceState(null, '', url.toString());
      }
    } catch {
      // ignore
    }
  }, [currentSurahNumber]);

  // Initial cloud check on mount if an email is linked
  useEffect(() => {
    if (!syncEmail) return;
    const fetchOnLoad = async () => {
      try {
        const res = await fetch(`/api/sync?email=${encodeURIComponent(syncEmail)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.exists && json.data) {
          const cloudData: CloudSyncData = json.data;
          const localData = buildLocalSyncData();

          const cloudTime = cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : 0;
          const localTime = localData.lastRead?.timestamp || 0;

          // If cloud has a different reading progress
          if (
            cloudData.lastRead &&
            (!localData.lastRead ||
              cloudData.lastRead.surah !== localData.lastRead.surah ||
              cloudData.lastRead.aya !== localData.lastRead.aya)
          ) {
            // Guard: If this local device was also actively modified, open Conflict Guard Modal
            if (localTime > 0 && Math.abs(cloudTime - localTime) > 60000) {
              setSyncConflict({ cloud: cloudData, local: localData });
            } else {
              // Otherwise seamlessly resume from cloud
              applyCloudData(cloudData);
            }
          }
        }
      } catch {
        // silent fail on network error / offline
      }
    };
    fetchOnLoad();
  }, [syncEmail]);

  // Debounced auto-sync to Neon when reading progress or settings change
  useEffect(() => {
    if (!syncEmail) return;
    if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);

    autoSyncTimerRef.current = setTimeout(async () => {
      try {
        const localData = buildLocalSyncData();
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: syncEmail,
            lastRead: localData.lastRead || {
              surah: currentSurahNumber,
              surahName: surahData?.name || '',
              aya: 1,
              timestamp: Date.now(),
            },
            bookmarks: localData.bookmarks,
            settings: localData.settings,
          }),
        });
        setLastSyncedAt(new Date());
      } catch {
        // offline
      }
    }, 2500);

    return () => {
      if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    };
  }, [
    syncEmail,
    lastRead,
    bookmarks,
    script,
    translation,
    showWBW,
    showTransliteration,
    arabicFontSize,
    darkMode,
    currentReciter,
    autoScroll,
  ]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const surahParam = urlParams.get('surah');
        if (surahParam) {
          const num = parseInt(surahParam, 10);
          if (!isNaN(num) && num >= 1 && num <= 114 && num !== currentSurahNumber) {
            setCurrentSurahNumber(num);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentSurahNumber]);

  // Load master surahs index
  useEffect(() => {
    fetch('/data/surahs.json')
      .then((res) => res.json())
      .then((data: SurahMeta[]) => {
        setSurahs(data);
      })
      .catch((err) => console.error('Failed to load surahs metadata:', err));
  }, []);

  // Load active surah data
  useEffect(() => {
    setLoading(true);
    fetch(`/data/surah_${currentSurahNumber}.json`)
      .then((res) => res.json())
      .then((data: SurahDetail) => {
        setSurahData(data);
        setLoading(false);
        if (targetScrollAya) {
          setTimeout(() => {
            verseRefs.current[targetScrollAya]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTargetScrollAya(null);
          }, 350);
        } else {
          // Scroll to top on regular new surah
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
      .catch((err) => {
        console.error('Failed to load surah details:', err);
        setLoading(false);
      });
  }, [currentSurahNumber, targetScrollAya]);

  // Handle auto-scroll when audio advances
  useEffect(() => {
    if (autoScroll && playingAya && verseRefs.current[playingAya]) {
      verseRefs.current[playingAya]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [playingAya, autoScroll]);

  // Audio actions
  const handleTogglePlaySurah = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setPlayingAya(playingAya || 1);
      setIsPlaying(true);
    }
  };

  const handlePlaySingleAya = (ayaNum: number) => {
    if (playingAya === ayaNum && isPlaying) {
      setIsPlaying(false);
    } else {
      setPlayingAya(ayaNum);
      setIsPlaying(true);
    }
  };

  const handleNextAya = () => {
    if (surahData && playingAya && playingAya < surahData.totalVerses) {
      setPlayingAya(playingAya + 1);
    }
  };

  const handlePrevAya = () => {
    if (playingAya && playingAya > 1) {
      setPlayingAya(playingAya - 1);
    }
  };

  const handleBookmarkToggle = (ayaNum: number) => {
    const exists = bookmarks.some((b) => b.surah === currentSurahNumber && b.aya === ayaNum);
    let updated;
    if (exists) {
      updated = bookmarks.filter((b) => !(b.surah === currentSurahNumber && b.aya === ayaNum));
    } else {
      updated = [...bookmarks, { surah: currentSurahNumber, aya: ayaNum }];
    }
    setBookmarks(updated);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
  };

  const handleMarkLastRead = (ayaNum: number) => {
    if (!surahData) return;
    const entry: LastRead = {
      surah: currentSurahNumber,
      surahName: surahData.name,
      aya: ayaNum,
      timestamp: Date.now(),
    };
    setLastRead(entry);
    localStorage.setItem('quran_last_read', JSON.stringify(entry));
  };

  const handleResumeLastRead = () => {
    if (!lastRead) return;
    if (lastRead.surah !== currentSurahNumber) {
      setTargetScrollAya(lastRead.aya);
      setCurrentSurahNumber(lastRead.surah);
    } else {
      verseRefs.current[lastRead.aya]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyVerse = (verse: Verse) => {
    const arabicText = script === 'uthmani' ? verse.uthmani : verse.indopak;
    const transText =
      translation === 'khattab'
        ? verse.khattab
        : translation === 'romanUrdu'
        ? (verse.romanUrdu || verse.khattab)
        : translation === 'saheeh'
        ? verse.saheeh
        : verse.jalalayn;

    const copyText = `${arabicText}\n\n"${transText}"\n— [Surah ${surahData?.name} ${currentSurahNumber}:${verse.aya}]`;
    navigator.clipboard.writeText(copyText);
    setCopiedAya(verse.aya);
    setTimeout(() => setCopiedAya(null), 2000);
  };

  const currentSurahMeta = surahs.find((s) => s.number === currentSurahNumber) || null;

  return (
    <div className="min-h-screen bg-[#FDFCF7] dark:bg-brand-surfaceDark text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Top App Header (Option 2: Clean Minimal Top Navigation) */}
      <Header
        currentSurah={currentSurahMeta}
        onOpenSurahList={() => setIsSurahListOpen(true)}
        onOpenSearch={() => setIsSurahListOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onPlaySurah={handleTogglePlaySurah}
        isPlaying={isPlaying}
        lastRead={lastRead}
        onResumeLastRead={handleResumeLastRead}
        syncEmail={syncEmail}
        onOpenSync={() => setIsSyncModalOpen(true)}
        isSyncing={isSyncing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading Holy Qur'an...</p>
          </div>
        ) : surahData ? (
          <div>
            {/* Surah Header Card matching original app */}
            <div className="relative overflow-hidden bg-white dark:bg-brand-cardDark rounded-3xl p-6 sm:p-8 mb-8 border border-gray-200/80 dark:border-brand-borderDark shadow-sm text-center">
              {/* Subtle background arabesque glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Surah Calligraphy Ornament Image from APK */}
                <img
                  src={`/snames/sname_${surahData.number}.png`}
                  alt={surahData.name}
                  className="h-16 sm:h-20 object-contain dark:invert dark:brightness-125 mb-3"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                  {surahData.name}
                </h1>

                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400">
                    {surahData.revelationType}
                  </span>
                  <span>•</span>
                  <span>{surahData.totalVerses} Verses</span>
                  <span>•</span>
                  <span>Surah {surahData.number}</span>
                </div>

                {/* Quick translation mode pill */}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Translation:</span>
                  <span className="font-bold text-brand-teal dark:text-emerald-400">
                    {translation === 'khattab'
                      ? 'The Clear Quran (Dr. Mustafa Khattab)'
                      : translation === 'romanUrdu'
                      ? 'Roman Urdu (Maududi)'
                      : translation === 'saheeh'
                      ? 'Saheeh International'
                      : translation === 'jalalayn'
                      ? 'Tafsir al-Jalalayn'
                      : 'None'}
                  </span>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="underline hover:text-brand-teal transition text-[11px]"
                  >
                    Change
                  </button>
                </div>

                {/* Jump to Verse Bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-brand-borderDark/60 w-full max-w-md flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Go to Verse:
                  </span>

                  <select
                    value=""
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10);
                      if (!isNaN(num)) handleJumpToAya(num);
                    }}
                    className="text-xs bg-gray-50 dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-lg px-2.5 py-1.5 font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-teal cursor-pointer"
                  >
                    <option value="" disabled>Select Ayah (1 - {surahData.totalVerses})</option>
                    {Array.from({ length: surahData.totalVerses }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        Ayah {num}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs text-gray-400">or</span>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const num = parseInt(jumpInputVal, 10);
                      if (!isNaN(num)) {
                        handleJumpToAya(num);
                        setJumpInputVal('');
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="number"
                      min={1}
                      max={surahData.totalVerses}
                      placeholder={`1-${surahData.totalVerses}`}
                      value={jumpInputVal}
                      onChange={(e) => setJumpInputVal(e.target.value)}
                      className="w-20 text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark rounded-lg text-center text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                    <button
                      type="submit"
                      disabled={!jumpInputVal}
                      className="px-2.5 py-1.5 bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bismillah Ornament (for all Surahs except At-Tawbah) */}
            {surahData.bismillah && (
              <div className="text-center my-6 py-4">
                <div
                  className={`${
                    script === 'uthmani' ? 'quran-uthmani' : 'quran-indopak'
                  } text-3xl sm:text-4xl text-gray-800 dark:text-gray-200 leading-relaxed`}
                  style={{ fontSize: `${arabicFontSize + 6}px` }}
                >
                  {script === 'uthmani'
                    ? 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ'
                    : 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ'}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 italic mt-1 font-sans">
                  In the Name of Allah—the Most Compassionate, Most Merciful
                </div>
              </div>
            )}

            {/* Ayahs List */}
            <div className="space-y-6 sm:space-y-8">
              {surahData.verses.map((verse) => {
                const isCurrentPlaying = playingAya === verse.aya;
                const isBookmarked = bookmarks.some(
                  (b) => b.surah === currentSurahNumber && b.aya === verse.aya
                );
                const isLastRead = lastRead?.surah === currentSurahNumber && lastRead?.aya === verse.aya;
                const arabicText = script === 'uthmani' ? verse.uthmani : verse.indopak;

                return (
                  <div
                    key={verse.aya}
                    ref={(el) => {
                      verseRefs.current[verse.aya] = el;
                    }}
                    className={`rounded-2xl p-5 sm:p-7 transition-all duration-300 border ${
                      highlightedAya === verse.aya
                        ? 'ring-2 ring-brand-teal bg-brand-teal/10 dark:bg-brand-teal/20 border-brand-teal shadow-lg scale-[1.005]'
                        : isCurrentPlaying
                        ? 'bg-brand-teal/5 dark:bg-brand-teal/15 border-brand-teal/40 shadow-md ring-1 ring-brand-teal/30'
                        : isLastRead
                        ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.07] border-amber-500/40 shadow-sm'
                        : 'bg-white dark:bg-brand-cardDark border-gray-200/70 dark:border-brand-borderDark hover:border-gray-300 dark:hover:border-gray-700 shadow-sm'
                    }`}
                  >
                    {/* Verse Header Row: Number Badge & Actions */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-brand-borderDark/60">
                      {/* Left: Ayah Badge */}
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-brand-teal/20">
                          {currentSurahNumber}:{verse.aya}
                        </div>
                        {isLastRead && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full">
                            <BookmarkCheck className="w-3 h-3" />
                            Last Read
                          </span>
                        )}
                        {isCurrentPlaying && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal animate-pulse">
                            Reciting
                          </span>
                        )}
                      </div>

                      {/* Right: Quick Verse Actions */}
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Mark as Last Read */}
                        <button
                          onClick={() => handleMarkLastRead(verse.aya)}
                          className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs ${
                            isLastRead
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold'
                              : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-brand-cardDark'
                          }`}
                          title={isLastRead ? "Current Last Read verse" : "Mark as Last Read"}
                        >
                          <BookmarkCheck className={`w-4 h-4 ${isLastRead ? 'text-amber-500' : ''}`} />
                          <span className="hidden sm:inline text-[11px] font-medium">
                            {isLastRead ? 'Saved' : 'Last Read'}
                          </span>
                        </button>

                        {/* Play Single Ayah */}
                        <button
                          onClick={() => handlePlaySingleAya(verse.aya)}
                          className={`p-1.5 rounded-lg transition ${
                            isCurrentPlaying && isPlaying
                              ? 'bg-brand-teal text-white'
                              : 'text-gray-500 hover:text-brand-teal hover:bg-gray-100 dark:hover:bg-brand-cardDark'
                          }`}
                          title="Recite this verse"
                        >
                          {isCurrentPlaying && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>

                        {/* Tafsir Drawer */}
                        <button
                          onClick={() => setTafsirVerse(verse)}
                          className="p-1.5 text-gray-500 hover:text-brand-teal dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition flex items-center gap-1 text-xs"
                          title="View Tafsir al-Jalalayn"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span className="hidden sm:inline text-[11px] font-medium">Tafsir</span>
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() => handleBookmarkToggle(verse.aya)}
                          className={`p-1.5 rounded-lg transition ${
                            isBookmarked
                              ? 'text-brand-teal dark:text-emerald-400'
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark'
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Verse"}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopyVerse(verse)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
                          title="Copy Arabic & Translation"
                        >
                          {copiedAya === verse.aya ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Word-by-Word View */}
                    {showWBW && verse.wbw && verse.wbw.length > 0 ? (
                      <div className="mb-6 pb-2">
                        <div
                          className="flex flex-wrap flex-row-reverse gap-2.5 sm:gap-3 py-2 items-start justify-start"
                          dir="rtl"
                        >
                          {verse.wbw.map((w, idx) => (
                            <div
                              key={idx}
                              className="group flex flex-col items-center justify-between min-w-[50px] bg-gray-50/80 dark:bg-brand-surfaceDark/80 hover:bg-brand-teal/10 dark:hover:bg-brand-teal/20 px-3 py-2 rounded-xl border border-gray-100 dark:border-brand-borderDark transition-all duration-200"
                            >
                              {/* Word Arabic Text */}
                              <span
                                className={`${
                                  script === 'uthmani' ? 'quran-uthmani' : 'quran-indopak'
                                } wbw-arabic text-gray-900 dark:text-gray-100 select-text`}
                                style={{ fontSize: `${arabicFontSize}px` }}
                              >
                                {w.arabic}
                              </span>
                              {/* Word Translation */}
                              <span
                                className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 group-hover:text-brand-teal font-sans mt-2 text-center font-normal leading-tight"
                                dir="ltr"
                              >
                                {w.translation}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Classic Flowing Calligraphy Verse */
                      <div className="mb-6 pb-2 text-right select-text">
                        <p
                          className={`${
                            script === 'uthmani' ? 'quran-uthmani' : 'quran-indopak'
                          } text-gray-900 dark:text-gray-100`}
                          style={{ fontSize: `${arabicFontSize}px` }}
                        >
                          {arabicText}
                          <span className="inline-flex items-center justify-center w-7 h-7 mx-2 text-xs text-brand-teal border border-brand-teal/40 rounded-full font-sans select-none align-middle font-bold shrink-0">
                            {verse.aya}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {showTransliteration && verse.transliteration && (
                      <div
                        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic mb-4 font-serif select-text tracking-wide"
                        dangerouslySetInnerHTML={{ __html: verse.transliteration }}
                      />
                    )}

                    {/* Translation */}
                    {translation !== 'none' && (
                      <div className="pt-4 sm:pt-5 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed font-sans select-text border-t border-gray-100 dark:border-brand-borderDark/60">
                        {translation === 'khattab' && (
                          <div>
                            <span>{verse.khattab || verse.saheeh}</span>
                            <span className="block text-[10px] text-brand-teal dark:text-emerald-400 font-semibold mt-1">
                              — The Clear Quran (Dr. Mustafa Khattab)
                            </span>
                          </div>
                        )}
                        {translation === 'romanUrdu' && (
                          <div>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {verse.romanUrdu || verse.khattab}
                            </span>
                            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                              — Roman Urdu (Syed Abul A'la Maududi - Tafheem-ul-Quran)
                            </span>
                          </div>
                        )}
                        {translation === 'saheeh' && (
                          <div>
                            <span>{verse.saheeh}</span>
                            <span className="block text-[10px] text-gray-400 mt-1">
                              — Saheeh International
                            </span>
                          </div>
                        )}
                        {translation === 'jalalayn' && (
                          <div>
                            <span className="font-serif">{verse.jalalayn}</span>
                            <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                              — Tafsir al-Jalalayn
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next / Previous Surah Navigation Bar */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-brand-borderDark flex items-center justify-between">
              <button
                disabled={currentSurahNumber <= 1}
                onClick={() => setCurrentSurahNumber(currentSurahNumber - 1)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-brand-borderDark disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-brand-cardDark transition font-semibold text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Surah</span>
              </button>

              <button
                disabled={currentSurahNumber >= 114}
                onClick={() => setCurrentSurahNumber(currentSurahNumber + 1)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-brand-borderDark disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-brand-cardDark transition font-semibold text-sm"
              >
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load Surah data.</div>
        )}
      </main>

      {/* Floating Audio Player when active */}
      {playingAya && surahData && (
        <AudioPlayer
          surahNumber={currentSurahNumber}
          totalVerses={surahData.totalVerses}
          currentAya={playingAya}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNextAya={handleNextAya}
          onPrevAya={handlePrevAya}
          onClose={() => {
            setIsPlaying(false);
            setPlayingAya(null);
          }}
          reciter={currentReciter}
          autoScroll={autoScroll}
          onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
        />
      )}

      {/* Modals */}
      <SurahListModal
        isOpen={isSurahListOpen}
        onClose={() => setIsSurahListOpen(false)}
        surahs={surahs}
        currentSurahNumber={currentSurahNumber}
        onSelectSurah={(num) => setCurrentSurahNumber(num)}
        bookmarks={bookmarks}
        lastRead={lastRead}
        onResumeLastRead={handleResumeLastRead}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        script={script}
        onChangeScript={setScript}
        translation={translation}
        onChangeTranslation={setTranslation}
        showWBW={showWBW}
        onToggleWBW={() => setShowWBW(!showWBW)}
        showTransliteration={showTransliteration}
        onToggleTransliteration={() => setShowTransliteration(!showTransliteration)}
        arabicFontSize={arabicFontSize}
        onChangeArabicFontSize={setArabicFontSize}
        currentReciter={currentReciter}
        onChangeReciter={setCurrentReciter}
        syncEmail={syncEmail}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncEmail={syncEmail}
        onConnectEmail={handleConnectEmail}
        onSyncNow={handleManualSyncNow}
        onDisconnect={handleDisconnectSync}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        lastRead={lastRead}
        bookmarksCount={bookmarks.length}
      />

      <SyncConflictModal
        conflict={syncConflict}
        onClose={() => setSyncConflict(null)}
        onResumeFromCloud={handleResumeFromCloud}
        onOverrideCloud={handleOverrideCloud}
      />

      <TafsirModal
        isOpen={!!tafsirVerse}
        onClose={() => setTafsirVerse(null)}
        surahNumber={currentSurahNumber}
        surahName={surahData?.name || ''}
        verse={tafsirVerse}
      />
    </div>
  );
}
