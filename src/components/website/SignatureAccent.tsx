'use client';

import React from 'react';

interface SignatureAccentProps {
  name?: string;
  title?: string;
  className?: string;
}

export const SignatureAccent: React.FC<SignatureAccentProps> = ({
  name = 'Asad Ali',
  title = 'Founder & Managing Director',
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      {/* Handwritten Signature Art */}
      <span className="font-signature text-3xl sm:text-4xl text-[#000000] tracking-wide select-none">
        {name}
      </span>
      
      {/* Thin divider rule */}
      <div className="w-full h-[1px] bg-[#000000] my-1 opacity-80" />
      
      {/* Editorial subtitle */}
      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#666666]">
        {title}
      </span>
    </div>
  );
};
