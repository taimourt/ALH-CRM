'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'outline',
  className = '',
}) => {
  const variantClasses = {
    outline: 'bg-transparent border border-[#000000] text-[#000000]',
    solid: 'bg-[#F4F4F4] text-[#000000] border border-[#E5E5E5]',
    dark: 'bg-[#000000] text-[#FEFEFE] border border-[#000000]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] rounded-none ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
