'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/contexts/cms-context';
import {
  Pin,
  FileText,
  Home,
  Layers,
  Hammer,
  Film,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Eye,
  CheckCircle2,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export default function WPAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { inquiries, isSaving, lastSaved, refresh } = useCMS();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadInquiries = inquiries.filter((inq) => inq.status === 'unread').length;

  const navMenuItems = [
    {
      title: 'Dashboard',
      icon: Pin,
      href: '/wp-admin',
      activeMatch: (p: string) => p === '/wp-admin',
    },
    {
      title: 'Posts (Blog)',
      icon: FileText,
      href: '/wp-admin/posts',
      activeMatch: (p: string) => p.startsWith('/wp-admin/posts'),
      subItems: [
        { title: 'All Posts', href: '/wp-admin/posts' },
        { title: 'Add New Post', href: '/wp-admin/posts/new' },
      ],
    },
    {
      title: 'Listings',
      icon: Home,
      href: '/wp-admin/properties',
      activeMatch: (p: string) => p.startsWith('/wp-admin/properties'),
      subItems: [
        { title: 'All Listings', href: '/wp-admin/properties' },
        { title: 'Add New Listing', href: '/wp-admin/properties/new' },
      ],
    },
    {
      title: 'Floor Plans',
      icon: Layers,
      href: '/wp-admin/floor-plans',
      activeMatch: (p: string) => p.startsWith('/wp-admin/floor-plans'),
    },
    {
      title: 'Construction Rates',
      icon: Hammer,
      href: '/wp-admin/rates',
      activeMatch: (p: string) => p.startsWith('/wp-admin/rates'),
    },
    {
      title: 'Media & Videos',
      icon: Film,
      href: '/wp-admin/videos',
      activeMatch: (p: string) => p.startsWith('/wp-admin/videos'),
    },
    {
      title: 'Inquiries',
      icon: MessageSquare,
      href: '/wp-admin/inquiries',
      badge: unreadInquiries > 0 ? unreadInquiries : undefined,
      activeMatch: (p: string) => p.startsWith('/wp-admin/inquiries'),
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/wp-admin/settings',
      activeMatch: (p: string) => p.startsWith('/wp-admin/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased flex flex-col selection:bg-[#2271b1] selection:text-white">
      {/* 1. Classic WordPress Top Admin Bar (#1d2327) */}
      <header className="h-8 bg-[#1d2327] text-[#c3c4c7] text-[13px] flex items-center justify-between px-3 fixed top-0 left-0 right-0 z-50 select-none border-b border-[#2c3338]">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#c3c4c7] hover:text-white"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* WP Logo Icon */}
          <Link
            href="/wp-admin"
            className="flex items-center gap-1.5 text-white hover:text-[#72aee6] font-bold transition-colors"
            title="WordPress / ALH CMS"
          >
            <span className="w-5 h-5 rounded-full bg-white text-[#1d2327] flex items-center justify-center font-serif text-xs font-black">
              W
            </span>
            <span className="font-semibold text-xs tracking-tight hidden sm:inline">ALH Admin</span>
          </Link>

          {/* Visit Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 hover:text-[#72aee6] transition-colors py-1 px-1.5 rounded hover:bg-[#2c3338]"
            title="Visit Public Website (opens in new tab)"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Asad Land Holdings</span>
            <ExternalLink className="w-3 h-3 text-[#72aee6]" />
          </Link>

          {/* Inquiries quick count */}
          <Link
            href="/wp-admin/inquiries"
            className="flex items-center gap-1.5 hover:text-[#72aee6] transition-colors py-1 px-1.5 rounded hover:bg-[#2c3338]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{unreadInquiries}</span>
          </Link>

          {/* "+ New" Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNewDropdownOpen(!newDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#72aee6] transition-colors py-1 px-2 rounded hover:bg-[#2c3338]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            {newDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNewDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1 w-44 bg-[#2c3338] text-[#c3c4c7] rounded shadow-xl py-1 z-50 text-xs border border-[#3c434a]">
                  <Link
                    href="/wp-admin/posts/new"
                    onClick={() => setNewDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    📝 Post (Article)
                  </Link>
                  <Link
                    href="/wp-admin/properties/new"
                    onClick={() => setNewDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    🏡 Property Listing
                  </Link>
                  <Link
                    href="/wp-admin/floor-plans"
                    onClick={() => setNewDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    📐 Floor Plan
                  </Link>
                  <Link
                    href="/wp-admin/videos"
                    onClick={() => setNewDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    🎬 Video Walkthrough
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Admin Bar Controls */}
        <div className="flex items-center gap-3">
          {/* Sync indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#8c8f94]">
            {isSaving ? (
              <span className="flex items-center gap-1 text-[#dba617]">
                <RefreshCw className="w-3 h-3 animate-spin" /> Saving changes...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-[#00a32a]">
                <CheckCircle2 className="w-3 h-3" /> Saved ({lastSaved})
              </span>
            ) : null}
          </div>

          {/* Quick User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 hover:text-[#72aee6] py-1 px-2 rounded hover:bg-[#2c3338]"
            >
              <span>Howdy, <strong className="text-white">Admin</strong></span>
              <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-[10px] font-bold">
                A
              </div>
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-52 bg-[#2c3338] text-[#c3c4c7] rounded shadow-xl py-2 z-50 text-xs border border-[#3c434a]">
                  <div className="px-3 py-2 border-b border-[#3c434a]">
                    <p className="font-semibold text-white">Administrator</p>
                    <p className="text-[11px] text-[#8c8f94]">admin@asadlandholdings.com</p>
                  </div>
                  <Link
                    href="/wp-admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    ⚙️ Site Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white"
                  >
                    🌐 View Live Website
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-[#2271b1] hover:text-white text-[#d63638]"
                  >
                    🏢 Switch to CRM System
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Admin Workspace */}
      <div className="flex flex-1 pt-8">
        {/* Left Sidebar (#1d2327) */}
        <aside
          className={`bg-[#1d2327] text-[#c3c4c7] transition-all duration-200 z-40 flex flex-col justify-between select-none fixed md:sticky top-8 h-[calc(100vh-2rem)] border-r border-[#2c3338] ${
            collapsed ? 'w-14' : 'w-52'
          } ${mobileNavOpen ? 'left-0' : '-left-64 md:left-0'}`}
        >
          {/* Navigation Menu */}
          <nav className="py-2 overflow-y-auto flex-1">
            <ul className="space-y-0.5">
              {navMenuItems.map((item) => {
                const isActive = item.activeMatch(pathname);
                const Icon = item.icon;

                return (
                  <li key={item.title} className="relative group">
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#2271b1] text-white'
                          : 'hover:bg-[#135e96] hover:text-[#72aee6]'
                      }`}
                      title={collapsed ? item.title : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                      {!collapsed && item.badge !== undefined && (
                        <span className="bg-[#d63638] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Submenu for Desktop when expanded */}
                    {!collapsed && item.subItems && isActive && (
                      <ul className="bg-[#2c3338] py-1 border-l-2 border-[#2271b1]">
                        {item.subItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`block px-7 py-1 text-xs transition-colors ${
                                pathname === sub.href
                                  ? 'text-white font-bold'
                                  : 'text-[#c3c4c7] hover:text-[#72aee6]'
                              }`}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Collapse Toggle */}
          <div className="p-2 border-t border-[#2c3338] hidden md:block">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#c3c4c7] hover:text-white hover:bg-[#2c3338] rounded transition-colors"
              title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* 3. Main Content Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-[#f0f0f1] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
