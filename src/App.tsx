import { useState, useEffect, useRef } from 'react';
import { RECITERS } from './types';
import type { SurahMeta, SurahDetail, Verse, WBWWord, ScriptType, TranslationChoice, TafsirId, Reciter, LastRead, CloudSyncData, SyncConflict, SyncedSettings } from './types';
import { getScriptFontClass, getScriptArabicText, getScriptBismillah, getWbwScriptText, getWbwWordAudioUrl } from './types';
import { Header } from './components/Header';
import { SurahListModal } from './components/SurahListModal';
import { SettingsModal } from './components/SettingsModal';
import { TafsirModal } from './components/TafsirModal';
import { ShareVerseModal } from './components/ShareVerseModal';
import { AudioPlayer } from './components/AudioPlayer';
import { SyncModal } from './components/SyncModal';
import { SyncConflictModal } from './components/SyncConflictModal';
import { WaqfSignsModal } from './components/WaqfSignsModal';
import { WaqfSignMarker } from './components/WaqfSignMarker';
import { WordBreakdownModal } from './components/WordBreakdownModal';
import { ArabicLettersGuideModal } from './components/ArabicLettersGuideModal';
import { getWaqfSignByChar } from './data/waqfSigns';
import { playPronunciationClip, playAudioSequence, stopPronunciationAudio } from './utils/pronunciationAudio';
import { Play, Pause, Bookmark, BookOpen, Copy, Check, ChevronLeft, ChevronRight, BookmarkCheck, Share2, Volume2, Sparkles, GraduationCap } from 'lucide-react';

const VALID_TAFSIRS: TafsirId[] = ['kathir_roman', 'kathir_en', 'kathir_ur', 'jalalayn'];

function ensureDefaultsMigratedV5() {
  if (!localStorage.getItem('quran_defaults_migrated_v5')) {
    localStorage.setItem('quran_defaults_migrated_v5', 'true');
    localStorage.setItem('quran_script', 'indopak-majeed');
    localStorage.setItem('quran_translation', 'romanUrdu');
    localStorage.setItem('quran_show_wbw', 'false');
  }
}

