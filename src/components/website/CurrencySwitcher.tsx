'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_CONFIGS, CurrencyCode } from '@/contexts/currency-context';
import { trackEvent } from '@/lib/analytics';
import { ChevronDown, Globe } from 'lucide-react';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dark';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { currency, setCurrency, config } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    trackEvent('filter_used', { currency: code });
  };

  const isDark = variant === 'dark';

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-bold uppercase transition-colors border ${
          isDark
            ? 'bg-[#141414] text-[#FEFEFE] border-[#333333] hover:border-[#555555]'
            : 'bg-[#1A1A1A] text-[#FEFEFE] border-[#333333] hover:border-[#666666]'
        }`}
        aria-label="Select Currency"
      >
        <span className="text-sm leading-none">{config.flag}</span>
        <span>{config.code}</span>
        <ChevronDown className="w-3 h-3 text-[#999999]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-[#141414] border border-[#333333] shadow-2xl z-50 divide-y divide-[#222222] font-mono text-xs">
          <div className="p-2 text-[9px] uppercase tracking-wider text-[#888888] bg-[#0C0C0C]">
            Select Currency
          </div>
          <div className="py-1">
            {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((code) => {
              const item = CURRENCY_CONFIGS[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#242424] text-amber-400 font-bold'
                      : 'text-[#FEFEFE] hover:bg-[#1C1C1C]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.code}</span>
                  </div>
                  <span className="text-[10px] text-[#777777]">
                    {item.symbol} {code !== 'PKR' && `≈${item.rateToPKR} PKR`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
