'use client';

import React from 'react';

interface ArchitecturalLineProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withLabel?: string;
}

export const ArchitecturalLine: React.FC<ArchitecturalLineProps> = ({
  className = '',
  size = 'md',
  withLabel,
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-[#E5E5E5]" />
      
      {/* Simplified Architectural Roof & Pillar Motif */}
      <div className={`flex items-center justify-center text-[#222222] ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="w-full h-full"
        >
          {/* Architectural roof peak */}
          <path d="M3 12L12 4L21 12" />
          {/* Floor baseline */}
          <path d="M5 20H19" />
          {/* Structural pillars */}
          <path d="M7 12V20" />
          <path d="M12 12V20" />
          <path d="M17 12V20" />
        </svg>
      </div>

      {withLabel && (
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#666666] whitespace-nowrap">
          {withLabel}
        </span>
      )}

      <div className="h-[1px] flex-1 bg-[#E5E5E5]" />
    </div>
  );
};
