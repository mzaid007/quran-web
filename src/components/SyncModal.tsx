import React, { useState } from 'react';
import { X, Cloud, Check, RefreshCw, LogOut, Mail, Smartphone, ShieldCheck } from 'lucide-react';
import type { LastRead } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncEmail: string | null;
  onConnectEmail: (email: string) => Promise<void>;
  onSyncNow: () => Promise<void>;
  onDisconnect: () => void;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  lastRead: LastRead | null;
  bookmarksCount: number;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  syncEmail,
  onConnectEmail,
  onSyncNow,
  onDisconnect,
  isSyncing,
  lastSyncedAt,
  lastRead,
  bookmarksCount,
}) => {
  const [inputEmail, setInputEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleaned = inputEmail.trim().toLowerCase();
    if (!cleaned || !cleaned.includes('@') || !cleaned.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      await onConnectEmail(cleaned);
      setInputEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-surfaceDark w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-brand-borderDark overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brand-teal dark:text-emerald-400">
            <Cloud className="w-5 h-5 flex-shrink-0" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Multi-Device Cloud Sync
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-cardDark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {syncEmail ? (
            /* Connected View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-500/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    <Check className="w-4 h-4" />
                    <span>Connected with Neon DB</span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100 mt-1">
                    {syncEmail}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {lastSyncedAt
                      ? `Last synced: ${lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                      : 'Syncing automatically in background...'}
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
              </div>

              {/* Status summary */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-brand-cardDark border border-gray-100 dark:border-brand-borderDark">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Current Progress</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                    {lastRead ? `Surah ${lastRead.surah}:${lastRead.aya}` : 'None'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-brand-cardDark border border-gray-100 dark:border-brand-borderDark">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Bookmarks Synced</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                    {bookmarksCount} saved
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={onSyncNow}
                  disabled={isSyncing}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing with Neon...' : 'Sync Now'}</span>
                </button>

                <button
                  onClick={onDisconnect}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-brand-borderDark hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Device</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Connected: Email Prompt */
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Read seamlessly across any device
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Start reading on your phone and continue right where you left off on your laptop or tablet.
                </p>
              </div>

              <form onSubmit={handleConnect} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. reader@example.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-brand-cardDark border border-gray-200 dark:border-brand-borderDark rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errorMsg}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-50 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Connecting...' : 'Connect & Sync Progress'}</span>
                </button>
              </form>

              <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-brand-cardDark/80 border border-gray-100 dark:border-brand-borderDark flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First:</strong> Only your email address is used to associate your reading progress, bookmarks, and font settings in Neon DB. No passwords or tracking.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
