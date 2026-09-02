'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();

  if (!pathname || pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);

  const formattedSegments = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { href, label };
  });

  return (
    <nav className={cn('flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400', className)}>
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {formattedSegments.map((segment, idx) => {
        const isLast = idx === formattedSegments.length - 1;
        return (
          <React.Fragment key={segment.href}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors truncate"
              >
                {segment.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
