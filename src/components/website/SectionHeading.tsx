'use client';

import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={`mb-12 ${
        align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-4xl'
      } ${className}`}
    >
      {eyebrow && (
        <div className={`flex items-center gap-2 mb-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <div className="w-6 h-[1px] bg-[#000000]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#666666]">
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#000000] uppercase font-sans">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-[#666666] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
