'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  CalendarCheck,
  CheckSquare,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCheck,
  BookOpen,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRBAC } from '@/contexts/rbac-context';
import { usePWA } from '@/components/pwa-provider';

export interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role, canAccessRoute } = useRBAC();
  const { isInstallable, isStandalone, promptInstall } = usePWA();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  // Unified Navigation Items
  const allNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Contacts & Leads', href: '/leads', icon: Users, badge: 'HOT' },
    { label: 'Properties & Inventory', href: '/dashboard/inventory', icon: Building2 },
    { label: 'Deals', href: '/deals', icon: TrendingUp },
    { label: 'Site Visits', href: '/site-visits', icon: CalendarCheck },
    { label: 'Agents', href: '/agents', icon: UserCheck },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Omnichannel Inbox', href: '/dashboard/inbox', icon: MessageSquare, badge: 'LIVE' },
    { label: 'AI Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen, badge: 'AI' },
    { label: 'AI Assistant', href: '/ai-assistant', icon: Sparkles, highlight: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Dynamically filter navigation items based on user's granted permissions
  const navItems = allNavItems.filter((item) => canAccessRoute(item.href));

  // Render navigation item helper
  const renderNavLinks = (isMobile = false) => {
    return (
      <div className={cn('space-y-0.5', isMobile ? 'p-3 space-y-1' : 'p-2 flex-1 overflow-y-auto')}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isMobile && onMobileClose) onMobileClose();
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all group relative select-none',
                isMobile ? 'px-3.5 py-2.5 text-xs font-semibold' : 'px-3 py-2 text-xs font-medium',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                item.highlight && !isActive && 'text-purple-600 dark:text-purple-400 font-semibold'
              )}
            >
              <Icon
                className={cn(
                  'shrink-0 transition-colors',
                  isMobile ? 'w-5 h-5' : 'w-4 h-4',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : item.highlight
                    ? 'text-purple-500'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />

              {(!collapsed || isMobile) && <span className="truncate flex-1">{item.label}</span>}

              {(!collapsed || isMobile) && item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white leading-none">
                  {item.badge}
                </span>
              )}

              {collapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE SLIDE-OVER NAVIGATION DRAWER */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onMobileClose}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-[82vw] max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
              {/* Mobile Drawer Header */}
              <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src="/icons/icon-96x96.png"
                    alt="ALH CRM Logo"
                    className="w-9 h-9 rounded-xl bg-white p-1 object-contain shadow-md shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                      ASAD LAND
                    </span>
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-widest uppercase mt-0.5">
                      HOLDINGS CRM
                    </span>
                  </div>
                </div>

                <button
                  onClick={onMobileClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Links */}
              {/* Mobile Install App Button */}
              {isInstallable && !isStandalone && (
                <div className="px-3 pb-2">
                  <button
                    onClick={promptInstall}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install ALH CRM App</span>
                  </button>
                </div>
              )}

              {/* Mobile User Role Footer */}
              <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate capitalize">
                      {role ? role.toLowerCase().replace(/_/g, ' ') : 'Signed In'}
                    </span>
                    <span className="text-[10px] text-slate-400">Wah Cantt &amp; Islamabad</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💻 DESKTOP PERSISTENT SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          'hidden md:flex relative flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 transition-all duration-300 z-30 select-none shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/icons/icon-96x96.png"
              alt="ALH CRM Logo"
              className="w-9 h-9 rounded-xl bg-white p-1 object-contain shadow-md shrink-0 border border-slate-200 dark:border-slate-800"
            />
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  ASAD LAND
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-widest uppercase mt-0.5">
                  HOLDINGS CRM
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        {renderNavLinks(false)}

        {/* Desktop Install App Button */}
        {isInstallable && !isStandalone && (
          <div className="px-2 pb-1">
            <button
              onClick={promptInstall}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/25 text-xs font-semibold transition-all",
                collapsed && "justify-center p-2.5"
              )}
              title="Install ALH CRM App"
            >
              <Download className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Install App</span>}
            </button>
          </div>
        )}

        {/* User Role Footer */}
        {!collapsed && (
          <div className="p-3 m-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate capitalize">
                {role ? role.toLowerCase().replace(/_/g, ' ') : 'Loading...'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded shrink-0">
              v1.0
            </span>
          </div>
        )}
      </aside>
    </>
  );
}
