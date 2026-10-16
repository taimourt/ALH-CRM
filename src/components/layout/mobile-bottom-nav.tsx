'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Plus,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileBottomNavProps {
  onOpenQuickAdd: () => void;
  onOpenMobileMenu: () => void;
}

export function MobileBottomNav({
  onOpenQuickAdd,
  onOpenMobileMenu,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === '/dashboard';
  const isLeadsActive = pathname.startsWith('/leads');
  const isInventoryActive = pathname.startsWith('/dashboard/inventory');

  // If on a secondary route like /deals, /tasks, /settings, /ai-assistant, highlight the menu tab
  const isOtherActive =
    !isDashboardActive && !isLeadsActive && !isInventoryActive && pathname !== '/login';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="h-16 px-3 flex items-center justify-around max-w-lg mx-auto relative">
        {/* 1. Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-xl transition-all select-none active:scale-95',
            isDashboardActive
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          )}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isDashboardActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </Link>

        {/* 2. Leads */}
        <Link
          href="/leads"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-xl transition-all select-none active:scale-95',
            isLeadsActive
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          )}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {isLeadsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Leads</span>
        </Link>

        {/* 3. Floating Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          aria-label="Quick Add Lead or Site Visit"
          className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-90 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Inventory */}
        <Link
          href="/dashboard/inventory"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-xl transition-all select-none active:scale-95',
            isInventoryActive
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          )}
        >
          <div className="relative">
            <Building2 className="w-5 h-5" />
            {isInventoryActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Inventory</span>
        </Link>

        {/* 5. More Menu */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-xl transition-all select-none active:scale-95',
            isOtherActive
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          )}
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {isOtherActive && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}
