export type LetterCategory = 'throat' | 'heavy' | 'tongue' | 'lips' | 'vowel';

export interface ArabicLetterInfo {
  id: string;
  order: number;
  char: string;
  indopakChar?: string;
  nameArabic: string;
  nameEnglish: string;
  sound: string;
  phoneticBase: string;
  audioFile: string;
  category: LetterCategory;
  makhraj: string;
  connectsLeft: boolean;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  scriptNote?: string;
}

export interface HarakahSignInfo {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  otherNames?: string;
  uthmaniSymbol: string;
  indopakSymbol: string;
  exampleUthmani: string;
  exampleIndopak: string;
  soundRule: string;
  audioExample?: {
    surah: number;
    aya: number;
    word: number;
    label: string;
    translit: string;
  };
}

export const ARABIC_LETTERS: ArabicLetterInfo[] = [
  {
    id: 'alif',
    order: 1,
    char: 'ا',
    nameArabic: 'أَلِف',
    nameEnglish: 'Alif',
    sound: 'ā / silent seat',
    phoneticBase: 'a',
    audioFile: '/audio/letters/alif.mp3',
    category: 'vowel',
    makhraj: 'Empty space of the throat & mouth (elongates Fatha); silent when carrying Hamzatul Wasl.',
    connectsLeft: false,
    forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' },
    scriptNote: 'In Uthmani, connecting Alif appears as ٱ (Hamzatul Wasl) with a small Saad head on top.',
  },
  {
    id: 'baa',
    order: 2,
    char: 'ب',
    nameArabic: 'بَاء',
    nameEnglish: 'Baa',
    sound: 'b',
    phoneticBase: 'b',
    audioFile: '/audio/letters/baa.mp3',
    category: 'lips',
    makhraj: 'Both lips pressing together cleanly (wet inner part of the lips).',
    connectsLeft: true,
    forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
  },
  {
    id: 'taa',
    order: 3,
    char: 'ت',
    nameArabic: 'تَاء',
    nameEnglish: 'Taa',
    sound: 't (soft)',
    phoneticBase: 't',
    audioFile: '/audio/letters/taa.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue touching the gum line of the upper front teeth (light/soft T).',
    connectsLeft: true,
    forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    scriptNote: 'At the end of nouns it also appears as ة (Taa Marbutah), read as "t" when continuing or "h" when pausing.',
  },
  {
    id: 'thaa',
    order: 4,
    char: 'ث',
    nameArabic: 'ثَاء',
    nameEnglish: 'Thaa',
    sound: 'th (as in "think")',
    phoneticBase: 'th',
    audioFile: '/audio/letters/thaa.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue gently touching the bottom edge of the upper front teeth (never a "s" sound).',
    connectsLeft: true,
    forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
  },
  {
    id: 'jeem',
    order: 5,
    char: 'ج',
    nameArabic: 'جِيم',
    nameEnglish: 'Jeem',
    sound: 'j (as in "jam")',
    phoneticBase: 'j',
    audioFile: '/audio/letters/jeem.mp3',
    category: 'tongue',
    makhraj: 'Middle of the tongue pressing firmly against the middle of the hard palate.',
    connectsLeft: true,
    forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
  },
  {
    id: 'hhaa',
    order: 6,
    char: 'ح',
    nameArabic: 'حَاء',
    nameEnglish: 'Hhaa',
    sound: 'ḥ (sharp throat h)',
    phoneticBase: 'ḥ',
    audioFile: '/audio/letters/hhaa.mp3',
    category: 'throat',
    makhraj: 'Middle of the throat — a crisp, breathy, clear "h" from deeper in the throat than English "h".',
    connectsLeft: true,
    forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
  },
  {
    id: 'khaa',
    order: 7,
    char: 'خ',
    nameArabic: 'خَاء',
    nameEnglish: 'Khaa',
    sound: 'kh (heavy)',
    phoneticBase: 'kh',
    audioFile: '/audio/letters/khaa.mp3',
    category: 'heavy',
    makhraj: 'Uppermost throat (near the uvula) with light friction and a full/heavy mouth resonance.',
    connectsLeft: true,
    forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
  },
  {
    id: 'daal',
    order: 8,
    char: 'د',
    nameArabic: 'دَال',
    nameEnglish: 'Daal',
    sound: 'd (soft)',
    phoneticBase: 'd',
    audioFile: '/audio/letters/daal.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue touching the roots of the upper front teeth.',
    connectsLeft: false,
    forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
  },
  {
    id: 'dhaal',
    order: 9,
    char: 'ذ',
    nameArabic: 'ذَال',
    nameEnglish: 'Dhaal',
    sound: 'dh (as in "this")',
    phoneticBase: 'dh',
    audioFile: '/audio/letters/dhaal.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue gently touching the edge of the upper front teeth (voiced "th", never "z").',
    connectsLeft: false,
    forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
  },
  {
    id: 'raa',
    order: 10,
    char: 'ر',
    nameArabic: 'رَاء',
    nameEnglish: 'Raa',
    sound: 'r (rolled lightly)',
    phoneticBase: 'r',
    audioFile: '/audio/letters/raa.mp3',
    category: 'tongue',
    makhraj: 'Top edge of the tongue tip tapping the upper gums just behind the front teeth (heavy with Fatha/Damma, light with Kasra).',
    connectsLeft: false,
    forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
  },
  {
    id: 'zaay',
    order: 11,
    char: 'ز',
    nameArabic: 'زَاي',
    nameEnglish: 'Zaay',
    sound: 'z',
    phoneticBase: 'z',
    audioFile: '/audio/letters/zaay.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue near the lower teeth plates with a clean buzzing whistle.',
    connectsLeft: false,
    forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
  },
  {
    id: 'seen',
    order: 12,
    char: 'س',
    nameArabic: 'سِين',
    nameEnglish: 'Seen',
    sound: 's',
    phoneticBase: 's',
    audioFile: '/audio/letters/seen.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue near the lower teeth plates with a light, crisp whistle.',
    connectsLeft: true,
    forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
  },
  {
    id: 'sheen',
    order: 13,
    char: 'ش',
    nameArabic: 'شِين',
    nameEnglish: 'Sheen',
    sound: 'sh',
    phoneticBase: 'sh',
    audioFile: '/audio/letters/sheen.mp3',
    category: 'tongue',
    makhraj: 'Middle of the tongue raised toward the hard palate, letting air spread across the mouth.',
    connectsLeft: true,
    forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
  },
  {
    id: 'saad',
    order: 14,
    char: 'ص',
    nameArabic: 'صَاد',
    nameEnglish: 'Saad',
    sound: 'ṣ (heavy s)',
    phoneticBase: 'ṣ',
    audioFile: '/audio/letters/saad.mp3',
    category: 'heavy',
    makhraj: 'Same tip position as Seen, but the back of the tongue rises for a deep, heavy, echoing sound.',
    connectsLeft: true,
    forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
  },
  {
    id: 'daad',
    order: 15,
    char: 'ض',
    nameArabic: 'ضَاد',
    nameEnglish: 'Daad',
    sound: 'ḍ (heavy d)',
    phoneticBase: 'ḍ',
    audioFile: '/audio/letters/daad.mp3',
    category: 'heavy',
    makhraj: 'Side edge of the tongue pressing against the upper molars (never a "z" sound).',
    connectsLeft: true,
    forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
  },
  {
    id: 'ttaa',
    order: 16,
    char: 'ط',
    nameArabic: 'طَاء',
    nameEnglish: 'Ttaa',
    sound: 'ṭ (heavy t)',
    phoneticBase: 'ṭ',
    audioFile: '/audio/letters/ttaa.mp3',
    category: 'heavy',
    makhraj: 'Tongue tip on the upper gum line with the back of the tongue raised (strong, heavy, non-breathy T).',
    connectsLeft: true,
    forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
  },
  {
    id: 'dhaa',
    order: 17,
    char: 'ظ',
    nameArabic: 'ظَاء',
    nameEnglish: 'Dhaa',
    sound: 'ẓ (heavy dh)',
    phoneticBase: 'ẓ',
    audioFile: '/audio/letters/dhaa.mp3',
    category: 'heavy',
    makhraj: 'Tongue tip at the upper teeth edge (like Dhaal) with the back of the tongue raised (never "z").',
    connectsLeft: true,
    forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
  },
  {
    id: 'ayn',
    order: 18,
    char: 'ع',
    nameArabic: 'عَيْن',
    nameEnglish: 'Ayn',
    sound: 'ʿ (deep throat)',
    phoneticBase: 'ʿ',
    audioFile: '/audio/letters/ayn.mp3',
    category: 'throat',
    makhraj: 'Middle of the throat — gently constricting the epiglottis (same place as Hhaa, voiced).',
    connectsLeft: true,
    forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
  },
  {
    id: 'ghayn',
    order: 19,
    char: 'غ',
    nameArabic: 'غَيْن',
    nameEnglish: 'Ghayn',
    sound: 'gh (heavy gargle)',
    phoneticBase: 'gh',
    audioFile: '/audio/letters/ghayn.mp3',
    category: 'heavy',
    makhraj: 'Uppermost part of the throat with a smooth, full-mouth vibration (like a soft French "r").',
    connectsLeft: true,
    forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
  },
  {
    id: 'faa',
    order: 20,
    char: 'ف',
    nameArabic: 'فَاء',
    nameEnglish: 'Faa',
    sound: 'f',
    phoneticBase: 'f',
    audioFile: '/audio/letters/faa.mp3',
    category: 'lips',
    makhraj: 'Edges of the upper front teeth resting lightly on the wet inner part of the lower lip.',
    connectsLeft: true,
    forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
  },
  {
    id: 'qaaf',
    order: 21,
    char: 'ق',
    nameArabic: 'قَاف',
    nameEnglish: 'Qaaf',
    sound: 'q (deep heavy k)',
    phoneticBase: 'q',
    audioFile: '/audio/letters/qaaf.mp3',
    category: 'heavy',
    makhraj: 'Deepest back of the tongue touching the soft palate/uvula for a resonant, heavy "q".',
    connectsLeft: true,
    forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
  },
  {
    id: 'kaaf',
    order: 22,
    char: 'ك',
    indopakChar: 'ک',
    nameArabic: 'كَاف',
    nameEnglish: 'Kaaf',
    sound: 'k (light)',
    phoneticBase: 'k',
    audioFile: '/audio/letters/kaaf.mp3',
    category: 'tongue',
    makhraj: 'Back of the tongue touching the hard/soft palate border, slightly forward from Qaaf.',
    connectsLeft: true,
    forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    scriptNote: 'In IndoPak script, initial/medial/isolated Kaaf often appears in its swash form (ک / ڪ) without the small inner hamza-like mark.',
  },
  {
    id: 'laam',
    order: 23,
    char: 'ل',
    nameArabic: 'لَام',
    nameEnglish: 'Laam',
    sound: 'l',
    phoneticBase: 'l',
    audioFile: '/audio/letters/laam.mp3',
    category: 'tongue',
    makhraj: 'Front edge of the tongue touching the upper gums behind the front teeth (heavy only in the word "Allah" after Fatha/Damma).',
    connectsLeft: true,
    forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
  },
  {
    id: 'meem',
    order: 24,
    char: 'م',
    nameArabic: 'مِيم',
    nameEnglish: 'Meem',
    sound: 'm',
    phoneticBase: 'm',
    audioFile: '/audio/letters/meem.mp3',
    category: 'lips',
    makhraj: 'Both lips closing gently while sound flows through the nasal passage (Ghunnah).',
    connectsLeft: true,
    forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
  },
  {
    id: 'noon',
    order: 25,
    char: 'ن',
    nameArabic: 'نُون',
    nameEnglish: 'Noon',
    sound: 'n',
    phoneticBase: 'n',
    audioFile: '/audio/letters/noon.mp3',
    category: 'tongue',
    makhraj: 'Tip of the tongue touching the upper gums with nasal resonance.',
    connectsLeft: true,
    forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
  },
  {
    id: 'haa',
    order: 26,
    char: 'ه',
    indopakChar: 'ہ',
    nameArabic: 'هَاء',
    nameEnglish: 'Haa',
    sound: 'h (soft chest h)',
    phoneticBase: 'h',
    audioFile: '/audio/letters/haa.mp3',
    category: 'throat',
    makhraj: 'Deepest part of the throat (vocal cords), like a gentle sigh (distinct from sharp Hhaa ح).',
    connectsLeft: true,
    forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
    scriptNote: 'In IndoPak Nastaliq, medial and isolated Haa can appear in curved/hook forms (ہ / ـہـ / ـھـ) whereas Uthmani uses the double-loop shape (ـهـ).',
  },
  {
    id: 'waaw',
    order: 27,
    char: 'و',
    nameArabic: 'وَاو',
    nameEnglish: 'Waaw',
    sound: 'w / ū',
    phoneticBase: 'w',
    audioFile: '/audio/letters/waaw.mp3',
    category: 'lips',
    makhraj: 'Rounding both lips forward without closing them completely (or elongating Damma as "ū").',
    connectsLeft: false,
    forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
  },
  {
    id: 'yaa',
    order: 28,
    char: 'ي',
    indopakChar: 'ی',
    nameArabic: 'يَاء',
    nameEnglish: 'Yaa',
    sound: 'y / ī',
    phoneticBase: 'y',
    audioFile: '/audio/letters/yaa.mp3',
    category: 'vowel',
    makhraj: 'Middle of the tongue rising toward the palate (or elongating Kasra as "ī").',
    connectsLeft: true,
    forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
    scriptNote: 'In IndoPak script, final Yaa (ی) is often written WITHOUT the two bottom dots — do not confuse it with Alif Maqsurah (ى) when it carries Kasra/harakat!',
  },
  {
    id: 'hamzah',
    order: 29,
    char: 'ء',
    nameArabic: 'هَمْزَة',
    nameEnglish: 'Hamzah',
    sound: 'ʾ (glottal stop)',
    phoneticBase: 'ʾ',
    audioFile: '/audio/letters/hamzah.mp3',
    category: 'throat',
    makhraj: 'Deepest part of the throat (clean glottal catch, like the break in "uh-oh"). Can sit alone (ء) or on Alif (أ / إ), Waaw (ؤ), or Yaa (ئ).',
    connectsLeft: false,
    forms: { isolated: 'ء', initial: 'أ / إ', medial: 'ـؤ / ـئـ', final: 'ء / ـأ / ـئ' },
  },
  {
    id: 'laam_alif',
    order: 30,
    char: 'لا',
    nameArabic: 'لَام أَلِف',
    nameEnglish: 'Laam-Alif',
    sound: 'lā',
    phoneticBase: 'lā',
    audioFile: '/audio/letters/laam_alif.mp3',
    category: 'vowel',
    makhraj: 'Ligature combining Laam (ل) followed by Alif (ا) — always written together as one crossed glyph.',
    connectsLeft: false,
    forms: { isolated: 'لا', initial: 'لا', medial: 'ـلا', final: 'ـلا' },
  },
];

