'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { NotificationsPopover } from './notifications-popover';
import { UserProfileMenu } from '../ui/user-profile-menu';

export interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
}

export function Header({ onOpenCommandPalette, onOpenQuickAdd }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

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
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left Area: Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <Breadcrumbs className="hidden sm:flex" />
      </div>

      {/* Right Area: Search, Quick Add, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-40 sm:w-64 text-left"
          title="Search (Cmd + K)"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 flex-1 truncate">
            Search phone, plot #...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 dark:bg-slate-800 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <Button onClick={onOpenQuickAdd} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
