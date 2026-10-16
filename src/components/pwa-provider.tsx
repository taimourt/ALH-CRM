'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { Download, WifiOff, Wifi, X, Share, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  isOffline: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isStandalone: false,
  isOffline: false,
  isIOS: false,
  promptInstall: async () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }

    // 2. Check if already running as standalone PWA
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(isRunningStandalone);

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // 4. Capture BeforeInstallPrompt (Chrome, Edge, Android, Opera)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user previously dismissed banner recently
      const dismissedUntil = localStorage.getItem('alh_pwa_dismissed_until');
      if (!dismissedUntil || Date.now() > parseInt(dismissedUntil, 10)) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Track App Installed Event
    const handleAppInstalled = () => {
      console.log('[PWA] App successfully installed!');
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      localStorage.setItem('alh_pwa_installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. Online / Offline Network Monitoring
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowInstallBanner(true);
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User choice outcome:', outcome);

    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsStandalone(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Dismiss for 7 days
    localStorage.setItem('alh_pwa_dismissed_until', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  };

  const value: PWAContextType = {
    isInstallable: !!deferredPrompt || (isIOS && !isStandalone),
    isStandalone,
    isOffline,
    isIOS,
    promptInstall,
  };

  return (
    <PWAContext.Provider value={value}>
      {/* 🔴 OFFLINE NETWORK STATUS ALERT PILL */}
      {isOffline && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/95 text-slate-950 font-bold text-xs shadow-xl backdrop-blur-md animate-bounce border border-amber-300">
          <WifiOff className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          <span>Offline Mode Active — Viewing cached data</span>
        </div>
      )}

      {/* 🟢 RECONNECTED NOTIFICATION */}
      {justReconnected && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/95 text-white font-bold text-xs shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300 border border-emerald-400">
          <Wifi className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          <span>Connection Restored — Synced</span>
        </div>
      )}

      {/* 🚀 PWA INSTALL FLOATING BANNER */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-20 md:bottom-6 right-3 md:right-6 left-3 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 border border-brand-500/30 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Subtle brand ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <img
                src="/icons/icon-192x192.png"
                alt="ALH CRM"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/30 shrink-0 shadow-md"
              />

              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100">
                  <span>Install ALH CRM App</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold uppercase">
                    PWA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                  Add to your home screen for ultra-fast offline access, plot inventory, and deal pipeline.
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={promptInstall}
                    className="h-8 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-1.5 shadow-lg shadow-brand-900/40"
                  >
                    <Download className="w-3.5 h-3.5" /> Install App
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="h-8 text-xs text-slate-400 hover:text-white"
                  >
                    Not now
                  </Button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute top-0 right-0 p-1 text-slate-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 IOS SAFARI INSTRUCTIONS BANNER (Shown once on iOS Safari if not standalone) */}
      {isIOS && !isStandalone && showInstallBanner && (
        <div className="fixed bottom-20 md:bottom-6 right-3 md:right-6 left-3 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-xl relative">
            <div className="flex items-start gap-3">
              <img
                src="/icons/icon-192x192.png"
                alt="ALH CRM"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/30 shrink-0"
              />
              <div className="flex-1 text-xs space-y-1 pr-4">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <span>Install on iPhone / iPad</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Tap the <Share className="w-3.5 h-3.5 inline text-brand-400 mx-0.5" /> Share button in Safari, then select <strong>'Add to Home Screen'</strong> to install the full native app.
                </p>
              </div>
              <button onClick={handleDismiss} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </PWAContext.Provider>
  );
}