export const HARAKAT_SIGNS: HarakahSignInfo[] = [
  {
    id: 'fatha',
    nameArabic: 'فَتْحَة',
    nameEnglish: 'Fatha (Zabar)',
    otherNames: 'Short "a"',
    uthmaniSymbol: 'بَ',
    indopakSymbol: 'بَ',
    exampleUthmani: 'رَبِّ',
    exampleIndopak: 'رَبِّ',
    soundRule: 'A diagonal dash ABOVE the letter. Opens the mouth for a short "a" sound (like "u" in "but" or "a" in "cat" for light letters).',
    audioExample: { surah: 1, aya: 2, word: 3, label: 'رَبِّ (Rabbi)', translit: 'rabbi' },
  },
  {
    id: 'kasra',
    nameArabic: 'كَسْرَة',
    nameEnglish: 'Kasra (Zer)',
    otherNames: 'Short "i"',
    uthmaniSymbol: 'بِ',
    indopakSymbol: 'بِ',
    exampleUthmani: 'بِسْمِ',
    exampleIndopak: 'بِسۡمِ',
    soundRule: 'A diagonal dash BELOW the letter. Produces a crisp short "i" sound (as in "bit").',
    audioExample: { surah: 1, aya: 1, word: 1, label: 'بِسْمِ (Bismi)', translit: 'bismi' },
  },
  {
    id: 'damma',
    nameArabic: 'ضَمَّة',
    nameEnglish: 'Damma (Pesh)',
    otherNames: 'Short "u"',
    uthmaniSymbol: 'بُ',
    indopakSymbol: 'بُ',
    exampleUthmani: 'نَعْبُدُ',
    exampleIndopak: 'نَعۡبُدُ',
    soundRule: 'A small loop ABOVE the letter. Rounds the lips for a short "u" sound (as in "put").',
    audioExample: { surah: 1, aya: 5, word: 2, label: 'نَعْبُدُ (Naʿbudu)', translit: 'naʿbudu' },
  },
  {
    id: 'sukoon',
    nameArabic: 'سُكُون / جَزْم',
    nameEnglish: 'Sukoon / Jazm',
    otherNames: 'Silent stop on consonant',
    uthmaniSymbol: 'بۡ',
    indopakSymbol: 'بْ',
    exampleUthmani: 'بِسۡمِ',
    exampleIndopak: 'بِسْمِ',
    soundRule: 'No vowel — stops cleanly on the consonant, joining it to the vowel before it. Uthmani uses a small open Khaa head (ۡ); IndoPak uses a round/crescent Jazm (ْ).',
    audioExample: { surah: 112, aya: 1, word: 1, label: 'قُلْ (Qul)', translit: 'qul' },
  },
  {
    id: 'shaddah',
    nameArabic: 'شَدَّة',
    nameEnglish: 'Shaddah (Tashdeed)',
    otherNames: 'Doubled consonant',
    uthmaniSymbol: 'بّ',
    indopakSymbol: 'بّ',
    exampleUthmani: 'إِيَّاكَ',
    exampleIndopak: 'اِيَّاكَ',
    soundRule: 'A small "w"-like mark ABOVE the letter. Doubles and stresses the consonant cleanly (like holding the "n" in "un-known"). Always carries a Fatha, Kasra, or Damma.',
    audioExample: { surah: 1, aya: 5, word: 1, label: 'إِيَّاكَ (Iyyāka)', translit: 'iyyāka' },
  },
  {
    id: 'tanween_fath',
    nameArabic: 'تَنْوِين فَتْح',
    nameEnglish: 'Fathatan (Do Zabar)',
    otherNames: '"-an" ending',
    uthmaniSymbol: 'بً',
    indopakSymbol: 'بً',
    exampleUthmani: 'هُدًى',
    exampleIndopak: 'هُدًى',
    soundRule: 'Double Fatha ABOVE the letter, adding an "-an" sound. In Uthmani, staggered/offset bars indicate Idgham or Ikhfa (merging/hiding the "n" sound).',
    audioExample: { surah: 2, aya: 2, word: 6, label: 'هُدًى (Hudan)', translit: 'hudan' },
  },
  {
    id: 'tanween_kasr',
    nameArabic: 'تَنْوِين كَسْر',
    nameEnglish: 'Kasratan (Do Zer)',
    otherNames: '"-in" ending',
    uthmaniSymbol: 'بٍ',
    indopakSymbol: 'بٍ',
    exampleUthmani: 'حَاسِدٍ',
    exampleIndopak: 'حَاسِدٍ',
    soundRule: 'Double Kasra BELOW the letter, adding an "-in" sound.',
    audioExample: { surah: 113, aya: 5, word: 3, label: 'حَاسِدٍ (Ḥāsidin)', translit: 'ḥāsidin' },
  },
  {
    id: 'tanween_damm',
    nameArabic: 'تَنْوِين ضَمّ',
    nameEnglish: 'Dammatan (Do Pesh)',
    otherNames: '"-un" ending',
    uthmaniSymbol: 'بٌ',
    indopakSymbol: 'بٌ',
    exampleUthmani: 'أَحَدٌ',
    exampleIndopak: 'اَحَدٌ',
    soundRule: 'Double Damma ABOVE the letter, adding an "-un" sound.',
    audioExample: { surah: 112, aya: 1, word: 4, label: 'أَحَدٌ (Aḥadun)', translit: 'aḥadun' },
  },
  {
    id: 'standing_vowels',
    nameArabic: 'حُرُوف المَدّ الصَّغِيرَة',
    nameEnglish: 'Standing Alif / Khari Harakat',
    otherNames: '2-count elongation',
    uthmaniSymbol: 'مَٰ / هُۥ / بِۦ',
    indopakSymbol: 'مٰ / ہٗ / بٖ',
    exampleUthmani: 'ٱلرَّحْمَٰنِ',
    exampleIndopak: 'الرَّحْمٰنِ',
    soundRule: 'Stretches the vowel for 2 counts ("ā", "ī", "ū"). IndoPak writes Khari Zabar (ٰ), Khari Zer (ٖ), and Ulta Pesh (ٗ); Uthmani uses Dagger Alif (ٰ) and small Waw/Yaa (ۥ / ۦ).',
    audioExample: { surah: 1, aya: 1, word: 3, label: 'ٱلرَّحْمَـٰنِ (Ar-Raḥmān)', translit: 'ar-raḥmāni' },
  },
  {
    id: 'madd',
    nameArabic: 'مَدّ',
    nameEnglish: 'Madd (Long Stretch)',
    otherNames: '4–6 count elongation',
    uthmaniSymbol: 'آ',
    indopakSymbol: 'اۤ',
    exampleUthmani: 'ٱلضَّآلِّينَ',
    exampleIndopak: 'الضَّآلِّيْنَ',
    soundRule: 'A wavy tilde ABOVE a vowel letter. Signals a long stretch of 4 to 6 counts before a Hamzah or Shaddah.',
    audioExample: { surah: 1, aya: 7, word: 9, label: 'ٱلضَّآلِّينَ (Aḍ-Ḍāllīn)', translit: 'aḍ-ḍāllīn' },
  },
  {
    id: 'hamzat_wasl',
    nameArabic: 'هَمْزَةُ الْوَصْل',
    nameEnglish: 'Hamzatul Wasl (Connecting Alif)',
    otherNames: 'Silent mid-phrase',
    uthmaniSymbol: 'ٱ',
    indopakSymbol: 'ا',
    exampleUthmani: 'ٱلْحَمْدُ',
    exampleIndopak: 'اَلْحَمْدُ',
    soundRule: 'In Uthmani, marked with a tiny Saad loop on Alif (ٱ). Pronounced ONLY if starting from that word; skipped silently when reading smoothly from the previous word. IndoPak writes regular Alif with the starting vowel.',
    audioExample: { surah: 1, aya: 2, word: 1, label: 'ٱلْحَمْدُ (Al-ḥamdu)', translit: 'al-ḥamdu' },
  },
];

