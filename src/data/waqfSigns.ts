export type WaqfUrgency =
  | 'compulsory'
  | 'prohibited'
  | 'preferred_stop'
  | 'preferred_continue'
  | 'permissible'
  | 'silence'
  | 'special'
  | 'marker';

export type WaqfCategory = 'uthmani' | 'indopak' | 'both' | 'general';

export interface WaqfExample {
  surah: number;
  surahName: string;
  aya: number;
  snippetArabic: string;
  snippetTranslation: string;
  explanation: string;
}

export interface WaqfSign {
  id: string;
  symbol: string;             // Unicode glyph as found in text
  displaySymbol: string;      // Calligraphic / readable text representation
  unicode: string;            // Unicode code point
  nameArabic: string;         // Arabic name
  nameTranslit: string;       // English transliteration
  category: WaqfCategory;     // Tradition
  urgency: WaqfUrgency;       // Recitation status
  actionBadge: string;        // Quick 2-3 word English directive
  ruleDescription: string;    // Clear explanation of what the reciter must do
  whyItMatters: string;       // Theological / linguistic reason
  badgeClasses: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  example?: WaqfExample;
}

export const WAQF_SIGNS: WaqfSign[] = [
  {
    id: 'lazim',
    symbol: '\u06D8', // ۘ
    displaySymbol: 'مـ',
    unicode: 'U+06D8',
    nameArabic: 'وقف لازم',
    nameTranslit: 'Waqf Lāzim',
    category: 'both',
    urgency: 'compulsory',
    actionBadge: 'Must Stop',
    ruleDescription: 'Stopping here is mandatory. Take a breath and resume from the next word.',
    whyItMatters: 'Continuing past this point connects two separate grammatical statements and distorts or ruins the intended meaning of the verse.',
    badgeClasses: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-rose-500/20',
    },
    example: {
      surah: 6,
      surahName: "Al-An'am",
      aya: 36,
      snippetArabic: '۞ إِنَّمَا يَسۡتَجِيبُ ٱلَّذِينَ يَسۡمَعُونَۘ وَٱلۡمَوۡتَىٰ يَبۡعَثُهُمُ ٱللَّهُ',
      snippetTranslation: 'Only those who listen will respond. [Stop!] As for the dead, Allah will raise them up...',
      explanation: 'Stopping after "those who listen" is required. If you continue without stopping, it would sound like the dead also hear and respond in this worldly life.',
    },
  },
  {
    id: 'laa',
    symbol: '\u06D9', // ۙ (Renders as small superscript 'لا' in Indo-Pak and Madinah scripts)
    displaySymbol: 'لا',
    unicode: 'U+06D9',
    nameArabic: 'لا وقف (وقف ممنوع)',
    nameTranslit: 'Lā Waqf / Waqf Mamnū‘',
    category: 'both',
    urgency: 'prohibited',
    actionBadge: 'Do Not Stop',
    ruleDescription: 'Do not pause here. Continue reading without taking a breath.',
    whyItMatters: 'The meaning or sentence structure is not complete yet. Stopping here causes an unfinished thought or breaks a conjoined list. (If you run out of breath, stop, then back up a few words before resuming).',
    badgeClasses: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
    },
    example: {
      surah: 5,
      surahName: 'Al-Ma’idah',
      aya: 45,
      snippetArabic: 'وَكَتَبۡنَا عَلَيۡهِمۡ فِيهَآ أَنَّ ٱلنَّفۡسَ بِٱلنَّفۡسِ ۙ وَٱلۡعَيۡنَ بِٱلۡعَيۡنِ ... وَٱلسِّنَّ بِٱلسِّنِّ ۙ وَٱلۡجُرُوحَ قِصَاصٞ ۗ',
      snippetTranslation: 'We ordained for them: a life for a life [Do not stop!], an eye for an eye... and a tooth for a tooth [Do not stop!], and for wounds is legal retribution [Better to stop]...',
      explanation: 'Do not stop after "a life for a life" or "a tooth for a tooth". These clauses are directly chained (ma‘ṭūf) in a single legal decree; stopping mid-sentence would break the contiguous legal ruling.',
    },
  },
  {
    id: 'jaiz',
    symbol: '\u06DA', // ۚ
    displaySymbol: 'ج',
    unicode: 'U+06DA',
    nameArabic: 'وقف جائز',
    nameTranslit: 'Waqf Jā’iz',
    category: 'both',
    urgency: 'permissible',
    actionBadge: 'Permissible',
    ruleDescription: 'Stopping and continuing are equally allowed without any preference.',
    whyItMatters: 'The sentence structure makes complete sense whether you choose to pause for breath or continue seamlessly.',
    badgeClasses: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
    },
    example: {
      surah: 18,
      surahName: 'Al-Kahf',
      aya: 13,
      snippetArabic: 'نَّحۡنُ نَقُصُّ عَلَيۡكَ نَبَأَهُم بِٱلۡحَقِّۚ إِنَّهُمۡ فِتۡيَةٌ ءَامَنُواْ بِرَبِّهِمۡ',
      snippetTranslation: 'We relate to you their story in truth. [Permissible pause] Indeed, they were youths who believed in their Lord...',
      explanation: 'You may stop at "in truth" and take a breath, or continue straight through without breaking.',
    },
  },
  {
    id: 'waqf_awla',
    symbol: '\u06D7', // ۗ (Renders as 'قلى' in Uthmani or superscript 'ق' in Indo-Pak scripts)
    displaySymbol: 'قلى',
    unicode: 'U+06D7',
    nameArabic: 'الوقف أولى (قلى / ق)',
    nameTranslit: 'Al-Waqf Awlā / Waqf Qaf (ق)',
    category: 'both',
    urgency: 'preferred_stop',
    actionBadge: 'Better to Stop',
    ruleDescription: 'Stopping here is preferred, although continuing is still grammatically permissible.',
    whyItMatters: 'Pausing gives optimal clarity to the completed statement before introducing the subsequent phrase. In Indo-Pak Mushafs, this appears as a miniature superscript "ق" (Qīla ‘alayhil-waqf).',
    badgeClasses: {
      bg: 'bg-teal-500/10 dark:bg-teal-500/20',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-500/30',
      glow: 'shadow-teal-500/20',
    },
    example: {
      surah: 5,
      surahName: 'Al-Ma’idah',
      aya: 45,
      snippetArabic: '... وَالسِّنَّ بِالسِّنِّ ۙ وَالْجُرُوحَ قِصَاصٌ ۗ فَمَن تَصَدَّقَ بِهِۦ فَهُوَ كَفَّارَةٌ لَّهُۥ ۗ',
      snippetTranslation: '...a tooth for a tooth, and for wounds is legal retribution [Better to stop]. But whoever waives it as charity, it is an expiation for him [Better to stop]...',
      explanation: 'Pausing at "legal retribution" (قِصَاصٌ ۗ) separates the divine rule of retaliation from the subsequent virtue of charitable forgiveness.',
    },
  },
  {
    id: 'wasl_awla',
    symbol: '\u06D6', // ۖ
    displaySymbol: 'صلى',
    unicode: 'U+06D6',
    nameArabic: 'الوصل أولى (صلى)',
    nameTranslit: 'Al-Waṣl Awlā (Silā)',
    category: 'both',
    urgency: 'preferred_continue',
    actionBadge: 'Better to Continue',
    ruleDescription: 'Continuing is preferred, although stopping is permissible if you need breath.',
    whyItMatters: 'Keeping the recitation connected better reflects the close relationship between the two clauses.',
    badgeClasses: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20',
    },
    example: {
      surah: 2,
      surahName: 'Al-Baqarah',
      aya: 5,
      snippetArabic: 'أُوْلَٰٓئِكَ عَلَىٰ هُدٗى مِّن رَّبِّهِمۡۖ وَأُوْلَٰٓئِكَ هُمُ ٱلۡمُفۡلِحُونَ',
      snippetTranslation: 'Those are on guidance from their Lord, [Better to continue] and those are the successful ones.',
      explanation: 'Continuing without a pause links the guidance and the resulting success as a single coherent description.',
    },
  },
  {
    id: 'muanaqah',
    symbol: '\u06DB', // ۛ
    displaySymbol: '∴',
    unicode: 'U+06DB',
    nameArabic: 'وقف المعانقة / المراقبة (∴)',
    nameTranslit: 'Waqf al-Mu‘ānaqah / Murāqabah',
    category: 'both',
    urgency: 'special',
    actionBadge: 'Stop at One, Not Both',
    ruleDescription: 'Appears in pairs of three dots (∴). You may pause at the first OR the second, but NEVER at both.',
    whyItMatters: 'The middle word grammatically links to either the preceding clause or the succeeding clause. Pausing at both leaves the middle phrase stranded without syntax.',
    badgeClasses: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20',
    },
    example: {
      surah: 2,
      surahName: 'Al-Baqarah',
      aya: 2,
      snippetArabic: 'ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَ ۛ فِيهِ ۛ هُدٗى لِّلۡمُتَّقِينَ',
      snippetTranslation: 'This is the Book, there is no doubt (stop 1) / in it (stop 2) guidance for the mindful.',
      explanation: 'Option A: Pause at "no doubt" ("This is the Book, no doubt! In it is guidance..."). Option B: Pause at "in it" ("This is the Book in which there is no doubt. A guidance..."). Never stop at both!',
    },
  },
  {
    id: 'saktah',
    symbol: '\u06DC', // ۜ
    displaySymbol: 'س',
    unicode: 'U+06DC',
    nameArabic: 'سكتة لطيفة (س)',
    nameTranslit: 'Saktah Laṭīfah',
    category: 'both',
    urgency: 'silence',
    actionBadge: 'Pause Without Breath',
    ruleDescription: 'Hold your voice in silence for approximately 2 counts (1-2 seconds) without taking a breath, then resume.',
    whyItMatters: 'Prevents confusing two adjacent words whose meanings would inadvertently blend if read continuously.',
    badgeClasses: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-indigo-500/20',
    },
    example: {
      surah: 75,
      surahName: 'Al-Qiyamah',
      aya: 27,
      snippetArabic: 'وَقِيلَ مَنۡۜ رَاقٖ',
      snippetTranslation: 'And it is said: "Who [silent pause] will cure him?"',
      explanation: 'A momentary breathless silence separates "Man" (Who) and "Rāq" (healer). Continuing without saktah would cause idghām (pronouncing "Marrāq"), which changes the word to mean "broth seller"!',
    },
  },
  {
    id: 'mutlaq',
    symbol: '\u0615', // ؕ (or ط)
    displaySymbol: 'ط',
    unicode: 'U+0615',
    nameArabic: 'وقف مطلق',
    nameTranslit: 'Waqf Muṭlaq (Sajawandi)',
    category: 'indopak',
    urgency: 'preferred_stop',
    actionBadge: 'Absolute Stop',
    ruleDescription: 'An absolute pause. The sentence is syntactically complete. Stopping to take breath is strongly recommended.',
    whyItMatters: 'Marks the end of an independent proposition or clause in the classical Indo-Pak Tajweed standard.',
    badgeClasses: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20',
    },
    example: {
      surah: 1,
      surahName: 'Al-Fatiha',
      aya: 2,
      snippetArabic: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ؕ',
      snippetTranslation: '[All] praise is [due] to Allah, Lord of the worlds.',
      explanation: 'Found at the end of complete sentences throughout South Asian prints of the Quran.',
    },
  },
  {
    id: 'mujawwaz',
    symbol: 'ز',
    displaySymbol: 'ز',
    unicode: 'U+0632',
    nameArabic: 'وقف مجوز',
    nameTranslit: 'Waqf Mujawwaz (Sajawandi)',
    category: 'indopak',
    urgency: 'preferred_continue',
    actionBadge: 'Better to Continue',
    ruleDescription: 'Permissible to pause, but continuing is better in the classical Indo-Pak system.',
    whyItMatters: 'Preserves the fluid connection of the sentence.',
    badgeClasses: {
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-500/30',
      glow: 'shadow-sky-500/20',
    },
  },
  {
    id: 'murakhkhas',
    symbol: 'ص',
    displaySymbol: 'ص',
    unicode: 'U+0635',
    nameArabic: 'وقف مرخص',
    nameTranslit: 'Waqf Murakhkhaṣ (Sajawandi)',
    category: 'indopak',
    urgency: 'preferred_continue',
    actionBadge: 'Concessionary Stop',
    ruleDescription: 'You should continue, but pausing is excused (licensed) if your breath is falling short.',
    whyItMatters: 'Offers a safe grammatical exit point in particularly long verses.',
    badgeClasses: {
      bg: 'bg-slate-500/10 dark:bg-slate-500/20',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-500/30',
      glow: 'shadow-slate-500/20',
    },
  },
  {
    id: 'qif',
    symbol: 'قف',
    displaySymbol: 'قف',
    unicode: 'U+0642 U+0641',
    nameArabic: 'علامة قف',
    nameTranslit: 'Waqf Qif',
    category: 'indopak',
    urgency: 'preferred_stop',
    actionBadge: 'Cautionary Stop',
    ruleDescription: 'The imperative word "Stop!". Placed where reciters are prone to rush forward mistakenly.',
    whyItMatters: 'Serves as an intentional reminder to pause before a new clause begins.',
    badgeClasses: {
      bg: 'bg-amber-600/10 dark:bg-amber-600/20',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-600/30',
      glow: 'shadow-amber-600/20',
    },
  },
  {
    id: 'kadhalik',
    symbol: 'ک',
    displaySymbol: 'ک',
    unicode: 'U+06A9',
    nameArabic: 'كذلك (ک)',
    nameTranslit: 'Kadhālik',
    category: 'indopak',
    urgency: 'special',
    actionBadge: 'Same as Preceding',
    ruleDescription: 'Adopts the identical ruling of the stop mark immediately preceding it in the passage.',
    whyItMatters: 'An abbreviation commonly used by classical Tajweed annotators.',
    badgeClasses: {
      bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
      text: 'text-zinc-600 dark:text-zinc-400',
      border: 'border-zinc-500/30',
      glow: 'shadow-zinc-500/20',
    },
  },
  {
    id: 'waqfah',
    symbol: 'وقفه',
    displaySymbol: 'وقفه',
    unicode: 'Waqfah',
    nameArabic: 'وقفة',
    nameTranslit: 'Waqfah',
    category: 'indopak',
    urgency: 'silence',
    actionBadge: 'Extended Silent Pause',
    ruleDescription: 'A silence slightly longer than Saktah, held without taking a fresh breath.',
    whyItMatters: 'Emphasizes separation between significant thematic shifts.',
    badgeClasses: {
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-500/30',
      glow: 'shadow-violet-500/20',
    },
  },
  {
    id: 'sajdah',
    symbol: '\u06E9', // ۩
    displaySymbol: '۩',
    unicode: 'U+06E9',
    nameArabic: 'سجدة تلاوة',
    nameTranslit: 'Sajdat at-Tilāwah',
    category: 'general',
    urgency: 'marker',
    actionBadge: 'Prostration Required',
    ruleDescription: 'Upon reciting or hearing this verse, performing a single prostration (Sajdah) is Sunnah Mu’akkadah / Wajib.',
    whyItMatters: 'Appears at 14 or 15 places across the Qur’an honoring Allah’s majesty and servitude.',
    badgeClasses: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/25',
      text: 'text-emerald-700 dark:text-emerald-300 font-bold',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
    },
    example: {
      surah: 32,
      surahName: 'As-Sajdah',
      aya: 15,
      snippetArabic: 'إِنَّمَا يُؤۡمِنُ بِـَٔايَٰتِنَا ٱلَّذِينَ إِذَا ذُكِّرُواْ بِهَا خَرُّواْ سُجَّدٗا ۩',
      snippetTranslation: 'Only those believe in Our verses who, when they are reminded of them, fall down in prostration...',
      explanation: 'Upon reaching the ۩ symbol, the reciter says "Allahu Akbar" and performs prostration.',
    },
  },
  {
    id: 'rub_el_hizb',
    symbol: '\u06DE', // ۞
    displaySymbol: '۞',
    unicode: 'U+06DE',
    nameArabic: 'ربع الحزب',
    nameTranslit: 'Rub‘ al-Ḥizb',
    category: 'general',
    urgency: 'marker',
    actionBadge: 'Quarter Division',
    ruleDescription: 'Marks the start of a quarter (Rub‘) of a Hizb (there are 2 Hizbs per Juz / Para, so 8 quarters per Juz).',
    whyItMatters: 'Used for systematic Quran memorization, daily reading cycles, and liturgical revision.',
    badgeClasses: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/25',
      text: 'text-amber-700 dark:text-amber-300 font-bold',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
    },
    example: {
      surah: 2,
      surahName: 'Al-Baqarah',
      aya: 26,
      snippetArabic: '۞ إِنَّ ٱللَّهَ لَا يَسۡتَحۡيِۦٓ أَن يَضۡرِبَ مَثَلٗا مَّا بَعُوضَةٗ فَمَا فَوۡقَهَا',
      snippetTranslation: 'Indeed, Allah is not timid to present an example of a mosquito or what is smaller...',
      explanation: 'Marks the beginning of the 2nd Rub‘ (quarter) of the 1st Hizb in Juz 1.',
    },
  },
  {
    id: 'ayah_marker',
    symbol: '\u06DD', // ۝
    displaySymbol: '۝',
    unicode: 'U+06DD',
    nameArabic: 'رأس الآية (نهاية الآية)',
    nameTranslit: 'Ra’s al-Āyah (Verse End)',
    category: 'general',
    urgency: 'marker',
    actionBadge: 'Sunnah to Stop',
    ruleDescription: 'Stopping at the end of every Ayah is the established Sunnah of Prophet Muhammad ﷺ (Sunnat al-Waqf).',
    whyItMatters: 'The Prophet ﷺ would pause at the completion of each verse even if grammatically attached to the next.',
    badgeClasses: {
      bg: 'bg-brand-teal/15 dark:bg-brand-teal/25',
      text: 'text-brand-teal dark:text-emerald-400 font-bold',
      border: 'border-brand-teal/40',
      glow: 'shadow-brand-teal/20',
    },
    example: {
      surah: 1,
      surahName: 'Al-Fatiha',
      aya: 1,
      snippetArabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ۝',
      snippetTranslation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
      explanation: 'Stopping upon completing an Ayah is Sunnah, providing a contemplative pause before starting the next verse.',
    },
  },
];

