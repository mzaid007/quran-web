import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    if (sessionStorage.getItem('quran_pwa_dismissed')) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('quran_pwa_dismissed', 'true');
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 dark:bg-brand-surfaceDark/95 backdrop-blur-md border border-brand-teal/30 dark:border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-fade-in ring-1 ring-brand-teal/20">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-teal/15 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 text-brand-teal dark:text-emerald-400">
          <Download className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            <span>Install Al-Qur'an</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-brand-teal/20 text-brand-teal dark:text-emerald-300">
              Offline
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            Fast, works without internet connection
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-tealDark dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