// Lookup map for every Arabic base letter & orthographic variant
const LETTER_BY_CHAR: Record<string, ArabicLetterInfo> = {};
for (const item of ARABIC_LETTERS) {
  LETTER_BY_CHAR[item.char] = item;
  if (item.indopakChar) LETTER_BY_CHAR[item.indopakChar] = item;
}

const CHAR_ALIAS_MAP: Record<string, { letterId: string; extraNote?: string }> = {
  'ٱ': {
    letterId: 'alif',
    extraNote: 'Hamzatul Wasl — pronounced when starting here, silent when continuing from the previous word.',
  },
  'آ': {
    letterId: 'alif',
    extraNote: 'Alif Maddah — elongated "ā" sound.',
  },
  'أ': {
    letterId: 'hamzah',
    extraNote: 'Hamzah seated on Alif (reads as glottal stop "ʾ" + vowel).',
  },
  'إ': {
    letterId: 'hamzah',
    extraNote: 'Hamzah seated under Alif (reads with Kasra "ʾi").',
  },
  'ؤ': {
    letterId: 'hamzah',
    extraNote: 'Hamzah seated on Waaw (Waaw is silent; pronounce the Hamzah).',
  },
  'ئ': {
    letterId: 'hamzah',
    extraNote: 'Hamzah seated on Yaa (Yaa is silent; pronounce the Hamzah).',
  },
  'ة': {
    letterId: 'taa',
    extraNote: 'Taa Marbutah (tied Taa) — read as "t" when continuing, or soft "h" when pausing.',
  },
  'ى': {
    letterId: 'alif',
    extraNote: 'Alif Maqsurah — shaped like dotless Yaa, elongates Fatha as "ā".',
  },
  'ی': {
    letterId: 'yaa',
  },
  'ک': {
    letterId: 'kaaf',
  },
  'ڪ': {
    letterId: 'kaaf',
  },
  'ہ': {
    letterId: 'haa',
  },
  'ھ': {
    letterId: 'haa',
  },
};

