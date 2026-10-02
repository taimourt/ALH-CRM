'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/lib/compare-context';
import { X, ArrowRight, Layers } from 'lucide-react';
import { Button } from './Button';

export const CompareDrawer: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-40 bg-[#000000] text-[#FEFEFE] border border-[#FEFEFE] p-4 shadow-2xl font-mono">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#222222]">
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#FEFEFE]">
          <Layers className="w-4 h-4 text-[#FEFEFE]" />
          <span>Compare Matrix ({compareItems.length}/4)</span>
        </div>
        <button
          onClick={clearCompare}
          className="text-[10px] text-[#BDBDBD] hover:text-[#FEFEFE] underline uppercase"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {compareItems.map((c) => {
          const id = c.type === 'PROPERTY' ? c.item.id : c.item.id;
          const name = c.type === 'PROPERTY' ? c.item.title : c.item.name;

          return (
            <div
              key={id}
              className="flex items-center justify-between bg-[#111111] p-2 border border-[#222222] text-xs"
            >
              <span className="truncate pr-2 text-[#FEFEFE]">
                [{c.type}] {name}
              </span>
              <button
                onClick={() => removeFromCompare(id)}
                className="p-1 hover:bg-[#222222] text-[#BDBDBD] transition-colors"
                aria-label="Remove item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <Button href="/compare" variant="secondary" size="sm" className="w-full">
        Launch Side-by-Side Comparison <ArrowRight className="w-3.5 h-3.5 ml-2" />
      </Button>
    </div>
  );
};
