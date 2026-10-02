'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertyItem, SocietyItem } from './website-data';
import { trackEvent } from './analytics';

export type CompareItem =
  | { type: 'PROPERTY'; item: PropertyItem }
  | { type: 'SOCIETY'; item: SocietyItem };

interface CompareContextType {
  compareItems: CompareItem[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  const addToCompare = (newItem: CompareItem) => {
    const itemId = newItem.type === 'PROPERTY' ? newItem.item.id : newItem.item.id;
    if (compareItems.some(i => (i.type === 'PROPERTY' ? i.item.id : i.item.id) === itemId)) {
      return;
    }
    if (compareItems.length >= 4) {
      alert('You can compare up to 4 items simultaneously.');
      return;
    }

    setCompareItems(prev => [...prev, newItem]);
    trackEvent(newItem.type === 'PROPERTY' ? 'property_compared' : 'society_compared', {
      id: itemId,
      title: newItem.type === 'PROPERTY' ? newItem.item.title : newItem.item.name,
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareItems(prev => prev.filter(i => (i.type === 'PROPERTY' ? i.item.id : i.item.id) !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id: string) => {
    return compareItems.some(i => (i.type === 'PROPERTY' ? i.item.id : i.item.id) === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