export function findLetterInfo(baseChar: string): { info: ArabicLetterInfo; extraNote?: string } | null {
  const alias = CHAR_ALIAS_MAP[baseChar];
  if (alias) {
    const found = ARABIC_LETTERS.find((l) => l.id === alias.letterId);
    if (found) return { info: found, extraNote: alias.extraNote };
  }
  const direct = LETTER_BY_CHAR[baseChar];
  if (direct) return { info: direct };
  return null;
}

export interface WordLetterToken {
  index: number;
  display: string;
  baseChar: string;
  letterInfo: ArabicLetterInfo | null;
  diacritics: string[];
  syllableReading: string;
  ttsArabic: string;
  specialNote?: string;
}

// Combining marks & small Qur'anic signs that attach to the preceding base letter
const COMBINING_MARK_LABELS: Record<string, string> = {
  '\u064E': 'Fatha (َ)',
  '\u064F': 'Damma (ُ)',
  '\u0650': 'Kasra (ِ)',
  '\u064B': 'Fathatan (ً)',
  '\u064C': 'Dammatan (ٌ)',
  '\u064D': 'Kasratan (ٍ)',
  '\u0651': 'Shaddah (ّ)',
  '\u0652': 'Sukoon (ْ)',
  '\u06E1': 'Sukoon (ۡ)',
  '\u0653': 'Madd (ٓ)',
  '\u0654': 'Hamza Above (ٔ)',
  '\u0655': 'Hamza Below (ٕ)',
  '\u0656': 'Subscript Alif / Khari Zer (ٖ)',
  '\u0657': 'Inverted Damma / Ulta Pesh (ٗ)',
  '\u0670': 'Standing Alif / Khari Zabar (ٰ)',
  '\u06DF': 'Rounded Zero (۟ — silent letter)',
  '\u06E0': 'Rectangular Zero (۠ — silent on pause)',
  '\u06E2': 'Small High Meem (ۢ — Iqlab "m")',
  '\u06E3': 'Small Low Seen (ۣ)',
  '\u06E4': 'Small High Madda (ۤ)',
  '\u06E5': 'Small Waaw (ۥ — 2-count "ū")',
  '\u06E6': 'Small Yaa (ۦ — 2-count "ī")',
  '\u06E8': 'Small High Noon (ۨ)',
  '\u06ED': 'Small Low Meem (ۭ)',
  '\u0640': '', // Tatweel carrier (ignored in labels)
};

