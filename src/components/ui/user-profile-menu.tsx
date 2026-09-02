'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';

export function UserProfileMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar?: string;
  }>({
    name: 'Staff User',
    email: '',
    role: 'SALES_AGENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial state from localStorage for fast render
    const storedName = localStorage.getItem('user_name');
    const storedEmail = localStorage.getItem('user_email');
    const storedRole = localStorage.getItem('user_role');
    const storedAvatar = localStorage.getItem('user_avatar');

    if (storedName || storedRole) {
      setUser((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
        role: storedRole || prev.role,
        avatar: storedAvatar || prev.avatar,
      }));
    }

    // 2. Fetch fresh user info from /api/auth/me
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          });
          localStorage.setItem('user_name', data.user.name);
          localStorage.setItem('user_email', data.user.email);
          localStorage.setItem('user_role', data.user.role);
          if (data.user.avatar) localStorage.setItem('user_avatar', data.user.avatar);
        }
      })
      .catch(() => {});

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}

    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_avatar');

    router.push('/login');
    router.refresh();
  };

  const formattedRole = user.role.replace('_', ' ');

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <img
          src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
        />
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
            {formattedRole.toLowerCase()}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in zoom-in-95 duration-150 p-1.5 space-y-1">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{user.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
            <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="w-3 h-3" /> {formattedRole}
            </div>
          </div>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <User className="w-4 h-4 text-slate-400" /> My Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" /> Account Settings
          </Link>

          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium text-left"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
