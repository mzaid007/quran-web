import React, { useState, useRef, useEffect } from 'react';
import { getWaqfSignByChar } from '../data/waqfSigns';
import { X, ExternalLink } from 'lucide-react';

interface WaqfSignMarkerProps {
  char: string;
  onOpenModal?: () => void;
}

export const WaqfSignMarker: React.FC<WaqfSignMarkerProps> = ({ char, onOpenModal }) => {
  const sign = getWaqfSignByChar(char);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isHoveredDesktop, setIsHoveredDesktop] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close mobile popover when clicking anywhere outside
  useEffect(() => {
    if (!isOpenMobile) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenMobile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpenMobile]);

  if (!sign) {
    // Fallback if character not in dictionary
    return <span>{char}</span>;
  }

  const isVisible = isHoveredDesktop || isOpenMobile;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenMobile((prev) => !prev);
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center justify-center mx-1 p-0.5 -my-0.5 group cursor-pointer select-none align-middle"
      onMouseEnter={() => setIsHoveredDesktop(true)}
      onMouseLeave={() => setIsHoveredDesktop(false)}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      title={`${sign.nameTranslit} (${sign.displaySymbol}): ${sign.actionBadge}`}
      aria-label={`${sign.nameTranslit}: ${sign.actionBadge}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpenMobile((prev) => !prev);
        }
      }}
    >
      {/* The Waqf Glyph with subtle interactive cue */}
      <span
        className={`px-1 py-0.5 rounded-md transition-all duration-150 inline-block text-center leading-none ${
          isVisible
            ? 'text-brand-teal dark:text-emerald-400 bg-brand-teal/20 dark:bg-brand-teal/30 ring-1 ring-brand-teal/50 scale-110 font-bold'
            : 'text-brand-teal dark:text-emerald-400 hover:text-brand-tealDark dark:hover:text-emerald-300 hover:bg-brand-teal/10'
        }`}
      >
        {char}
      </span>

      {/* Floating Micro-Popover / Tooltip */}
      {isVisible && (
        <span
          dir="ltr"
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 max-w-[85vw] p-3 rounded-xl bg-white dark:bg-brand-surfaceDark text-gray-800 dark:text-gray-100 shadow-xl border border-gray-200 dark:border-brand-borderDark text-left font-sans text-xs transition-all duration-150 animate-in fade-in zoom-in-95"
        >
          {/* Header Row */}
          <span className="flex items-start justify-between gap-1 pb-1.5 border-b border-gray-100 dark:border-brand-borderDark">
            <span className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-brand-teal dark:text-emerald-400">
                {sign.displaySymbol}
              </span>
              <span>
                <span className="block font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {sign.nameTranslit}
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-serif leading-none">
                  {sign.nameArabic}
                </span>
              </span>
            </span>

            <span className="flex items-center gap-1 shrink-0">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${sign.badgeClasses.bg} ${sign.badgeClasses.text} ${sign.badgeClasses.border}`}
              >
                {sign.actionBadge}
              </span>
              {/* Close button for touch devices */}
              {isOpenMobile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpenMobile(false);
                  }}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          </span>

          {/* Rule Description */}
          <span className="block text-[11px] text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            {sign.ruleDescription}
          </span>

          {/* Link to Full Reference Modal */}
          {onOpenModal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenMobile(false);
                setIsHoveredDesktop(false);
                onOpenModal();
              }}
              className="mt-2.5 pt-1.5 border-t border-gray-100 dark:border-brand-borderDark/60 w-full flex items-center justify-between text-[10px] font-semibold text-brand-teal dark:text-emerald-400 hover:opacity-80 transition group/btn"
            >
              <span>View all stop signs & guide</span>
              <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Pointer caret arrow pointing down */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-white dark:bg-brand-surfaceDark border-r border-b border-gray-200 dark:border-brand-borderDark rotate-45"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
};
