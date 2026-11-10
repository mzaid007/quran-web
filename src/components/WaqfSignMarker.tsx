import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTouchTimeRef = useRef<number>(0);

  const [coords, setCoords] = useState<{
    left: number;
    top: number;
    width: number;
    arrowLeft: number;
    isPlacementBelow: boolean;
  } | null>(null);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const closePopover = useCallback(
    (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      clearHoverTimeout();
      setIsOpenMobile(false);
      setIsHoveredDesktop(false);
    },
    [clearHoverTimeout]
  );

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const sRect = containerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;

    // On narrow mobile devices, clamp width with comfortable 12px margins
    const width = Math.min(280, vw - 24);
    const symbolCenterX = sRect.left + sRect.width / 2;

    // Horizontal positioning: center card on the symbol, clamped strictly between [12px, vw - width - 12px]
    const idealLeft = symbolCenterX - width / 2;
    const left = Math.max(12, Math.min(idealLeft, vw - width - 12));

    // Arrow points directly at symbol, clamped safely inside card's border radius
    const idealArrowLeft = symbolCenterX - left;
    const arrowLeft = Math.max(16, Math.min(idealArrowLeft, width - 16));

    // Vertical positioning: check available space above and below to prevent vertical screen bleeding
    const vh = window.innerHeight;
    const estimatedHeight = 160;
    const canFitAbove = sRect.top - estimatedHeight >= 12;
    const canFitBelow = sRect.bottom + estimatedHeight <= vh - 12;

    let isPlacementBelow = false;
    let top = 0;

    if (!canFitAbove && canFitBelow) {
      isPlacementBelow = true;
      top = sRect.bottom + 8;
    } else if (canFitAbove) {
      isPlacementBelow = false;
      top = sRect.top - 8;
    } else {
      // Fallback for tight viewports: clamp within visible screen
      isPlacementBelow = false;
      top = Math.max(estimatedHeight + 12, Math.min(sRect.top - 8, vh - 12));
    }

    setCoords({ left, top, width, arrowLeft, isPlacementBelow });
  }, []);

  const isVisible = isHoveredDesktop || isOpenMobile;

  // Handle position tracking and scroll / resize dismissal
  useEffect(() => {
    if (!isVisible) return;
    updatePosition();

    const handleScrollOrResize = () => {
      if (isOpenMobile) {
        setIsOpenMobile(false);
      } else {
        updatePosition();
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible, isOpenMobile, updatePosition]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearHoverTimeout();
  }, [clearHoverTimeout]);

  if (!sign) {
    return <span>{char}</span>;
  }

  // Only treat real mouse pointers as hover; ignore simulated mouse events from touch taps
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (Date.now() - lastTouchTimeRef.current < 800) return;
    clearHoverTimeout();
    setIsHoveredDesktop(true);
    updatePosition();
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveredDesktop(false);
    }, 120);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenMobile((prev) => {
      const next = !prev;
      if (!next) {
        setIsHoveredDesktop(false);
      }
      return next;
    });
    updatePosition();
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center justify-center mx-1 p-0.5 -my-0.5 group cursor-pointer select-none align-middle"
      onTouchStart={() => {
        lastTouchTimeRef.current = Date.now();
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      title={`${sign.nameTranslit} (${sign.displaySymbol}): ${sign.actionBadge}`}
      aria-label={`${sign.nameTranslit}: ${sign.actionBadge}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpenMobile((prev) => !prev);
          updatePosition();
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

      {/* Floating Micro-Popover / Tooltip (Portal-rendered, clamped to viewport) */}
      {isVisible && coords && typeof document !== 'undefined' && createPortal(
        <>
          {/* Mobile backdrop for immediate single-tap outside dismissal */}
          {isOpenMobile && (
            <div
              className="fixed inset-0 z-40 bg-black/5 cursor-pointer"
              role="button"
              tabIndex={-1}
              aria-label="Close hint"
              onClick={closePopover}
              onPointerEnter={(e) => e.stopPropagation()}
            />
          )}

          {/* Floating Popover Box */}
          <div
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
            onPointerEnter={(e) => {
              e.stopPropagation();
              if (e.pointerType === 'mouse') {
                clearHoverTimeout();
              }
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              if (e.pointerType === 'mouse') {
                clearHoverTimeout();
                hoverTimeoutRef.current = setTimeout(() => {
                  setIsHoveredDesktop(false);
                }, 120);
              }
            }}
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              width: `${coords.width}px`,
              transform: coords.isPlacementBelow ? 'none' : 'translateY(-100%)',
              zIndex: 50,
            }}
            className="p-3.5 rounded-2xl bg-white dark:bg-brand-surfaceDark text-gray-800 dark:text-gray-100 shadow-2xl border border-gray-200 dark:border-brand-borderDark text-left font-sans text-xs transition-opacity duration-150 animate-in fade-in"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between gap-1.5 pb-2 border-b border-gray-100 dark:border-brand-borderDark">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-serif text-lg font-bold text-brand-teal dark:text-emerald-400 leading-none">
                  {sign.displaySymbol}
                </span>
                <div className="min-w-0">
                  <span className="block font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
                    {sign.nameTranslit}
                  </span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-serif leading-none mt-0.5 truncate">
                    {sign.nameArabic}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border whitespace-nowrap ${sign.badgeClasses.bg} ${sign.badgeClasses.text} ${sign.badgeClasses.border}`}
                >
                  {sign.actionBadge}
                </span>
                {/* Close button for touch devices */}
                {isOpenMobile && (
                  <button
                    type="button"
                    onClick={closePopover}
                    className="p-1.5 -m-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
                    title="Close"
                    aria-label="Close hint"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Rule Description */}
            <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
              {sign.ruleDescription}
            </p>

            {/* Link to Full Reference Modal */}
            {onOpenModal && (
              <button
                type="button"
                onClick={(e) => {
                  closePopover(e);
                  onOpenModal();
                }}
                className="mt-2.5 pt-2 border-t border-gray-100 dark:border-brand-borderDark/60 w-full flex items-center justify-between text-[10px] font-semibold text-brand-teal dark:text-emerald-400 hover:opacity-80 transition group/btn"
              >
                <span>View all stop signs & guide</span>
                <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Pointer caret arrow pointing directly to the symbol */}
            <span
              style={{
                left: `${coords.arrowLeft}px`,
              }}
              className={`absolute -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-brand-surfaceDark border-gray-200 dark:border-brand-borderDark rotate-45 ${
                coords.isPlacementBelow
                  ? 'bottom-full -mb-1.5 border-l border-t'
                  : 'top-full -mt-1.5 border-r border-b'
              }`}
              aria-hidden="true"
            />
          </div>
        </>,
        document.body
      )}
    </span>
  );
};