function getSyncSnapshot(data: {
  lastRead: LastRead | null;
  bookmarks: { surah: number; aya: number }[];
  settings: SyncedSettings;
}): string {
  return JSON.stringify({
    lastRead: data.lastRead,
    bookmarks: data.bookmarks,
    settings: data.settings,
  });
}

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

  // Settings with LocalStorage Persistence (IndoPak Majeed well-spaced script & Roman Urdu translation as defaults, WBW disabled by default)
  const [script, setScript] = useState<ScriptType>(() => {
    ensureDefaultsMigratedV5();
    const saved = localStorage.getItem('quran_script');
    return saved === 'uthmani' || saved === 'indopak' || saved === 'indopak-saleem' || saved === 'indopak-majeed' ? saved : 'indopak-majeed';
  });
  const [translation, setTranslation] = useState<TranslationChoice>(() => {
    ensureDefaultsMigratedV5();
    const saved = localStorage.getItem('quran_translation');
    if (saved === 'khattab' || saved === 'saheeh' || saved === 'jalalayn' || saved === 'romanUrdu' || saved === 'none') {
      return saved;
    }
    return 'romanUrdu';
  });
  const [showWBW, setShowWBW] = useState<boolean>(() => {
    ensureDefaultsMigratedV5();
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

  // Modals & Novice Pronunciation Learning State
  const [isSurahListOpen, setIsSurahListOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isWaqfSignsModalOpen, setIsWaqfSignsModalOpen] = useState<boolean>(false);
  const [isLettersGuideOpen, setIsLettersGuideOpen] = useState<boolean>(false);
  const [guideInitialLetterId, setGuideInitialLetterId] = useState<string | undefined>(undefined);
  const [breakdownTarget, setBreakdownTarget] = useState<{ surah: number; aya: number; word: WBWWord } | null>(null);
  const [playingWordKey, setPlayingWordKey] = useState<string | null>(null);
  const [tapWordsMode, setTapWordsMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('quran_tap_words_mode');
    return saved === 'true';
  });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef<boolean>(false);
  const [tafsirVerse, setTafsirVerse] = useState<Verse | null>(null);
  const [sharingVerse, setSharingVerse] = useState<Verse | null>(null);
  const [preferredTafsir, setPreferredTafsir] = useState<TafsirId>(() => {
    const saved = localStorage.getItem('quran_preferred_tafsir');
    if (saved === 'kathir_roman' || saved === 'kathir_en' || saved === 'kathir_ur' || saved === 'jalalayn') {
      return saved as TafsirId;
    }
    return 'kathir_roman';
  });

  const handlePreferredTafsirChange = (t: TafsirId) => {
    setPreferredTafsir(t);
    localStorage.setItem('quran_preferred_tafsir', t);
  };

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

  const handleNavigateToAyah = (surahNum: number, ayaNum: number) => {
    if (surahNum === currentSurahNumber) {
      handleJumpToAya(ayaNum);
    } else {
      setTargetScrollAya(ayaNum);
      setCurrentSurahNumber(surahNum);
    }
  };

  const renderArabicWithWaqfHints = (text: string) => {
    if (!text) return null;
    const parts = text.split(/([\u06D6-\u06DC\u0615\u06DE\u06E9])/);
    return parts.map((part, index) => {
      if (index % 2 === 1 && getWaqfSignByChar(part)) {
        return (
          <WaqfSignMarker
            key={index}
            char={part}
            onOpenModal={() => setIsWaqfSignsModalOpen(true)}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Cloud Sync State (Neon DB)
  const [syncEmail, setSyncEmail] = useState<string | null>(() => {
    return localStorage.getItem('quran_sync_email') || null;
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [syncConflict, setSyncConflict] = useState<SyncConflict | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isFetchingCloudOnLoad, setIsFetchingCloudOnLoad] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const autoSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedSnapshotRef = useRef<string | null>(null);

  const buildLocalSyncData = (): CloudSyncData => {
    return {
      email: syncEmail || '',
      lastRead: lastRead,
      bookmarks: bookmarks,
      settings: {
        script,
        translation,
        showWBW,
        tapWordsMode,
        showTransliteration,
        arabicFontSize,
        darkMode,
        reciterId: currentReciter.id,
        autoScroll,
        preferredTafsir,
      },
    };
  };

  const pushSyncToCloud = async (email: string, data: CloudSyncData) => {
    const payloadLastRead = data.lastRead || {
      surah: currentSurahNumber,
      surahName: surahData?.name || 'Al-Faatiha',
      aya: 1,
      timestamp: Date.now(),
    };
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        lastRead: payloadLastRead,
        bookmarks: data.bookmarks,
        settings: data.settings,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to sync with Neon.');

    const serverUpdatedAt = json.data?.updatedAt
      ? new Date(json.data.updatedAt).getTime()
      : Date.now();
    localStorage.setItem('quran_local_modified_at', String(serverUpdatedAt));
    lastSyncedSnapshotRef.current = getSyncSnapshot({
      lastRead: data.lastRead,
      bookmarks: data.bookmarks,
      settings: data.settings,
    });
    setLastSyncedAt(new Date());
    return json;
  };

  const applyCloudData = (data: CloudSyncData) => {
    const s = data.settings;
    const nextLastRead = data.lastRead ?? lastRead;
    const nextBookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : bookmarks;
    const nextScript = s?.script || script;
    const nextTranslation = s?.translation || translation;
    const nextShowWBW = typeof s?.showWBW === 'boolean' ? s.showWBW : showWBW;
    const nextTapWordsMode = typeof s?.tapWordsMode === 'boolean' ? s.tapWordsMode : tapWordsMode;
    const nextShowTranslit = typeof s?.showTransliteration === 'boolean' ? s.showTransliteration : showTransliteration;
    const nextFontSize = typeof s?.arabicFontSize === 'number' ? s.arabicFontSize : arabicFontSize;
    const nextDarkMode = typeof s?.darkMode === 'boolean' ? s.darkMode : darkMode;
    const nextReciter = s?.reciterId ? (RECITERS.find((r) => r.id === s.reciterId) || currentReciter) : currentReciter;
    const nextAutoScroll = typeof s?.autoScroll === 'boolean' ? s.autoScroll : autoScroll;
    const nextPreferredTafsir = s?.preferredTafsir && VALID_TAFSIRS.includes(s.preferredTafsir)
      ? s.preferredTafsir
      : preferredTafsir;

    lastSyncedSnapshotRef.current = getSyncSnapshot({
      lastRead: nextLastRead,
      bookmarks: nextBookmarks,
      settings: {
        script: nextScript,
        translation: nextTranslation,
        showWBW: nextShowWBW,
        tapWordsMode: nextTapWordsMode,
        showTransliteration: nextShowTranslit,
        arabicFontSize: nextFontSize,
        darkMode: nextDarkMode,
        reciterId: nextReciter.id,
        autoScroll: nextAutoScroll,
        preferredTafsir: nextPreferredTafsir,
      },
    });

    const cloudUpdatedAt = data.updatedAt ? new Date(data.updatedAt).getTime() : Date.now();
    localStorage.setItem('quran_local_modified_at', String(cloudUpdatedAt));

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
    if (s) {
      if (s.script) setScript(nextScript);
      if (s.translation) setTranslation(nextTranslation);
      if (typeof s.showWBW === 'boolean') setShowWBW(nextShowWBW);
      if (typeof s.tapWordsMode === 'boolean') setTapWordsMode(nextTapWordsMode);
      if (typeof s.showTransliteration === 'boolean') setShowTransliteration(nextShowTranslit);
      if (typeof s.arabicFontSize === 'number') setArabicFontSize(nextFontSize);
      if (typeof s.darkMode === 'boolean') setDarkMode(nextDarkMode);
      if (s.reciterId) setCurrentReciter(nextReciter);
      if (typeof s.autoScroll === 'boolean') setAutoScroll(nextAutoScroll);
      if (s.preferredTafsir && VALID_TAFSIRS.includes(s.preferredTafsir)) {
        handlePreferredTafsirChange(nextPreferredTafsir);
      }
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
          if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
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
        await pushSyncToCloud(email, localData);
        setSyncEmail(email);
        localStorage.setItem('quran_sync_email', email);
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
      await pushSyncToCloud(syncConflict.cloud.email, localData);
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
      await pushSyncToCloud(syncEmail, localData);
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectSync = () => {
    if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    lastSyncedSnapshotRef.current = null;
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
    localStorage.setItem('quran_tap_words_mode', String(tapWordsMode));
  }, [tapWordsMode]);

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
    let cancelled = false;
    setIsFetchingCloudOnLoad(true);
    const fetchOnLoad = async () => {
      try {
        const res = await fetch(`/api/sync?email=${encodeURIComponent(syncEmail)}`);
        if (!res.ok || cancelled) return;
        const json = await res.json();
        if (cancelled) return;
        if (json.exists && json.data) {
          const cloudData: CloudSyncData = json.data;
          const localData = buildLocalSyncData();

          const cloudTime = cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : 0;
          const localReadTime = localData.lastRead?.timestamp || 0;
          const localModifiedAt = Number(localStorage.getItem('quran_local_modified_at') || '0');
          const effectiveLocalTime = Math.max(localReadTime, localModifiedAt);

          const lastReadDiffers = Boolean(
            cloudData.lastRead &&
            (!localData.lastRead ||
              cloudData.lastRead.surah !== localData.lastRead.surah ||
              cloudData.lastRead.aya !== localData.lastRead.aya)
          );

          if (lastReadDiffers) {
            // Guard: If this local device was also actively modified, open Conflict Guard Modal
            if (localReadTime > 0 && Math.abs(cloudTime - localReadTime) > 60000) {
              if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
              setSyncConflict({ cloud: cloudData, local: localData });
            } else {
              // Otherwise seamlessly resume from cloud
              applyCloudData(cloudData);
            }
          } else if (cloudTime > effectiveLocalTime) {
            // Pull newer settings/bookmarks even when lastRead is unchanged
            applyCloudData(cloudData);
          }
        }
      } catch {
        // silent fail on network error / offline
      } finally {
        if (!cancelled) {
          setIsFetchingCloudOnLoad(false);
        }
      }
    };
    fetchOnLoad();
    return () => {
      cancelled = true;
    };
  }, [syncEmail]);

  // Debounced auto-sync to Neon when reading progress or settings change
  useEffect(() => {
    const localData = buildLocalSyncData();
    const currentSnapshot = getSyncSnapshot(localData);

    // Record initial local baseline so mounting does not trigger a redundant POST
    if (lastSyncedSnapshotRef.current === null) {
      lastSyncedSnapshotRef.current = currentSnapshot;
      return;
    }

    if (currentSnapshot !== lastSyncedSnapshotRef.current) {
      localStorage.setItem('quran_local_modified_at', String(Date.now()));
    }

    if (!syncEmail || syncConflict || isFetchingCloudOnLoad) return;
    if (currentSnapshot === lastSyncedSnapshotRef.current) return;

    if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);

    autoSyncTimerRef.current = setTimeout(async () => {
      try {
        await pushSyncToCloud(syncEmail, localData);
      } catch {
        // offline
      }
    }, 2500);

    return () => {
      if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    };
  }, [
    syncEmail,
    syncConflict,
    isFetchingCloudOnLoad,
    lastRead,
    bookmarks,
    script,
    translation,
    showWBW,
    tapWordsMode,
    showTransliteration,
    arabicFontSize,
    darkMode,
    currentReciter,
    autoScroll,
    preferredTafsir,
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

  // Word-by-Word Pronunciation & Long-Hold Letter Breakdown Handlers
  const handlePlaySingleWord = (ayaNum: number, wordObj: WBWWord) => {
    const key = `${currentSurahNumber}:${ayaNum}:${wordObj.word}`;
    if (playingWordKey === key) {
      stopPronunciationAudio();
      setPlayingWordKey(null);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
    }
    const url = getWbwWordAudioUrl(currentSurahNumber, ayaNum, wordObj.word);
    playPronunciationClip(url, {
      onStart: () => setPlayingWordKey(key),
      onEnd: () => setPlayingWordKey(null),
      onError: () => setPlayingWordKey(null),
    });
  };

  const handlePlayAllWordsInVerse = (ayaNum: number, words: WBWWord[]) => {
    if (!words.length) return;
    if (isPlaying) {
      setIsPlaying(false);
    }
    const urls = words.map((w) => getWbwWordAudioUrl(currentSurahNumber, ayaNum, w.word));
    playAudioSequence(
      urls,
      (idx) => {
        const w = words[idx];
        if (w) setPlayingWordKey(`${currentSurahNumber}:${ayaNum}:${w.word}`);
      },
      () => setPlayingWordKey(null),
      () => setPlayingWordKey(null)
    );
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleWordPointerDown = (ayaNum: number, wordObj: WBWWord) => {
    didLongPressRef.current = false;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      stopPronunciationAudio();
      setPlayingWordKey(null);
      setBreakdownTarget({ surah: currentSurahNumber, aya: ayaNum, word: wordObj });
    }, 450);
  };

  const handleWordClick = (ayaNum: number, wordObj: WBWWord) => {
    clearLongPressTimer();
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    handlePlaySingleWord(ayaNum, wordObj);
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
    const arabicText = getScriptArabicText(verse, script);
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
        onOpenWaqfSigns={() => setIsWaqfSignsModalOpen(true)}
        onOpenLettersGuide={() => {
          setGuideInitialLetterId(undefined);
          setIsLettersGuideOpen(true);
        }}
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
            {/* Surah Header Card */}
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
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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

                {/* Novice Pronunciation & Learning Quick Controls */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setShowWBW(!showWBW)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition flex items-center gap-1.5 ${
                      showWBW
                        ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                        : 'bg-gray-50 dark:bg-brand-surfaceDark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-brand-borderDark hover:border-brand-teal/50'
                    }`}
                    title="Show Word-by-Word cards with tap-to-pronounce"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Word-by-Word {showWBW ? 'On' : 'Off'}</span>
                  </button>

                  {!showWBW && (
                    <button
                      onClick={() => setTapWordsMode(!tapWordsMode)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition flex items-center gap-1.5 ${
                        tapWordsMode
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 dark:bg-brand-surfaceDark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-brand-borderDark hover:border-brand-teal/50'
                      }`}
                      title="Make each word in Classic view tappable to hear & long-hold for letters"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tap Words {tapWordsMode ? 'On' : 'Off'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setGuideInitialLetterId(undefined);
                      setIsLettersGuideOpen(true);
                    }}
                    className="px-3 py-1 rounded-full text-[11px] font-bold border border-brand-teal/30 bg-brand-teal/10 hover:bg-brand-teal/15 text-brand-teal dark:text-emerald-400 transition flex items-center gap-1.5"
                    title="Open Arabic Letters & Harakat Guide"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Letters Guide</span>
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
              <div className="text-center my-6 sm:my-8 py-4 sm:py-6 px-4 select-text">
                <div
                  className={`${getScriptFontClass(script)} quran-bismillah text-gray-800 dark:text-gray-200 select-text`}
                  style={{
                    fontSize: `${arabicFontSize + 6}px`,
                    lineHeight: 2.3,
                  }}
                  dir="rtl"
                >
                  {getScriptBismillah(script)}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic mt-3 sm:mt-4 font-sans select-text tracking-wide">
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
                const arabicText = getScriptArabicText(verse, script);

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
                        <div className="min-w-8 h-8 px-2 rounded-lg bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-brand-teal/20 shrink-0 whitespace-nowrap shadow-xs">
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
                          className="p-1.5 text-gray-500 hover:text-brand-teal dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition flex items-center gap-1 text-xs cursor-pointer"
                          title="View Tafsir commentary"
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

                        {/* Share as Image */}
                        <button
                          onClick={() => setSharingVerse(verse)}
                          className="p-1.5 text-gray-400 hover:text-brand-teal dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-brand-cardDark rounded-lg transition"
                          title="Share Verse as Image"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Word-by-Word View */}
                    {showWBW && verse.wbw && verse.wbw.length > 0 ? (
                      <div className="mb-6 pb-2">
                        {/* Novice Learning Hint + Play All Words Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-brand-teal" />
                            <span>Tap a word to hear • Hold (or tap Letters) to spell</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePlayAllWordsInVerse(verse.aya, verse.wbw)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold transition"
                            title="Play every word one by one"
                          >
                            <Play className="w-3 h-3" />
                            <span>Play Words</span>
                          </button>
                        </div>

                        <div
                          className="flex flex-wrap flex-row-reverse gap-2.5 sm:gap-3 py-2 items-start justify-start"
                          dir="rtl"
                        >
                          {verse.wbw.map((w, idx) => {
                            const wKey = `${currentSurahNumber}:${verse.aya}:${w.word}`;
                            const isWordPlaying = playingWordKey === wKey;
                            const wordDisplayText = getWbwScriptText(w, script);

                            return (
                              <div
                                key={idx}
                                role="button"
                                tabIndex={0}
                                onPointerDown={() => handleWordPointerDown(verse.aya, w)}
                                onPointerUp={() => clearLongPressTimer()}
                                onPointerLeave={() => clearLongPressTimer()}
                                onPointerCancel={() => clearLongPressTimer()}
                                onClick={() => handleWordClick(verse.aya, w)}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  setBreakdownTarget({ surah: currentSurahNumber, aya: verse.aya, word: w });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handlePlaySingleWord(verse.aya, w);
                                  }
                                }}
                                className={`group relative cursor-pointer select-none flex flex-col items-center justify-between min-w-[64px] px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                                  isWordPlaying
                                    ? 'bg-brand-teal/15 dark:bg-brand-teal/25 border-brand-teal ring-2 ring-brand-teal/40 shadow-sm scale-[1.03]'
                                    : 'bg-gray-50/80 dark:bg-brand-surfaceDark/80 hover:bg-brand-teal/10 dark:hover:bg-brand-teal/20 border-gray-100 dark:border-brand-borderDark hover:border-brand-teal/40'
                                }`}
                                title="Tap to pronounce • Long-hold for letter breakdown"
                              >
                                {/* Top tiny actions: Sound indicator + Letters button */}
                                <div className="w-full flex items-center justify-between gap-2 mb-0.5" dir="ltr">
                                  <Volume2
                                    className={`w-3 h-3 transition ${
                                      isWordPlaying
                                        ? 'text-brand-teal animate-pulse'
                                        : 'text-gray-300 dark:text-gray-600 group-hover:text-brand-teal'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      stopPronunciationAudio();
                                      setPlayingWordKey(null);
                                      setBreakdownTarget({ surah: currentSurahNumber, aya: verse.aya, word: w });
                                    }}
                                    className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-gray-400 hover:text-brand-teal hover:bg-brand-teal/10 dark:hover:text-emerald-400 transition flex items-center gap-0.5"
                                    title="Letter-by-letter breakdown"
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>Letters</span>
                                  </button>
                                </div>

                                {/* Word Arabic Text */}
                                <span
                                  className={`${getScriptFontClass(script)} wbw-arabic text-gray-900 dark:text-gray-100`}
                                  style={{ fontSize: `${arabicFontSize}px` }}
                                >
                                  {renderArabicWithWaqfHints(wordDisplayText)}
                                </span>

                                {/* Word Transliteration & Translation */}
                                <div className="mt-2 text-center" dir="ltr">
                                  {w.translit && (
                                    <div className="text-[10px] font-semibold text-brand-teal/80 dark:text-emerald-400/80 leading-tight mb-0.5">
                                      {w.translit}
                                    </div>
                                  )}
                                  <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 group-hover:text-brand-teal font-sans font-normal leading-tight block">
                                    {w.translation}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : tapWordsMode && verse.wbw && verse.wbw.length > 0 ? (
                      /* Interactive Classic Flowing Verse (Tap Words On) */
                      <div className="mb-6 pb-2 text-right">
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-1.5 flex items-center justify-end gap-1.5">
                          <span>Tap any word to hear • Hold for letter breakdown</span>
                          <Sparkles className="w-3 h-3 text-brand-teal" />
                        </div>
                        <p
                          className={`${getScriptFontClass(script)} text-gray-900 dark:text-gray-100 leading-loose`}
                          style={{ fontSize: `${arabicFontSize}px` }}
                          dir="rtl"
                        >
                          {verse.wbw.map((w, idx) => {
                            const wKey = `${currentSurahNumber}:${verse.aya}:${w.word}`;
                            const isWordPlaying = playingWordKey === wKey;
                            const wordDisplayText = getWbwScriptText(w, script);

                            return (
                              <span key={idx}>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onPointerDown={() => handleWordPointerDown(verse.aya, w)}
                                  onPointerUp={() => clearLongPressTimer()}
                                  onPointerLeave={() => clearLongPressTimer()}
                                  onPointerCancel={() => clearLongPressTimer()}
                                  onClick={() => handleWordClick(verse.aya, w)}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setBreakdownTarget({ surah: currentSurahNumber, aya: verse.aya, word: w });
                                  }}
                                  className={`inline-block cursor-pointer select-none rounded-lg px-1 transition-colors ${
                                    isWordPlaying
                                      ? 'bg-brand-teal/20 text-brand-teal dark:text-emerald-300 ring-1 ring-brand-teal/40'
                                      : 'hover:bg-brand-teal/10 hover:underline decoration-brand-teal/40 decoration-dotted underline-offset-8'
                                  }`}
                                  title={`${w.translit ? `${w.translit} — ` : ''}${w.translation} (Tap to hear, hold for letters)`}
                                >
                                  {renderArabicWithWaqfHints(wordDisplayText)}
                                </span>{' '}
                              </span>
                            );
                          })}
                          <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 mx-2 text-xs text-brand-teal border border-brand-teal/40 rounded-full font-sans select-none align-middle font-bold shrink-0">
                            {verse.aya}
                          </span>
                        </p>
                      </div>
                    ) : (
                      /* Classic Flowing Calligraphy Verse */
                      <div className="mb-6 pb-2 text-right select-text">
                        <p
                          className={`${getScriptFontClass(script)} text-gray-900 dark:text-gray-100`}
                          style={{ fontSize: `${arabicFontSize}px` }}
                        >
                          {renderArabicWithWaqfHints(arabicText)}
                          <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 mx-2 text-xs text-brand-teal border border-brand-teal/40 rounded-full font-sans select-none align-middle font-bold shrink-0">
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
        tapWordsMode={tapWordsMode}
        onToggleTapWordsMode={() => setTapWordsMode(!tapWordsMode)}
        showTransliteration={showTransliteration}
        onToggleTransliteration={() => setShowTransliteration(!showTransliteration)}
        arabicFontSize={arabicFontSize}
        onChangeArabicFontSize={setArabicFontSize}
        currentReciter={currentReciter}
        onChangeReciter={setCurrentReciter}
        syncEmail={syncEmail}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenLettersGuide={() => {
          setGuideInitialLetterId(undefined);
          setIsLettersGuideOpen(true);
        }}
        preferredTafsir={preferredTafsir}
        onChangePreferredTafsir={handlePreferredTafsirChange}
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
        activeTranslation={translation}
        preferredTafsir={preferredTafsir}
        onChangePreferredTafsir={handlePreferredTafsirChange}
      />

      <ShareVerseModal
        isOpen={!!sharingVerse}
        onClose={() => setSharingVerse(null)}
        surahNumber={currentSurahNumber}
        surahName={surahData?.name || ''}
        verse={sharingVerse}
        script={script}
        translation={translation}
      />

      <WaqfSignsModal
        isOpen={isWaqfSignsModalOpen}
        onClose={() => setIsWaqfSignsModalOpen(false)}
        onNavigateToAyah={handleNavigateToAyah}
      />

      {breakdownTarget && (
        <WordBreakdownModal
          key={`${breakdownTarget.surah}:${breakdownTarget.aya}:${breakdownTarget.word.word}`}
          isOpen
          onClose={() => setBreakdownTarget(null)}
          surahNumber={breakdownTarget.surah}
          ayaNumber={breakdownTarget.aya}
          word={breakdownTarget.word}
          script={script}
          onOpenLettersGuide={(letterId) => {
            setGuideInitialLetterId(letterId);
            setIsLettersGuideOpen(true);
          }}
        />
      )}

      {isLettersGuideOpen && (
        <ArabicLettersGuideModal
          key={guideInitialLetterId || 'default'}
          isOpen
          onClose={() => setIsLettersGuideOpen(false)}
          activeScript={script}
          initialLetterId={guideInitialLetterId}
        />
      )}
    </div>
  );
}
