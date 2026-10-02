'use client';

import React from 'react';

interface EditorialHeadingProps {
  children: React.ReactNode;
  size?: 'xl' | '2xl' | '3xl';
  className?: string;
}

export const EditorialHeading: React.FC<EditorialHeadingProps> = ({
  children,
  size = '2xl',
  className = '',
}) => {
  const sizeClasses = {
    xl: 'text-3xl sm:text-4xl md:text-5xl',
    '2xl': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    '3xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  };

  return (
    <h1
      className={`font-black uppercase tracking-tight text-[#000000] leading-[0.95] ${sizeClasses[size]} ${className}`}
    >
      {children}
    </h1>
  );
};
