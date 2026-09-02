'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  TrendingUp,
  CalendarCheck,
  CheckSquare,
  MessageSquare,
  FileText,
  CreditCard,
  Percent,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Megaphone,
  BarChart3,
  Settings,
  UserCheck,
  FolderArchive,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRBAC } from '@/contexts/rbac-context';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role, canAccessRoute, loading } = useRBAC();

  // Unified Navigation Items (Merged Contacts & Properties Hubs)
  const allNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Contacts & Leads', href: '/leads', icon: Users, badge: 'HOT' },
    { label: 'Properties & Inventory', href: '/properties', icon: Building2 },
    { label: 'Deals', href: '/deals', icon: TrendingUp },
    { label: 'Site Visits', href: '/site-visits', icon: CalendarCheck },
    { label: 'Agents', href: '/agents', icon: UserCheck },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Communications', href: '/communications', icon: MessageSquare },
    { label: 'Documents', href: '/documents', icon: FolderArchive },
    { label: 'Payments', href: '/payments', icon: CreditCard },
    { label: 'Commissions', href: '/commissions', icon: Percent },
    { label: 'Marketing', href: '/marketing', icon: Megaphone },
    { label: 'API & Integrations', href: '/settings/integrations', icon: Share2, badge: 'NEW' },
    { label: 'Reports', href: '/analytics', icon: BarChart3 },
    { label: 'AI Assistant', href: '/ai-assistant', icon: Sparkles, highlight: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Dynamically filter navigation items based on user's granted permissions
  const navItems = allNavItems.filter((item) => canAccessRoute(item.href));

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 transition-all duration-300 z-30 select-none shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
            ALH
          </div>
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
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                item.highlight && !isActive && 'text-purple-600 dark:text-purple-400 font-semibold'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : item.highlight
                    ? 'text-purple-500'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />

              {!collapsed && <span className="truncate flex-1">{item.label}</span>}

              {!collapsed && item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white leading-none">
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

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
  );
}
