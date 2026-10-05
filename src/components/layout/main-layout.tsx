'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header as CRMHeader } from './header';
import { CommandPalette } from '../command-palette';
import { QuickAddModal } from '../quick-add-modal';
import { ToastProvider } from '../ui/toast';
import { RBACProvider } from '@/contexts/rbac-context';
import { CurrencyProvider } from '@/contexts/currency-context';
import { CMSProvider } from '@/contexts/cms-context';
import { Header } from '../website/Header';
import { Footer } from '../website/Footer';
import { MobileBottomCTA } from '../website/MobileBottomCTA';
import { AIChatWidget } from '../website/AIChatWidget';

import { CompareProvider } from '@/lib/compare-context';
import { CompareDrawer } from '../website/CompareDrawer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // WordPress standalone admin portal
  const isWPAdminPage = pathname.startsWith('/wp-admin');

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isDashboardPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/agents') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/deals') ||
    pathname.startsWith('/customers') ||
    pathname.startsWith('/site-visits') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/communications') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/commissions') ||
    pathname.startsWith('/marketing') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/ai-assistant') ||
    pathname.startsWith('/profile');

  // 0. Render WP-Admin standalone portal
  if (isWPAdminPage) {
    return (
      <ToastProvider>
        <CMSProvider>
          {children}
        </CMSProvider>
      </ToastProvider>
    );
  }

  // 1. Render Auth pages
  if (isAuthPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen w-screen bg-[#000000] text-[#FEFEFE] flex flex-col justify-center">
          {children}
        </div>
      </ToastProvider>
    );
  }

  // 2. Render CRM / Dashboard pages with Sidebar & CRM Header
  if (isDashboardPage) {
    return (
      <ToastProvider>
        <RBACProvider>
          <CurrencyProvider>
            <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
              {/* Sidebar */}
              <Sidebar />

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <CRMHeader
                  onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                  onOpenQuickAdd={() => setQuickAddOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                  {children}
                </main>
              </div>

              {/* Global CRM Modals */}
              <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
              />
              <QuickAddModal
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
              />
            </div>
          </CurrencyProvider>
        </RBACProvider>
      </ToastProvider>
    );
  }

  // 3. Render Public Website pages with CMS Provider, Currency Provider, Compare Provider, Header, Footer, and Mobile CTA
  return (
    <ToastProvider>
      <CMSProvider>
        <CurrencyProvider>
          <CompareProvider>
            <div className="min-h-screen flex flex-col bg-[#FEFEFE] text-[#000000] font-sans antialiased selection:bg-[#000000] selection:text-[#FEFEFE]">
              <Header />
              <main className="flex-1 pt-24 pb-16">
                {children}
              </main>
              <Footer />
              <CompareDrawer />
              <MobileBottomCTA />
              <AIChatWidget />
            </div>
          </CompareProvider>
        </CurrencyProvider>
      </CMSProvider>
    </ToastProvider>
  );
}
