// Arabic Text Normalization & Search Utilities
// Enables diacritic-agnostic search across both Uthmani and IndoPak scripts

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / harakat / sukun / dagger alif
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0615]/g, '')
    // Normalize Alefs
    .replace(/[أإآٱآ]/g, 'ا')
    // Normalize Ya and Alef Maqsura
    .replace(/[ىي]/g, 'ي')
    // Normalize Ta Marbuta
    .replace(/ة/g, 'ه')
    // Remove Tatweel / Kashida
    .replace(/\u0640/g, '')
    // Remove punctuation, pause marks and extra spaces
    .replace(/[.,/#!$%^&*;:{}=\-_`~()۞۩«»""'']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export interface QuranRoot {
  root: string;
  translit: string;
  meaning: string;
  occurrences: number;
  sampleVerse: { surah: number; aya: number; snippet: string };
}

export const POPULAR_QURAN_ROOTS: QuranRoot[] = [
  {
    root: 'ر ح م',
    translit: 'R-H-M',
    meaning: 'Mercy, Compassion, Womb',
    occurrences: 339,
    sampleVerse: { surah: 1, aya: 1, snippet: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
  },
  {
    root: 'ا م ن',
    translit: 'A-M-N',
    meaning: 'Faith, Trust, Security',
    occurrences: 879,
    sampleVerse: { surah: 2, aya: 3, snippet: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ' },
  },
  {
    root: 'ع ل م',
    translit: 'A-L-M',
    meaning: 'Knowledge, Understanding',
    occurrences: 854,
    sampleVerse: { surah: 2, aya: 32, snippet: 'إِنَّكَ أَنتَ ٱلْعَلِيمُ ٱلْحَكِيمُ' },
  },
  {
    root: 'ك ت ب',
    translit: 'K-T-B',
    meaning: 'Writing, Book, Ordinance',
    occurrences: 319,
    sampleVerse: { surah: 2, aya: 2, snippet: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ' },
  },
  {
    root: 'ه د ي',
    translit: 'H-D-Y',
    meaning: 'Guidance, Direction',
    occurrences: 316,
    sampleVerse: { surah: 1, aya: 6, snippet: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ' },
  },
  {
    root: 'خ ل ق',
    translit: 'KH-L-Q',
    meaning: 'Creation, Formation, Nature',
    occurrences: 261,
    sampleVerse: { surah: 96, aya: 1, snippet: 'ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ' },
  },
  {
    root: 'ع ب د',
    translit: 'A-B-D',
    meaning: 'Worship, Service, Servanthood',
    occurrences: 275,
    sampleVerse: { surah: 1, aya: 5, snippet: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
  },
  {
    root: 'غ ف ر',
    translit: 'GH-F-R',
    meaning: 'Forgiveness, Pardon, Covering',
    occurrences: 234,
    sampleVerse: { surah: 2, aya: 199, snippet: 'وَٱسْتَغْفِرُوا۟ ٱللَّهَ إِنَّ ٱللَّهَ غَفُورٌۭ رَّحِيمٌۭ' },
  },
  {
    root: 'ص ب ر',
    translit: 'S-B-R',
    meaning: 'Patience, Perseverance',
    occurrences: 103,
    sampleVerse: { surah: 2, aya: 153, snippet: 'ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ' },
  },
  {
    root: 'ش ك ر',
    translit: 'SH-K-R',
    meaning: 'Gratitude, Appreciation',
    occurrences: 75,
    sampleVerse: { surah: 14, aya: 7, snippet: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ' },
  },
  {
    root: 'ت و ب',
    translit: 'T-W-B',
    meaning: 'Repentance, Turning to Allah',
    occurrences: 87,
    sampleVerse: { surah: 2, aya: 222, snippet: 'إِنَّ ٱللَّهَ يُحِبُّ ٱلتَّوَّٰبِينَ' },
  },
  {
    root: 'ذ ك ر',
    translit: 'DH-K-R',
    meaning: 'Remembrance, Reminder',
    occurrences: 292,
    sampleVerse: { surah: 13, aya: 28, snippet: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ' },
  },
  {
    root: 'س ل م',
    translit: 'S-L-M',
    meaning: 'Peace, Safety, Submission',
    occurrences: 140,
    sampleVerse: { surah: 2, aya: 208, snippet: 'ٱدْخُلُوا۟ فِى ٱلسِّلْمِ كَآفَّةًۭ' },
  },
  {
    root: 'ن و ر',
    translit: 'N-W-R',
    meaning: 'Light, Illumination',
    occurrences: 49,
    sampleVerse: { surah: 24, aya: 35, snippet: 'ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ' },
  },
  {
    root: 'ح ق ق',
    translit: 'H-Q-Q',
    meaning: 'Truth, Reality, Justice',
    occurrences: 287,
    sampleVerse: { surah: 10, aya: 32, snippet: 'فَذَٰلِكُمُ ٱللَّهُ رَبُّكُمُ ٱلْحَقُّ' },
  },
];
