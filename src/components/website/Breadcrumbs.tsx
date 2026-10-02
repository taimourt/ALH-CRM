'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex items-center flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-[#666666]">
        <li>
          <Link href="/" className="hover:text-[#000000] transition-colors">
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-[#BDBDBD]" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[#000000] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#000000] font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
