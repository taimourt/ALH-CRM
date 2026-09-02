'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
      <span className="text-slate-500">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        {totalResults !== undefined && ` (${totalResults} total items)`}
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs"
        >
          Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
