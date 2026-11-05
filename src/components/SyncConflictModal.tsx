import React, { useState } from 'react';
import { AlertTriangle, Cloud, Smartphone, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import type { SyncConflict } from '../types';

interface SyncConflictModalProps {
  conflict: SyncConflict | null;
  onClose: () => void;
  onResumeFromCloud: () => void;
  onOverrideCloud: () => void;
}

export const SyncConflictModal: React.FC<SyncConflictModalProps> = ({
  conflict,
  onClose,
  onResumeFromCloud,
  onOverrideCloud,
}) => {
  const [showConfirmOverride, setShowConfirmOverride] = useState(false);

  if (!conflict) return null;

  const { cloud, local } = conflict;

  const formatDate = (dateStr?: string | number) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-brand-borderDark overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Cloud Sync Conflict Detected
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-sm">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
            Another device associated with <strong className="text-gray-900 dark:text-gray-100">{cloud.email}</strong> has a different reading save. Choose how you would like to proceed:
          </p>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Cloud Version */}
            <div className="p-3.5 rounded-xl border-2 border-brand-teal/40 bg-brand-teal/[0.04] dark:bg-brand-teal/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-brand-teal dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Cloud Save</span>
                </div>
                <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                  {cloud.lastRead ? `Surah ${cloud.lastRead.surahName}` : 'No Reading Save'}
                </div>
                <div className="text-xs text-brand-teal dark:text-emerald-400 font-semibold mt-0.5">
                  {cloud.lastRead ? `Ayah ${cloud.lastRead.surah}:${cloud.lastRead.aya}` : '—'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-brand-teal/20 text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>Bookmarks: <strong>{cloud.bookmarks.length}</strong></div>
                <div>Updated: {formatDate(cloud.updatedAt)}</div>
              </div>
            </div>

            {/* Local Device Version */}
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-brand-borderDark bg-gray-50/70 dark:bg-brand-cardDark/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>This Device</span>
                </div>
                <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                  {local.lastRead ? `Surah ${local.lastRead.surahName}` : 'No Reading Save'}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-0.5">
                  {local.lastRead ? `Ayah ${local.lastRead.surah}:${local.lastRead.aya}` : '—'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-brand-borderDark text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>Bookmarks: <strong>{local.bookmarks.length}</strong></div>
                <div>Updated: {formatDate(local.lastRead?.timestamp)}</div>
              </div>
            </div>
          </div>

          {/* Guard Confirmation Warning (shown if user wants to override) */}
          {showConfirmOverride ? (
            <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-red-700 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Override Guard Warning</span>
              </div>
              <p className="text-xs leading-relaxed">
                Overriding will permanently overwrite your cloud save across <strong>all your other devices</strong> with this device's progress (Surah {local.lastRead?.surah}:{local.lastRead?.aya}). Are you sure?
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onOverrideCloud}
                  className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
                >
                  Yes, Override Cloud Save
                </button>
                <button
                  onClick={() => setShowConfirmOverride(false)}
                  className="py-2 px-3 rounded-lg bg-gray-200 dark:bg-brand-cardDark text-gray-700 dark:text-gray-200 font-semibold text-xs transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Action Choices */
            <div className="space-y-2 pt-2">
              {/* Option 1: Resume from Cloud */}
              <button
                onClick={onResumeFromCloud}
                className="w-full p-3 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold text-left transition flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Check className="w-4 h-4" />
                    <span>Resume from Cloud (Recommended)</span>
                  </div>
                  <div className="text-[11px] text-white/80 font-normal mt-0.5">
                    Load cloud reading progress ({cloud.lastRead?.surah}:{cloud.lastRead?.aya}) onto this device
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </button>

              {/* Option 2: Override Cloud */}
              <button
                onClick={() => setShowConfirmOverride(true)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-brand-borderDark hover:border-red-400 dark:hover:border-red-800 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-left transition text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold">Override Cloud with this Device</span>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Replace your cloud save with this device's current progress
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-gray-100 dark:bg-brand-cardDark rounded">
                  Guard
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
