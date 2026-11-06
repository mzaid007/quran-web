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

export type ScriptType = 'uthmani' | 'indopak' | 'indopak-saleem';

export function getScriptFontClass(script: ScriptType): string {
  switch (script) {
    case 'uthmani':
      return 'quran-uthmani';
    case 'indopak':
      return 'quran-indopak';
    case 'indopak-saleem':
      return 'quran-indopak-saleem';
    default:
      return 'quran-indopak-saleem';
  }
}

export function formatQuranText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\s*۞\s*/g, ' ۞ ')
    .replace(/\s*۩\s*/g, ' ۩ ')
    .replace(/\s*\u200c?([\u06d6-\u06dc\u0615])\s*/g, ' $1 ')
    .replace(/ +/g, ' ')
    .trim();
}

export function getScriptArabicText(verse: Verse, script: ScriptType): string {
  const raw = script === 'uthmani' ? verse.uthmani : (verse.indopak || verse.uthmani);
  return formatQuranText(raw);
}

export function getScriptBismillah(script: ScriptType): string {
  return script === 'uthmani'
    ? 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ'
    : 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
}
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
