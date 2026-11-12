// Tajweed Rule Types & Dynamic Tokenizer
// Pure client-side parsing without modifying underlying canonical text

export type TajweedRuleType =
  | 'ghunnah'
  | 'qalqalah'
  | 'iqlab'
  | 'madd'
  | 'idgham'
  | 'ikhfa'
  | 'normal';

export interface TajweedSegment {
  text: string;
  rule: TajweedRuleType;
  label?: string;
}

export const TAJWEED_STYLES: Record<TajweedRuleType, { colorClass: string; label: string }> = {
  ghunnah: {
    colorClass: 'text-amber-600 dark:text-amber-400 font-semibold',
    label: 'Ghunnah (Nasalization)',
  },
  qalqalah: {
    colorClass: 'text-sky-600 dark:text-sky-400 font-semibold',
    label: 'Qalqalah (Echoing)',
  },
  iqlab: {
    colorClass: 'text-purple-600 dark:text-purple-400 font-semibold',
    label: 'Iqlāb (Conversion to Meem)',
  },
  madd: {
    colorClass: 'text-rose-600 dark:text-rose-400 font-semibold',
    label: 'Madd (Prolongation)',
  },
  idgham: {
    colorClass: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    label: 'Idghām (Assimilation)',
  },
  ikhfa: {
    colorClass: 'text-indigo-600 dark:text-indigo-400 font-semibold',
    label: 'Ikhfā’ (Concealment)',
  },
  normal: {
    colorClass: '',
    label: 'Normal',
  },
};

const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
const SUKUN_CHARS = new Set(['\u0652', '\u06E1']);
const SHADDAH = '\u0651';
const MADDAH_CHARS = new Set(['\u0653', '\u06E4']);
const IQLAB_CHAR = '\u06E2';

/**
 * Tokenize a word or segment into styled Tajweed chunks without changing characters.
 */
export function parseTajweedWord(word: string): TajweedSegment[] {
  if (!word) return [];

  // If word contains Iqlab marker
  if (word.includes(IQLAB_CHAR)) {
    const parts = word.split(IQLAB_CHAR);
    const segs: TajweedSegment[] = [];
    parts.forEach((p, idx) => {
      if (p) segs.push({ text: p, rule: 'normal' });
      if (idx < parts.length - 1) {
        segs.push({ text: IQLAB_CHAR, rule: 'iqlab', label: 'Iqlāb' });
      }
    });
    return segs;
  }

  // Check for Madd (Maddah sign)
  for (const m of MADDAH_CHARS) {
    if (word.includes(m)) {
      const parts = word.split(m);
      const segs: TajweedSegment[] = [];
      parts.forEach((p, idx) => {
        if (p) segs.push({ text: p, rule: 'normal' });
        if (idx < parts.length - 1) {
          segs.push({ text: m, rule: 'madd', label: 'Madd' });
        }
      });
      return segs;
    }
  }

  // Check for Ghunnah (Noon/Meem with Shaddah)
  for (let i = 0; i < word.length - 1; i++) {
    const c = word[i];
    const next = word[i + 1];
    if ((c === 'ن' || c === 'م') && next === SHADDAH) {
      const segs: TajweedSegment[] = [
        { text: word.slice(0, i), rule: 'normal' },
        { text: word.slice(i, i + 2), rule: 'ghunnah', label: 'Ghunnah' },
        { text: word.slice(i + 2), rule: 'normal' },
      ];
      return segs.filter((s) => s.text.length > 0);
    }
  }

  // Check for Qalqalah (Qaf, Tah, Ba, Jeem, Daal with Sukun)
  for (let i = 0; i < word.length - 1; i++) {
    const c = word[i];
    const next = word[i + 1];
    if (QALQALAH_LETTERS.has(c) && SUKUN_CHARS.has(next)) {
      const segs: TajweedSegment[] = [
        { text: word.slice(0, i), rule: 'normal' },
        { text: word.slice(i, i + 2), rule: 'qalqalah', label: 'Qalqalah' },
        { text: word.slice(i + 2), rule: 'normal' },
      ];
      return segs.filter((s) => s.text.length > 0);
    }
  }

  return [{ text: word, rule: 'normal' }];
}
