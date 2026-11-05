import React, { useState, useRef } from 'react';
import { X, Share2, Download, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { toBlob } from 'html-to-image';
import type { Verse, ScriptType, TranslationChoice } from '../types';

interface ShareVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  verse: Verse | null;
  script: ScriptType;
  translation: TranslationChoice;
}

type ShareContentMode = 'arabic_only' | 'arabic_translation' | 'all';
type ThemePreset = 'emerald' | 'light' | 'midnight' | 'sand';

export const ShareVerseModal: React.FC<ShareVerseModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  verse,
  script,
  translation,
}) => {
  const [contentMode, setContentMode] = useState<ShareContentMode>('arabic_translation');
  const [activeTheme, setActiveTheme] = useState<ThemePreset>('emerald');
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationChoice>(() => {
    return translation === 'none' ? 'romanUrdu' : translation;
  });

  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !verse) return null;

  // Resolve Arabic Text based on current script choice
  const arabicText = script === 'uthmani' ? verse.uthmani : verse.indopak || verse.uthmani;

  // Resolve translation text and attribution
  let transText = '';
  let transAuthor = '';
  if (selectedTranslation === 'romanUrdu') {
    transText = verse.romanUrdu || '';
    transAuthor = 'Tafheem-ul-Quran (Syed Abul A\'la Maududi - Roman Urdu)';
  } else if (selectedTranslation === 'khattab') {
    transText = verse.khattab || '';
    transAuthor = 'The Clear Quran (Dr. Mustafa Khattab)';
  } else if (selectedTranslation === 'saheeh') {
    transText = verse.saheeh || '';
    transAuthor = 'Saheeh International';
  } else if (selectedTranslation === 'jalalayn') {
    transText = verse.jalalayn || '';
    transAuthor = 'Tafsir al-Jalalayn';
  }

  // Theme styles for the card
  const themeStyles = {
    emerald: {
      card: 'bg-gradient-to-br from-emerald-950 via-[#06332d] to-slate-950 text-emerald-50 border-emerald-800/40 shadow-emerald-950/50',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      arabic: 'text-amber-100/95',
      translit: 'text-emerald-200/80',
      translation: 'text-emerald-100/90',
      author: 'text-emerald-400/80',
      footer: 'text-emerald-300/60 border-emerald-800/40',
      numberCircle: 'border-emerald-400/50 text-emerald-300',
    },
    midnight: {
      card: 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-black text-neutral-100 border-neutral-800 shadow-black/80',
      badge: 'bg-zinc-800 text-teal-300 border-zinc-700',
      arabic: 'text-neutral-100',
      translit: 'text-neutral-400',
      translation: 'text-neutral-200',
      author: 'text-teal-400/80',
      footer: 'text-neutral-500 border-neutral-800',
      numberCircle: 'border-teal-500/50 text-teal-300',
    },
    light: {
      card: 'bg-white text-gray-900 border-gray-200 shadow-xl shadow-gray-200/50',
      badge: 'bg-teal-50 text-brand-teal border-teal-200',
      arabic: 'text-gray-950',
      translit: 'text-gray-600',
      translation: 'text-gray-800',
      author: 'text-brand-teal',
      footer: 'text-gray-400 border-gray-100',
      numberCircle: 'border-brand-teal text-brand-teal',
    },
    sand: {
      card: 'bg-[#faf6ed] text-stone-900 border-amber-200/80 shadow-stone-300/40',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      arabic: 'text-amber-950',
      translit: 'text-stone-600',
      translation: 'text-stone-800',
      author: 'text-amber-800',
      footer: 'text-stone-400 border-amber-200/50',
      numberCircle: 'border-amber-700/60 text-amber-900',
    },
  }[activeTheme];

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      const blob = await toBlob(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      });
      return blob;
    } catch (err) {
      console.error('Failed to generate image:', err);
      return null;
    }
  };

  const handleShare = async () => {
    setGenerating(true);
    setStatusMessage('Generating image...');
    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('Could not generate image');

      const fileName = `Ayah-${surahNumber}-${verse.aya}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if native Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Surah ${surahName} [${surahNumber}:${verse.aya}]`,
          text: `Surah ${surahName} [${surahNumber}:${verse.aya}] — Holy Qur'an`,
        });
        setStatusMessage('Shared successfully!');
      } else {
        // Fallback: trigger download
        triggerDownload(blob, fileName);
        setStatusMessage('Saved to downloads (Web Share not supported on this browser)');
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Share error:', err);
        setStatusMessage('Sharing cancelled or failed');
      }
    } finally {
      setGenerating(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    setGenerating(true);
    setStatusMessage('Downloading image...');
    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('Could not generate image');
      triggerDownload(blob, `Ayah-${surahNumber}-${verse.aya}.png`);
      setStatusMessage('Downloaded PNG image!');
    } catch (err) {
      console.error('Download error:', err);
      setStatusMessage('Download failed');
    } finally {
      setGenerating(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleCopyImage = async () => {
    setGenerating(true);
    setStatusMessage('Copying image...');
    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('Could not generate image');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setStatusMessage('Image copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      } else {
        triggerDownload(blob, `Ayah-${surahNumber}-${verse.aya}.png`);
        setStatusMessage('Clipboard image copy unsupported, downloaded instead');
      }
    } catch (err) {
      console.error('Clipboard copy error:', err);
      setStatusMessage('Failed to copy image');
    } finally {
      setGenerating(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-2xl max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between bg-gray-50/70 dark:bg-brand-cardDark/70 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>Share Verse as Image</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal dark:text-emerald-400 border border-brand-teal/20 whitespace-nowrap">
                  {surahNumber}:{verse.aya}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Surah {surahName} • Ayah {verse.aya}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Configuration & Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Option 1: Content Inclusion Switcher */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              1. What to Include in the Image
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-black/30 rounded-xl">
              <button
                type="button"
                onClick={() => setContentMode('arabic_only')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition text-center ${
                  contentMode === 'arabic_only'
                    ? 'bg-white dark:bg-brand-surfaceDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Arabic Only
              </button>

              <button
                type="button"
                onClick={() => setContentMode('arabic_translation')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition text-center ${
                  contentMode === 'arabic_translation'
                    ? 'bg-white dark:bg-brand-surfaceDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Arabic + Translation
              </button>

              <button
                type="button"
                onClick={() => setContentMode('all')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition text-center ${
                  contentMode === 'all'
                    ? 'bg-white dark:bg-brand-surfaceDark text-brand-teal dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Arabic + Both
              </button>
            </div>
          </div>

          {/* Option 2: Translation Selection (if active) */}
          {contentMode !== 'arabic_only' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  2. Choose Translation Edition
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTranslation('romanUrdu')}
                  className={`py-2 px-3 text-xs rounded-xl border text-left transition flex flex-col ${
                    selectedTranslation === 'romanUrdu'
                      ? 'border-brand-teal bg-brand-teal/5 dark:bg-brand-teal/15 text-brand-teal dark:text-emerald-400 font-bold'
                      : 'border-gray-200 dark:border-brand-borderDark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                  }`}
                >
                  <span className="font-semibold">Roman Urdu</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">Tafheem-ul-Quran</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslation('khattab')}
                  className={`py-2 px-3 text-xs rounded-xl border text-left transition flex flex-col ${
                    selectedTranslation === 'khattab'
                      ? 'border-brand-teal bg-brand-teal/5 dark:bg-brand-teal/15 text-brand-teal dark:text-emerald-400 font-bold'
                      : 'border-gray-200 dark:border-brand-borderDark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                  }`}
                >
                  <span className="font-semibold">The Clear Quran</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">Dr. Mustafa Khattab</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTranslation('saheeh')}
                  className={`py-2 px-3 text-xs rounded-xl border text-left transition flex flex-col ${
                    selectedTranslation === 'saheeh'
                      ? 'border-brand-teal bg-brand-teal/5 dark:bg-brand-teal/15 text-brand-teal dark:text-emerald-400 font-bold'
                      : 'border-gray-200 dark:border-brand-borderDark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-cardDark'
                  }`}
                >
                  <span className="font-semibold">Saheeh Int.</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">English</span>
                </button>
              </div>
            </div>
          )}

          {/* Option 3: Card Theme Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              {contentMode !== 'arabic_only' ? '3. Card Visual Style' : '2. Card Visual Style'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTheme('emerald')}
                className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeTheme === 'emerald'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 font-bold text-emerald-800 dark:text-emerald-300'
                    : 'border-gray-200 dark:border-brand-borderDark text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 shrink-0 shadow-sm" />
                <span className="truncate">Emerald</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTheme('midnight')}
                className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeTheme === 'midnight'
                    ? 'border-neutral-500 ring-2 ring-neutral-500/30 font-bold text-neutral-900 dark:text-neutral-100'
                    : 'border-gray-200 dark:border-brand-borderDark text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-neutral-900 shrink-0 shadow-sm" />
                <span className="truncate">Midnight</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTheme('light')}
                className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeTheme === 'light'
                    ? 'border-teal-500 ring-2 ring-teal-500/30 font-bold text-teal-800 dark:text-teal-300'
                    : 'border-gray-200 dark:border-brand-borderDark text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-gray-300 shrink-0 shadow-sm" />
                <span className="truncate">Clean Light</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTheme('sand')}
                className={`py-2 px-2 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeTheme === 'sand'
                    ? 'border-amber-600 ring-2 ring-amber-600/30 font-bold text-amber-900 dark:text-amber-300'
                    : 'border-gray-200 dark:border-brand-borderDark text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#f6edd9] border border-amber-300 shrink-0 shadow-sm" />
                <span className="truncate">Parchment</span>
              </button>
            </div>
          </div>

          {/* Live Card Preview (Target rendered to PNG) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Image Preview
              </span>
              <span className="text-[11px] text-gray-400">
                Ready to export as PNG
              </span>
            </div>

            {/* The Actual Renderable Card Container */}
            <div className="flex justify-center p-2 sm:p-4 bg-gray-100/70 dark:bg-black/40 rounded-2xl border border-dashed border-gray-300 dark:border-brand-borderDark overflow-x-auto">
              <div
                ref={cardRef}
                className={`w-full max-w-[560px] p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${themeStyles.card}`}
                style={{ minHeight: '260px' }}
              >
                {/* Header row in image */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${themeStyles.badge}`}>
                      Surah {surahName}
                    </span>
                    <span className="text-xs font-bold opacity-80">
                      Ayah {verse.aya}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold opacity-70 tracking-widest uppercase">
                    Holy Qur'an • {surahNumber}:{verse.aya}
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right my-5 select-none" dir="rtl">
                  <p
                    className={`${
                      script === 'uthmani' ? 'quran-uthmani' : 'quran-indopak'
                    } ${themeStyles.arabic} text-2xl sm:text-3xl leading-loose font-normal`}
                  >
                    {arabicText}
                    <span
                      className={`inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 mx-2 text-xs border rounded-full font-sans select-none align-middle font-bold shrink-0 ${themeStyles.numberCircle}`}
                    >
                      {verse.aya}
                    </span>
                  </p>
                </div>

                {/* Transliteration (if selected) */}
                {contentMode === 'all' && verse.transliteration && (
                  <div
                    className={`text-xs sm:text-sm italic font-serif my-4 tracking-wide leading-relaxed border-t border-white/10 pt-3.5 ${themeStyles.translit}`}
                    dangerouslySetInnerHTML={{ __html: verse.transliteration }}
                  />
                )}

                {/* Translation (if selected) */}
                {contentMode !== 'arabic_only' && transText && (
                  <div className={`mt-4 pt-3.5 border-t border-white/10 text-sm sm:text-base leading-relaxed ${themeStyles.translation}`}>
                    <p className="font-sans italic">
                      "{transText}"
                    </p>
                    <span className={`block text-[11px] not-italic font-semibold mt-2 ${themeStyles.author}`}>
                      — {transAuthor}
                    </span>
                  </div>
                )}

                {/* Watermark Footer */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[10px] tracking-wide ${themeStyles.footer}`}>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span>📖 The Holy Qur'an</span>
                  </div>
                  <span className="opacity-80">
                    quran.zaid.im
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-brand-borderDark flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/70 dark:bg-brand-cardDark/70 shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left min-h-[1.25rem]">
            {statusMessage ? (
              <span className="text-brand-teal dark:text-emerald-400 font-semibold animate-fade-in">
                {statusMessage}
              </span>
            ) : (
              <span>High-resolution PNG image • Ready for WhatsApp, Instagram, or Stories</span>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={generating}
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl border border-gray-200 dark:border-brand-borderDark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-surfaceDark text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              title="Copy Image to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Image'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={generating}
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl border border-gray-200 dark:border-brand-borderDark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-surfaceDark text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              title="Download PNG Image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={generating}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-teal hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
