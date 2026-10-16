'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { CommandPalette } from '../command-palette';
import { QuickAddModal } from '../quick-add-modal';
import { ToastProvider } from '../ui/toast';
import { RBACProvider } from '@/contexts/rbac-context';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isAuthPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-center p-4">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <RBACProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
          {/* Responsive Sidebar (Persistent on Desktop, Slide-over on Mobile) */}
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <Header
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              onOpenQuickAdd={() => setQuickAddOpen(true)}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
            />

            {/* Scrollable Main Content - with bottom padding on mobile for MobileBottomNav */}
            <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-8 pb-24 md:pb-8 overscroll-contain">
              {children}
            </main>

            {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
            <MobileBottomNav
              onOpenQuickAdd={() => setQuickAddOpen(true)}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
            />
          </div>

          {/* Global Modals */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
          <QuickAddModal
            isOpen={quickAddOpen}
            onClose={() => setQuickAddOpen(false)}
          />
        </div>
      </RBACProvider>
    </ToastProvider>
  );
}
