export interface SurahMeta {
  number: number;
  name: string;
  revelationType: 'Meccan' | 'Medinan';
  totalVerses: number;
  image: string;
}

export interface WBWWord {
  word: number;
  arabic: string;
  translation: string;
}

export interface Verse {
  aya: number;
  uthmani: string;
  indopak: string;
  transliteration: string;
  saheeh: string;
  khattab: string;
  jalalayn: string;
  romanUrdu?: string;
  wbw: WBWWord[];
}

export interface SurahDetail extends SurahMeta {
  bismillah: boolean;
  verses: Verse[];
}

export type ScriptType = 'uthmani' | 'indopak';
export type TranslationChoice = 'khattab' | 'saheeh' | 'jalalayn' | 'romanUrdu' | 'none';

export interface LastRead {
  surah: number;
  surahName: string;
  aya: number;
  timestamp: number;
}

export interface Reciter {
  id: string;
  name: string;
  subfolder: string;
}

export const RECITERS: Reciter[] = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', subfolder: 'Alafasy_128kbps' },
  { id: 'ghamadi', name: 'Saad Al-Ghamdi', subfolder: 'Ghamadi_40kbps' },
  { id: 'sudais', name: 'Abdur-Rahman As-Sudais', subfolder: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', subfolder: 'Husary_128kbps' }
];

export interface SyncedSettings {
  script: ScriptType;
  translation: TranslationChoice;
  showWBW: boolean;
  showTransliteration: boolean;
  arabicFontSize: number;
  darkMode: boolean;
  reciterId: string;
  autoScroll: boolean;
}

export interface CloudSyncData {
  email: string;
  lastRead: LastRead | null;
  bookmarks: { surah: number; aya: number }[];
  settings: SyncedSettings;
  updatedAt?: string;
}

export interface SyncConflict {
  cloud: CloudSyncData;
  local: CloudSyncData;
}
