'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, Menu, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { NotificationsPopover } from './notifications-popover';
import { UserProfileMenu } from '../ui/user-profile-menu';
import { usePWA } from '../pwa-provider';

export interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
  onOpenMobileMenu?: () => void;
}

export function Header({
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenMobileMenu,
}: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const { isInstallable, isStandalone, promptInstall } = usePWA();

  useEffect(() => {
    // Check initial dark mode state
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left Area: Mobile Menu Trigger + Mobile Brand + Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Tag */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-700 to-emerald-500 text-white flex items-center justify-center font-black text-[10px] shadow-xs">
            ALH
          </div>
          <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100">
            CRM
          </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center gap-4 min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Area: Search, Quick Add, Theme, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Search Trigger: Mobile Icon Button */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Search"
          aria-label="Open command palette search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Search Trigger: Desktop Input Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-44 lg:w-64 text-left"
          title="Search (Cmd + K)"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 flex-1 truncate">
            Search phone, plot #...
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 dark:bg-slate-800 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <Button
          onClick={onOpenQuickAdd}
          size="sm"
          className="px-2.5 sm:px-3 gap-1.5 bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>

        {/* PWA Install Button */}
        {isInstallable && !isStandalone && (
          <Button
            onClick={promptInstall}
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex px-2.5 sm:px-3 gap-1.5 border-brand-500/40 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-xs font-semibold shadow-xs"
            title="Install ALH CRM App to your device"
          >
            <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Install App</span>
          </Button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <NotificationsPopover />

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* User Profile Menu */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
