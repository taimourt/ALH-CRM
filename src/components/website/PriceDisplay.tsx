'use client';

import React from 'react';
import { useCurrency } from '@/contexts/currency-context';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  forcePKR?: boolean;
}

export function formatPKRPrice(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `PKR ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `PKR ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return `PKR ${amount.toLocaleString()}`;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  className = '',
  size = 'md',
  showLabel = false,
  forcePKR = false,
}) => {
  const { currency, formatPrice } = useCurrency();
  const isForeign = currency !== 'PKR' && !forcePKR;
  const mainPrice = isForeign ? formatPrice(amount) : formatPKRPrice(amount);
  const pkrEquivalent = formatPKRPrice(amount);

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-black',
    xl: 'text-2xl sm:text-3xl md:text-4xl font-black',
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {showLabel && (
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-300">
          Real Demand Rate
        </span>
      )}
      <span className={`font-mono tracking-tight text-inherit ${sizeClasses[size]}`}>
        {mainPrice}
      </span>
      {isForeign && (
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-300">
          ≈ {pkrEquivalent}
        </span>
      )}
    </div>
  );
};