function isCombiningOrCarrier(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    ch === '\u0640' ||
    (code >= 0x0610 && code <= 0x0614) ||
    (code >= 0x064b && code <= 0x065f) ||
    code === 0x0670 ||
    (code >= 0x06df && code <= 0x06e8) ||
    (code >= 0x06ea && code <= 0x06ed)
  );
}

function isWaqfOrNoiseChar(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    code === 0x0615 ||
    (code >= 0x06d6 && code <= 0x06de) ||
    code === 0x06e9 ||
    code === 0x200c ||
    code === 0x200d ||
    code === 0x200e ||
    code === 0x200f ||
    code === 0xfeff ||
    /\s/.test(ch)
  );
}

function buildSyllableReading(
  baseChar: string,
  marks: string[],
  info: ArabicLetterInfo | null,
  isWordStart: boolean
): string {
  const markSet = new Set(marks);

  if (markSet.has('\u06DF')) {
    return 'Silent letter (rounded zero)';
  }
  if (baseChar === 'ٱ') {
    return 'Connecting Alif (silent mid-phrase)';
  }

  const baseSound = info?.phoneticBase || '';
  const hasShaddah = markSet.has('\u0651');
  const doublePrefix = hasShaddah && baseSound ? baseSound : '';

  // Alif / Alif Maqsurah without Hamza usually acts as vowel carrier / elongation
  if (baseChar === 'ا' || baseChar === 'ى') {
    if (markSet.has('\u0653') || markSet.has('\u06E4')) return 'āāā (long stretch)';
    if (markSet.has('\u064E')) return 'a';
    if (markSet.has('\u064F')) return 'u';
    if (markSet.has('\u0650')) return 'i';
    if (markSet.has('\u064B')) return '-an';
    if (isWordStart && baseChar === 'ا') return 'a / i / u (starting Alif)';
    return 'ā (elongates Fatha)';
  }

  if (baseChar === 'آ') {
    return 'ʾāā (Madd)';
  }

  const onset = baseChar === 'ء' || baseChar === 'أ' || baseChar === 'إ' || baseChar === 'ؤ' || baseChar === 'ئ'
    ? 'ʾ'
    : `${doublePrefix}${baseSound}`;

  if (markSet.has('\u0652') || markSet.has('\u06E1')) {
    return `${onset} (stop / sukoon)`;
  }
  if (markSet.has('\u064B')) return `${onset}an`;
  if (markSet.has('\u064D')) return `${onset}in`;
  if (markSet.has('\u064C')) return `${onset}un`;
  if (markSet.has('\u0670')) return `${onset}ā`;
  if (markSet.has('\u0656')) return `${onset}ī`;
  if (markSet.has('\u0657')) return `${onset}ū`;
  if (markSet.has('\u064E')) return `${onset}a`;
  if (markSet.has('\u0650')) return `${onset}i`;
  if (markSet.has('\u064F')) return `${onset}u`;
  if (markSet.has('\u06E5')) return `${onset}ū`;
  if (markSet.has('\u06E6')) return `${onset}ī`;

  if (hasShaddah) return `${onset} (doubled)`;
  if (baseChar === 'و') return 'w / ū';
  if (baseChar === 'ي' || baseChar === 'ی') return 'y / ī';

  return baseSound || info?.sound || '';
}

