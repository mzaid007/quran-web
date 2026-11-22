// Tajweed Rule Types & Dynamic Tokenizer
// Grapheme-cluster aware parsing to preserve Arabic cursive shaping, ligatures, and diacritical marks.

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

// Tajweed styles MUST strictly preserve font-weight: normal (no faux-bold)
// to prevent stroke widening, glyph collision, and cursive disconnection in Arabic calligraphy.
export const TAJWEED_STYLES: Record<TajweedRuleType, { colorClass: string; label: string }> = {
  ghunnah: {
    colorClass: 'text-amber-600 dark:text-amber-400',
    label: 'Ghunnah (Nasalization)',
  },
  qalqalah: {
    colorClass: 'text-sky-600 dark:text-sky-400',
    label: 'Qalqalah (Echoing)',
  },
  iqlab: {
    colorClass: 'text-purple-600 dark:text-purple-400',
    label: 'Iqlāb (Conversion to Meem)',
  },
  madd: {
    colorClass: 'text-rose-600 dark:text-rose-400',
    label: 'Madd (Prolongation)',
  },
  idgham: {
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    label: 'Idghām (Assimilation)',
  },
  ikhfa: {
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    label: 'Ikhfā’ (Concealment)',
  },
  normal: {
    colorClass: '',
    label: 'Normal',
  },
};

const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
const IKHFA_LETTERS = new Set([
  'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'
]);
const SHADDAH = '\u0651';
const IQLAB_CHAR = '\u06E2';

/**
 * Check if a character is an Arabic combining mark (harakah, tashkeel, Quranic diacritic).
 * Combining marks must never be detached from their base character.
 */
function isCombiningMark(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x0610 && code <= 0x061A) ||
    (code >= 0x064B && code <= 0x065F) ||
    code === 0x0670 ||
    (code >= 0x06D6 && code <= 0x06DC) ||
    (code >= 0x06DF && code <= 0x06E4) ||
    (code >= 0x06E7 && code <= 0x06E8) ||
    (code >= 0x06EA && code <= 0x06ED) ||
    (code >= 0x08D3 && code <= 0x08FF)
  );
}

/**
 * Splits an Arabic word into atomic grapheme clusters:
 * Each cluster starts with exactly one base character, followed by all of its attached combining marks.
 */
function splitIntoGraphemeClusters(text: string): string[] {
  const clusters: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (isCombiningMark(ch) && clusters.length > 0) {
      clusters[clusters.length - 1] += ch;
    } else {
      clusters.push(ch);
    }
  }
  return clusters;
}

/**
 * Tokenize a word into styled Tajweed chunks without separating diacritics from base letters.
 * Preserves 100% of underlying characters while preventing glyph collision and cursive disconnection.
 */
export function parseTajweedWord(word: string): TajweedSegment[] {
  if (!word) return [];
  const clusters = splitIntoGraphemeClusters(word);
  if (clusters.length === 0) return [];

  const classified: TajweedSegment[] = clusters.map((cluster, idx) => {
    const base = cluster[0];

    // Madd: Precomposed Alif with Maddah or cluster containing Maddah mark (\u0653 or \u06E4)
    if (base === 'آ' || cluster.includes('\u0653') || cluster.includes('\u06E4')) {
      return { text: cluster, rule: 'madd', label: 'Madd (Prolongation)' };
    }

    // Iqlab: Cluster contains Iqlab small high meem (\u06E2)
    if (cluster.includes(IQLAB_CHAR)) {
      return { text: cluster, rule: 'iqlab', label: 'Iqlāb (Conversion to Meem)' };
    }

    // Ghunnah: Noon or Meem with Shaddah (\u0651)
    if ((base === 'ن' || base === 'م') && cluster.includes(SHADDAH)) {
      return { text: cluster, rule: 'ghunnah', label: 'Ghunnah (Nasalization)' };
    }

    // Qalqalah: Qutb Jad (ق ط ب ج د) carrying Sukun (\u0652 or \u06E1)
    if (QALQALAH_LETTERS.has(base) && (cluster.includes('\u0652') || cluster.includes('\u06E1'))) {
      return { text: cluster, rule: 'qalqalah', label: 'Qalqalah (Echoing)' };
    }

    // Ikhfa: Noon Saakinah (naked in Uthmani, or with sukun in IndoPak) before an Ikhfa letter
    const isNoonSaakin =
      base === 'ن' &&
      (cluster.length === 1 || cluster === 'ن\u0652' || cluster === 'ن\u06E1');
    if (isNoonSaakin && idx < clusters.length - 1) {
      const nextBase = clusters[idx + 1][0];
      if (IKHFA_LETTERS.has(nextBase)) {
        return { text: cluster, rule: 'ikhfa', label: 'Ikhfā’ (Concealment)' };
      }
    }

    return { text: cluster, rule: 'normal' };
  });

  // Merge consecutive segments with the same rule into a single segment to minimize DOM elements
  const merged: TajweedSegment[] = [];
  for (const item of classified) {
    if (merged.length > 0 && merged[merged.length - 1].rule === item.rule) {
      merged[merged.length - 1].text += item.text;
    } else {
      merged.push({ ...item });
    }
  }

  return merged;
}
