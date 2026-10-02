'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search by society, block, marla size or location...',
  initialValue = '',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FEFEFE] border border-[#000000] px-4 py-3.5 pl-11 text-xs font-sans placeholder-[#666666] text-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000] rounded-none"
      />
      <Search className="absolute left-3.5 w-4 h-4 text-[#000000]" />
      <button
        type="submit"
        className="absolute right-2 px-4 py-1.5 bg-[#000000] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-widest hover:bg-[#222222]"
      >
        Search
      </button>
    </form>
  );
};