export function analyzeArabicWord(wordText: string): WordLetterToken[] {
  if (!wordText) return [];

  const tokens: WordLetterToken[] = [];
  let currentBase = '';
  let currentDisplay = '';
  let currentMarks: string[] = [];
  let pendingTatweel = false;

  const flush = () => {
    if (!currentBase) return;
    const isWordStart = tokens.length === 0;
    const match = findLetterInfo(currentBase);
    const info = match?.info || null;
    const labels: string[] = [];
    for (const m of currentMarks) {
      const label = COMBINING_MARK_LABELS[m];
      if (label && !labels.includes(label)) labels.push(label);
    }

    // Build clean TTS string (strip Uthmani-only symbols like tatweel/rounded zero that confuse TTS)
    const cleanTts = (currentBase + currentMarks.filter((m) => m !== '\u0640' && m !== '\u06DF' && m !== '\u06E0').join(''))
      .replace('\u06E1', '\u0652')
      .replace('ٱ', 'ا');

    tokens.push({
      index: tokens.length + 1,
      display: currentDisplay,
      baseChar: currentBase,
      letterInfo: info,
      diacritics: labels,
      syllableReading: buildSyllableReading(currentBase, currentMarks, info, isWordStart),
      ttsArabic: cleanTts,
      specialNote: match?.extraNote,
    });

    currentBase = '';
    currentDisplay = '';
    currentMarks = [];
    pendingTatweel = false;
  };

  for (const ch of Array.from(wordText)) {
    if (isWaqfOrNoiseChar(ch)) {
      continue;
    }
    if (ch === '\u0640') {
      if (currentBase) {
        currentDisplay += ch;
        pendingTatweel = true;
      }
      continue;
    }
    // Uthmani inline Hamzah on tatweel (e.g. يَسْـَٔلُونَكَ, يَـُٔودُهُ) is its own Hamzah letter
    if (pendingTatweel && (ch === '\u0654' || ch === '\u0655')) {
      if (currentDisplay.endsWith('\u0640')) {
        currentDisplay = currentDisplay.slice(0, -1);
      }
      flush();
      currentBase = 'ء';
      currentDisplay = `\u0640${ch}`;
      currentMarks = [];
      continue;
    }
    if (isCombiningOrCarrier(ch)) {
      if (currentBase) {
        currentDisplay += ch;
        currentMarks.push(ch);
      }
      pendingTatweel = false;
      continue;
    }
    // New base letter
    flush();
    currentBase = ch;
    currentDisplay = ch;
    currentMarks = [];
  }
  flush();

  return tokens;
}

