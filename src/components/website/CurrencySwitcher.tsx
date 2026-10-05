'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_CONFIGS, CurrencyCode } from '@/contexts/currency-context';
import { trackEvent } from '@/lib/analytics';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dark' | 'footer';
  direction?: 'up' | 'down';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  variant = 'compact',
  direction = 'down',
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

  const isFooter = variant === 'footer';
  const isDark = variant === 'dark' || isFooter;

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors border ${
          isFooter
            ? 'bg-[#141414] text-[#FEFEFE] border-[#333333] hover:border-[#666666] hover:bg-[#1C1C1C]'
            : isDark
            ? 'bg-[#141414] text-[#FEFEFE] border-[#333333] hover:border-[#555555]'
            : 'bg-[#1A1A1A] text-[#FEFEFE] border-[#333333] hover:border-[#666666]'
        }`}
        aria-label="Select Currency"
      >
        <Globe className="w-3.5 h-3.5 text-[#888888]" />
        <span className="text-sm leading-none">{config.flag}</span>
        <span>{config.code}</span>
        {direction === 'up' ? (
          <ChevronUp className="w-3 h-3 text-[#999999]" />
        ) : (
          <ChevronDown className="w-3 h-3 text-[#999999]" />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            direction === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1'
          } right-0 sm:left-0 sm:right-auto w-52 bg-[#141414] border border-[#333333] shadow-2xl z-50 divide-y divide-[#222222] font-mono text-xs`}
        >
          <div className="p-2 text-[9px] uppercase tracking-wider text-[#888888] bg-[#0C0C0C] flex items-center justify-between">
            <span>Display Currency</span>
            <span className="text-[8px] text-[#666666]">Live Rates</span>
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
                    <span className="text-base">{item.flag}</span>
                    <span className="font-semibold">{item.code}</span>
                    <span className="text-[10px] text-[#777777]">({item.symbol})</span>
                  </div>
                  <span className="text-[10px] text-[#777777]">
                    {code !== 'PKR' ? `≈${item.rateToPKR} PKR` : 'Base'}
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
