'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Zap,
  Calendar,
  Phone,
  DollarSign,
  ClipboardList,
  ExternalLink,
  Volume2,
  VolumeX,
  RefreshCw,
  X,
  Building2,
  Briefcase,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

// Function to play soft modern chime using Web Audio API
function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext may not be allowed before user interaction
  }
}

// Helper to format timestamp into human relative string
function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(diffMs) || diffMs < 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function NotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevUnreadCountRef = useRef(-1);
  const isFirstLoadRef = useRef(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        const list: NotificationItem[] = data.notifications || [];
        const count = data.unreadCount !== undefined ? data.unreadCount : list.filter((n) => !n.read).length;

        // Only play chime on background polling if new unread notification arrived after initial load
        if (!isFirstLoadRef.current && prevUnreadCountRef.current >= 0 && count > prevUnreadCountRef.current && soundEnabled) {
          playChime();
        }

        if (isFirstLoadRef.current) {
          isFirstLoadRef.current = false;
        }

        prevUnreadCountRef.current = count;
        setNotifications(list);
        setUnreadCount(count);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      if (isManualRefresh) setIsRefreshing(false);
    }
  }, [soundEnabled]);

  // Initial fetch and auto-polling every 20 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Mark all as read
  const markAllRead = async () => {
    try {
      // Optimistic UI update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      prevUnreadCountRef.current = 0;

      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (err) {
      console.error('Mark all read error:', err);
      fetchNotifications();
    }
  };

  // Mark single item as read
  const markSingleRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (err) {
      console.error('Mark single read error:', err);
    }
  };

  // Delete single notification
  const deleteNotification = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Delete notification error:', err);
      fetchNotifications();
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      prevUnreadCountRef.current = 0;

      await fetch('/api/notifications?all=true', {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Clear all error:', err);
      fetchNotifications();
    }
  };

  // Handle clicking on notification item
  const handleItemClick = async (n: NotificationItem) => {
    if (!n.read) {
      await markSingleRead(n.id);
    }
    setIsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  // Filtered notifications
  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  // Get icon by notification type
  const getTypeIcon = (type: string) => {
    const upper = (type || '').toUpperCase();
    if (upper.includes('LEAD')) {
      return (
        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm ring-1 ring-blue-500/20">
          <Phone className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('DEAL')) {
      return (
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm ring-1 ring-emerald-500/20">
          <Briefcase className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('VISIT')) {
      return (
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm ring-1 ring-indigo-500/20">
          <Calendar className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('PAYMENT')) {
      return (
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm ring-1 ring-emerald-500/20">
          <DollarSign className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('TASK')) {
      return (
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shrink-0 shadow-sm ring-1 ring-amber-500/20">
          <ClipboardList className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('COMMUNICATION') || upper.includes('WHATSAPP') || upper.includes('CALL')) {
      return (
        <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 shrink-0 shadow-sm ring-1 ring-teal-500/20">
          <MessageSquare className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('PROPERTY')) {
      return (
        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shrink-0 shadow-sm ring-1 ring-rose-500/20">
          <Building2 className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes('USER') || upper.includes('STAFF')) {
      return (
        <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm ring-1 ring-cyan-500/20">
          <Users className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 shrink-0 shadow-sm ring-1 ring-purple-500/20">
        <Zap className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className={cn(
          'relative p-2 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          isOpen
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 ring-1 ring-brand-500/30'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
        )}
        title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'Notifications'}
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />

        {/* Badge Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-md ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-84 sm:w-[410px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Header Action Tools */}
              <div className="flex items-center gap-1">
                {/* Refresh */}
                <button
                  onClick={() => fetchNotifications(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title="Refresh notifications"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-brand-600')} />
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors sm:hidden"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs & Mark All Read */}
            <div className="mt-3 flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  onClick={() => setFilter('ALL')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all',
                    filter === 'ALL'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('UNREAD')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all flex items-center gap-1',
                    filter === 'UNREAD'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="w-4 h-4 flex items-center justify-center rounded-full bg-brand-500 text-white text-[9px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 hover:underline transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
            {displayedNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Check className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto">
                  {filter === 'UNREAD'
                    ? 'You have caught up with all your CRM notifications.'
                    : 'System alerts, assigned leads, and payment updates will appear here.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={cn(
                    'group relative p-3 sm:p-3.5 flex items-start gap-3 transition-all cursor-pointer select-none text-xs',
                    !n.read
                      ? 'bg-brand-50/40 dark:bg-brand-950/20 hover:bg-brand-50/70 dark:hover:bg-brand-950/35'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {/* Unread indicator bar */}
                  {!n.read && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600 rounded-r" />
                  )}

                  {/* Icon */}
                  {getTypeIcon(n.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'truncate text-xs',
                          !n.read
                            ? 'font-bold text-slate-900 dark:text-slate-100'
                            : 'font-medium text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {n.title}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                      <span>{formatRelativeTime(n.createdAt)}</span>
                      {n.link && (
                        <span className="inline-flex items-center gap-0.5 text-brand-600 dark:text-brand-400 group-hover:underline">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Actions (hover) */}
                  <div className="absolute right-2.5 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={(e) => markSingleRead(n.id, e)}
                        className="p-1 rounded-md bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 shadow-xs border border-slate-200 dark:border-slate-700"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => deleteNotification(n.id, e)}
                      className="p-1 rounded-md bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 shadow-xs border border-slate-200 dark:border-slate-700"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 text-[10px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Realtime CRM Alerts Active
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