export function getVowelSyllablesForLetter(letter: ArabicLetterInfo) {
  // For Alif & Laam-Alif, use Hamzah on Alif for Fatha/Kasra/Damma examples
  const host = letter.id === 'alif' ? 'أ' : letter.id === 'laam_alif' ? 'لا' : letter.char;
  const p = letter.id === 'alif' ? 'ʾ' : letter.phoneticBase;

  if (letter.id === 'laam_alif') {
    return [
      { label: 'Fatha', glyph: 'لَا', reading: 'lā', tts: 'لا' },
      { label: 'Fathatan', glyph: 'لًا', reading: 'lan', tts: 'لاً' },
    ];
  }

  return [
    { label: 'Fatha', glyph: `${host}\u064E`, reading: `${p}a`, tts: `${host}\u064E` },
    { label: 'Kasra', glyph: `${letter.id === 'alif' ? 'إ' : host}\u0650`, reading: `${p}i`, tts: `${letter.id === 'alif' ? 'إ' : host}\u0650` },
    { label: 'Damma', glyph: `${host}\u064F`, reading: `${p}u`, tts: `${host}\u064F` },
    { label: 'Fathatan', glyph: `${host}\u064B`, reading: `${p}an`, tts: `${host}\u064B` },
    { label: 'Kasratan', glyph: `${letter.id === 'alif' ? 'إ' : host}\u064D`, reading: `${p}in`, tts: `${letter.id === 'alif' ? 'إ' : host}\u064D` },
    { label: 'Dammatan', glyph: `${host}\u064C`, reading: `${p}un`, tts: `${host}\u064C` },
  ];
}
