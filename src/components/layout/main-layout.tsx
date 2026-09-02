'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from '../command-palette';
import { QuickAddModal } from '../quick-add-modal';
import { ToastProvider } from '../ui/toast';
import { RBACProvider } from '@/contexts/rbac-context';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isAuthPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-center">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <RBACProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
          {/* Sidebar */}
          <Sidebar />

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              onOpenQuickAdd={() => setQuickAddOpen(true)}
            />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {children}
            </main>
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
