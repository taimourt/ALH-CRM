'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-mono uppercase tracking-[0.2em] font-semibold text-xs transition-colors duration-200 border rounded-none focus:outline-none';

  const variantClasses = {
    primary: 'bg-[#000000] text-[#FEFEFE] border-[#000000] hover:bg-[#222222] hover:border-[#222222]',
    secondary: 'bg-[#FEFEFE] text-[#000000] border-[#000000] hover:bg-[#F4F4F4]',
    dark: 'bg-[#222222] text-[#FEFEFE] border-[#222222] hover:bg-[#000000]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text.xs',
    lg: 'px-8 py-4 text-xs sm:text-sm',
  };

  const combined = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
};

export const OutlineButton: React.FC<ButtonProps> = ({
  children,
  href,
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-mono uppercase tracking-[0.2em] font-medium text-xs transition-colors duration-200 bg-transparent text-[#000000] border border-[#000000] hover:bg-[#000000] hover:text-[#FEFEFE] rounded-none';

  const sizeClasses = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-xs sm:text-sm',
  };

  const combined = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
};
