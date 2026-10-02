'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'AED' | 'SAR' | 'EUR' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateToPKR: number; // 1 Foreign Unit = X PKR
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', flag: '🇵🇰', rateToPKR: 1.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToPKR: 278.5 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateToPKR: 365.2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateToPKR: 75.8 },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', rateToPKR: 74.2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToPKR: 302.0 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateToPKR: 205.5 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateToPKR: 186.0 },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  config: CurrencyConfig;
  convertFromPKR: (pkrAmount: number, targetCurrency?: CurrencyCode) => number;
  formatPrice: (pkrAmount: number, targetCurrency?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('PKR');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alh_selected_currency') as CurrencyCode;
      if (saved && CURRENCY_CONFIGS[saved]) {
        setCurrencyState(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('alh_selected_currency', code);
    } catch (e) {
      // ignore
    }
  };

  const convertFromPKR = (pkrAmount: number, targetCurrency: CurrencyCode = currency): number => {
    const targetConfig = CURRENCY_CONFIGS[targetCurrency] || CURRENCY_CONFIGS.PKR;
    if (targetCurrency === 'PKR') return pkrAmount;
    return pkrAmount / targetConfig.rateToPKR;
  };

  const formatPrice = (pkrAmount: number, targetCurrency: CurrencyCode = currency): string => {
    const target = targetCurrency || currency;
    const config = CURRENCY_CONFIGS[target] || CURRENCY_CONFIGS.PKR;

    if (target === 'PKR') {
      if (pkrAmount >= 10000000) {
        const crore = pkrAmount / 10000000;
        return `PKR ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
      } else if (pkrAmount >= 100000) {
        const lakh = pkrAmount / 100000;
        return `PKR ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
      }
      return `PKR ${pkrAmount.toLocaleString()}`;
    }

    const converted = convertFromPKR(pkrAmount, target);
    
    if (converted >= 1000000) {
      return `${config.symbol} ${(converted / 1000000).toFixed(2)}M`;
    } else if (converted >= 1000) {
      return `${config.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol} ${converted.toFixed(0)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        config: CURRENCY_CONFIGS[currency],
        convertFromPKR,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      currency: 'PKR',
      setCurrency: () => {},
      config: CURRENCY_CONFIGS.PKR,
      convertFromPKR: (pkr) => pkr,
      formatPrice: (pkr) => {
        if (pkr >= 10000000) return `PKR ${(pkr / 10000000).toFixed(2)} Crore`;
        if (pkr >= 100000) return `PKR ${(pkr / 100000).toFixed(2)} Lakh`;
        return `PKR ${pkr.toLocaleString()}`;
      },
    };
  }
  return context;
};
