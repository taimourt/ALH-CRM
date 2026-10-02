'use client';

import React from 'react';
import { ArchitecturalLine } from './ArchitecturalLine';

export const LoadingState: React.FC<{ label?: string }> = ({
  label = 'Verifying Architectural Intelligence...',
}) => {
  return (
    <div className="p-16 text-center border border-[#E5E5E5] bg-[#FEFEFE] my-8 animate-pulse">
      <ArchitecturalLine className="max-w-xs mx-auto mb-6" size="md" />
      <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#666666]">
        {label}
      </span>
    </div>
  );
};
