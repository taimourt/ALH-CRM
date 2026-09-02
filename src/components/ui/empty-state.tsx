import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <FolderOpen className="w-8 h-8 text-slate-400" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3',
        className
      )}
    >
      <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">{icon}</div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
