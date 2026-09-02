'use client';

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  error?: string;
  className?: string;
}

export function DatePicker({ label, value, onChange, error, className }: DatePickerProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={cn(
            'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
            error && 'border-rose-500 focus-visible:ring-rose-500',
            className
          )}
        />
        <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}