// Fast lookup map for any Quranic character encountered in text
export const WAQF_MAP: Record<string, WaqfSign> = {};
for (const sign of WAQF_SIGNS) {
  if (sign.symbol) {
    WAQF_MAP[sign.symbol] = sign;
  }
}

// Aliases for user searches and cross-tradition characters
const laaSign = WAQF_SIGNS.find((s) => s.id === 'laa');
if (laaSign) {
  WAQF_MAP['لا'] = laaSign;
  WAQF_MAP['لَا'] = laaSign;
  WAQF_MAP['\u06D9'] = laaSign;
}

const waqfAwlaSign = WAQF_SIGNS.find((s) => s.id === 'waqf_awla');
if (waqfAwlaSign) {
  WAQF_MAP['ق'] = waqfAwlaSign;
  WAQF_MAP['قلى'] = waqfAwlaSign;
  WAQF_MAP['\u06D7'] = waqfAwlaSign;
}

const lazimSign = WAQF_SIGNS.find((s) => s.id === 'lazim');
if (lazimSign) {
  WAQF_MAP['م'] = lazimSign;
  WAQF_MAP['مـ'] = lazimSign;
  WAQF_MAP['\u06D8'] = lazimSign;
}

const jaizSign = WAQF_SIGNS.find((s) => s.id === 'jaiz');
if (jaizSign) {
  WAQF_MAP['ج'] = jaizSign;
  WAQF_MAP['\u06DA'] = jaizSign;
}

const mutlaqSign = WAQF_SIGNS.find((s) => s.id === 'mutlaq');
if (mutlaqSign) {
  WAQF_MAP['ط'] = mutlaqSign;
  WAQF_MAP['\u0615'] = mutlaqSign;
}

// Regex matching any stop or navigational symbol in verse text
export const WAQF_REGEX = /([\u06D6-\u06DC\u0615\u06DE\u06E9])/g;

export function getWaqfSignByChar(char: string): WaqfSign | undefined {
  return WAQF_MAP[char] || WAQF_MAP[char.trim()];
}
