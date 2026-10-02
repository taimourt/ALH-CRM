'use client';

import React from 'react';

interface StatBlockProps {
  value: string;
  label: string;
  sublabel?: string;
  className?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  value,
  label,
  sublabel,
  className = '',
}) => {
  return (
    <div className={`p-6 border border-[#E5E5E5] bg-[#FEFEFE] relative overflow-hidden ${className}`}>
      <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-[#000000] mb-2">
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] font-mono text-[#000000] font-semibold">
        {label}
      </div>
      {sublabel && (
        <div className="text-[11px] text-[#666666] mt-1 leading-snug">
          {sublabel}
        </div>
      )}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#000000] opacity-20" />
    </div>
  );
};
