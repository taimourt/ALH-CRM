'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RotateCw,
  Clock,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface RoundRobinToggleProps {
  compact?: boolean;
  onStatusChange?: (enabled: boolean) => void;
  className?: string;
}

export function RoundRobinToggle({ compact = false, onStatusChange, className = '' }: RoundRobinToggleProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggling, setToggling] = useState<boolean>(false);
  const [distributing, setDistributing] = useState<boolean>(false);
  const [activeAgentsCount, setActiveAgentsCount] = useState<number>(0);
  const [unassignedCount, setUnassignedCount] = useState<number>(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [updatedBy, setUpdatedBy] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/leads/round-robin');
      if (res.ok) {
        const data = await res.json();
        setEnabled(Boolean(data.enabled));
        setActiveAgentsCount(data.activeAgentsCount || 0);
        setUnassignedCount(data.unassignedLeadsCount || 0);
        setUpdatedAt(data.updatedAt);
        setUpdatedBy(data.updatedBy);
        if (onStatusChange) onStatusChange(Boolean(data.enabled));
      }
    } catch (err) {
      console.error('Failed to fetch round robin status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (toggling) return;

    const nextState = !enabled;
    // Optimistic UI update
    setEnabled(nextState);
    setToggling(true);

    try {
      const res = await fetch('/api/leads/round-robin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE', enabled: nextState }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled);
        setUpdatedAt(data.updatedAt);
        setUpdatedBy(data.updatedBy);
        if (data.activeAgentsCount !== undefined) setActiveAgentsCount(data.activeAgentsCount);
        if (data.unassignedLeadsCount !== undefined) setUnassignedCount(data.unassignedLeadsCount);

        toast(
          data.enabled ? 'Round-Robin Activated' : 'Round-Robin Paused',
          data.message,
          data.enabled ? 'success' : 'info'
        );

        if (onStatusChange) onStatusChange(data.enabled);
      } else {
        // Revert on failure
        const err = await res.json().catch(() => ({}));
        setEnabled(!nextState);
        toast('Failed to Update', err.error || 'Could not change Round-Robin state.', 'error');
      }
    } catch (err) {
      setEnabled(!nextState);
      toast('Network Error', 'Could not reach server to toggle Round-Robin.', 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleBulkDistribute = async () => {
    if (distributing || unassignedCount === 0) return;

    setDistributing(true);
    try {
      const res = await fetch('/api/leads/round-robin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoAssignAllUnassigned: true }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Leads Distributed', data.message, 'success');
        setUnassignedCount(0);
        fetchStatus();
      } else {
        const err = await res.json().catch(() => ({}));
        toast('Distribution Error', err.error || 'Failed to distribute leads.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Failed to execute bulk round-robin distribution.', 'error');
    } finally {
      setDistributing(false);
    }
  };

  if (compact) {
    return (
      <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
        <div
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 select-none ${
            enabled
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80'
          }`}
          title="Click for Lead Distribution Settings & Agent Rotation"
        >
          {/* Status Indicator Icon */}
          <div className="relative flex items-center justify-center">
            {enabled ? (
              <>
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            )}
          </div>

          <span className="text-[11px] font-bold tracking-tight">
            {enabled ? 'Round-Robin: ON' : 'Round-Robin: PAUSED'}
          </span>

          {/* Toggle Switch Switcher Element */}
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={toggling || loading}
            onClick={handleToggle}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>

          <ChevronDown className="w-3 h-3 text-slate-400 opacity-70" />
        </div>

        {/* Dropdown Popover */}
        {popoverOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${enabled ? 'text-emerald-500' : 'text-amber-500'}`} />
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  Round-Robin Lead Routing
                </h4>
              </div>
              <Badge variant={enabled ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                {enabled ? 'Active' : 'Paused'}
              </Badge>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              {enabled
                ? 'Inbound leads from Google Ads, Meta Ads, and Google Sheets are automatically dispatched to active sales agents in rotation.'
                : 'Inbound inquiries are held in the Unassigned Pool. Sales managers must manually assign leads to agents.'}
            </p>

            <div className="mt-3.5 space-y-2 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Agent Roster:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Users className="w-3 h-3 text-brand-500" />
                  {activeAgentsCount} Agents Available
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Unassigned Pool:</span>
                <span className={`font-bold ${unassignedCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`}>
                  {unassignedCount} Lead{unassignedCount !== 1 ? 's' : ''}
                </span>
              </div>
              {updatedBy && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] text-slate-400">
                  <span>Last changed by:</span>
                  <span className="truncate max-w-[120px] font-medium">{updatedBy}</span>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="mt-3.5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleToggle}
                disabled={toggling}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  enabled
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900 dark:text-amber-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                {enabled ? (
                  <>
                    <PauseCircle className="w-3.5 h-3.5" /> Pause Auto-Distribution
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" /> Turn ON Auto-Distribution
                  </>
                )}
              </button>

              {unassignedCount > 0 && (
                <button
                  type="button"
                  onClick={handleBulkDistribute}
                  disabled={distributing}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold border border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${distributing ? 'animate-spin' : ''}`} />
                  {distributing ? 'Distributing...' : `⚡ Distribute ${unassignedCount} Unassigned Leads`}
                </button>
              )}

              <Link
                href="/settings"
                onClick={() => setPopoverOpen(false)}
                className="text-center text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pt-1"
              >
                System Settings ➔ Lead Routing
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded Full Card Layout (Used on Settings & Integrations pages)
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 ${
        enabled
          ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/20 dark:to-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
          : 'bg-gradient-to-r from-amber-50/70 to-orange-50/40 dark:from-amber-950/20 dark:to-slate-900 border-amber-300 dark:border-amber-800/80 shadow-xs'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              enabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Round-Robin Lead Distribution Engine
              </h3>
              <Badge variant={enabled ? 'success' : 'warning'} className="text-[11px] px-2 py-0.5">
                {enabled ? '● AUTO-DISTRIBUTION ON' : '○ DISTRIBUTION PAUSED'}
              </Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              {enabled
                ? 'Inbound inquiries from Google Ads, Meta Ads, Website Forms, and Google Sheets are automatically distributed sequentially across active sales agents with 24h SLA timers.'
                : 'Automated distribution is currently paused. Inbound inquiries will be retained in the Unassigned Pool for manual sales manager dispatch.'}
            </p>

            <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-brand-500" />
                <strong>{activeAgentsCount}</strong> Active Sales Agents in Rotation
              </span>

              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <strong className={unassignedCount > 0 ? 'text-amber-600 font-bold' : ''}>
                  {unassignedCount}
                </strong>{' '}
                Unassigned Pool Leads
              </span>

              {updatedAt && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(updatedAt).toLocaleDateString()} {updatedBy ? `by ${updatedBy}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right action toggle */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {enabled ? 'Active' : 'Paused'}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={toggling || loading}
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {unassignedCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDistribute}
              disabled={distributing}
              className="text-xs gap-1.5 border-brand-500/40 text-brand-600 dark:text-brand-400 hover:bg-brand-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${distributing ? 'animate-spin' : ''}`} />
              {distributing ? 'Distributing...' : `Distribute (${unassignedCount})`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
