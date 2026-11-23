import React, { useState } from 'react';
import {
  X,
  Info,
  BookOpen,
  Heart,
  Sparkles,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Languages,
  GraduationCap,
  Cloud,
  Eye,
  BookmarkCheck,
  Palette,
  Volume2,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mzaid007@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-brand-borderDark transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0 bg-white/70 dark:bg-brand-surfaceDark/70 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center shrink-0 border border-brand-teal/20">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  About The Holy Qur'an
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-brand-teal/10 text-brand-teal dark:text-emerald-400 rounded-full">
                  Free &amp; Ad-Free
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-serif">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300">
          {/* Mission Hero Banner */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-brand-teal/10 via-emerald-500/5 to-teal-500/10 dark:from-brand-teal/20 dark:via-emerald-500/10 dark:to-teal-500/15 border border-brand-teal/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1">
                  Our Mission &amp; Purpose
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  A high-fidelity digital Qur'an companion built for seamless recitation, deep reflection, and interactive learning. Combining authentic classical typography with modern, distraction-free web technology, this application is crafted to serve readers, students, and Huffaz worldwide with speed, clarity, and precision.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              Core Capabilities &amp; Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <Languages className="w-4 h-4 text-brand-teal shrink-0" />
                  Authentic Calligraphy Fonts
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Support for Medina Hafs Uthmanic Script (King Fahd Complex) and classical Indo-Pak scripts (Qalam Majeed, PDMS Saleem, Al Qalam).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <Palette className="w-4 h-4 text-rose-500 shrink-0" />
                  Dynamic Tajweed Engine
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Grapheme-aware color highlights for Ghunnah, Qalqalah, Iqlāb, Madd, and Ikhfā’ that preserve true Arabic cursive joining without font bleeding.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <GraduationCap className="w-4 h-4 text-sky-500 shrink-0" />
                  Word-by-Word &amp; Letters Guide
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Inspect word-level root words, grammar morphology, individual pronunciation audio, and an interactive Arabic letters articulation guide.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <Eye className="w-4 h-4 text-amber-500 shrink-0" />
                  Hifz (Memorization) Mode
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Active recall testing with word and ayah blurring, enabling memorizers to recite first and tap to verify accuracy.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
                  Multi-Device Cloud Sync
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Seamlessly sync reading progress, last read position, and bookmarks between your phone, tablet, and computer with Conflict Guard.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-gray-50/50 dark:bg-brand-cardDark/50">
                <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm">
                  <Volume2 className="w-4 h-4 text-purple-500 shrink-0" />
                  Recitations &amp; Auto-Scroll
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  High-fidelity audio by renowned Qaris with synchronized verse tracking, auto-scroll, and speed controls.
                </p>
              </div>
            </div>
          </div>

          {/* Scholarly Sources & Attributions */}
          <div className="p-4 rounded-xl border border-gray-100 dark:border-brand-borderDark bg-white dark:bg-brand-cardDark space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-brand-teal" />
              Scholarly Sources &amp; Data Attributions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">Canonical Arabic Text</span>
                <span className="text-gray-500 dark:text-gray-400">Tanzil.net &amp; Quran.com verified canonical digital datasets.</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">Translations &amp; Exegesis</span>
                <span className="text-gray-500 dark:text-gray-400">Dr. Mustafa Khattab (The Clear Quran), Saheeh International, Tafheem-ul-Quran (Roman Urdu &amp; Urdu by Syed Abul A'la Maududi), Ibn Kathir, and Al-Jalalayn.</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">Calligraphic Typefaces</span>
                <span className="text-gray-500 dark:text-gray-400">King Fahd Glorious Quran Printing Complex (KFGQPC), Al Qalam, and PDMS Saleem typography projects.</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">Audio Recitations</span>
                <span className="text-gray-500 dark:text-gray-400">Mishary Rashid Alafasy, Mahmoud Khalil Al-Husary, Abdul Basit Abdul Samad, Abu Bakr Al-Shatri, and others via EveryAyah.</span>
              </div>
            </div>
          </div>

          {/* Privacy & Integrity Pledge */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm mb-1">
                Zero Ads, Zero User Tracking, Free Forever
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                This project is built purely for the sake of Allah (<em>Fī Sabīlillāh</em>). It contains no commercial advertisements, no behavioral trackers, and requires no paywalls. Your reading data and spiritual journey belong solely to you.
              </p>
            </div>
          </div>

          {/* Developer & Community Problem Reporting */}
          <div className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-brand-borderDark bg-gray-50 dark:bg-brand-cardDark/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/80 dark:border-brand-borderDark/60">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-teal dark:text-emerald-400">
                  Developed with care by
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  Mohammad Zaid
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-brand-surfaceDark border border-gray-200 dark:border-brand-borderDark hover:border-brand-teal dark:hover:border-emerald-400 text-gray-700 dark:text-gray-200 transition shadow-xs"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-3 space-y-2">
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-teal" />
                Report a Problem or Share Feedback
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Every effort has been made to ensure textual, phonetic, and typographic accuracy according to canonical Quranic standards. Should you encounter any bugs, rendering discrepancies, font overlap, or have suggestions for enhancement, you are warmly encouraged to report them:
              </p>
              <div className="pt-1">
                <a
                  href="mailto:mzaid007@gmail.com?subject=Holy%20Quran%20App%20Feedback%20/%20Issue%20Report"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-brand-teal dark:text-emerald-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>mzaid007@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-brand-borderDark flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-brand-surfaceDark/50">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-sans">
            Al-Qur'an al-Kareem • Version 2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
