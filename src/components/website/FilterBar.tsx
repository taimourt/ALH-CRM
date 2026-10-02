'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export interface ExtendedFilterOptions {
  city: string;
  society: string;
  propertyType: string;
  purpose: string;
  sizeMarla: string;
  minPrice: string;
  maxPrice: string;
  availabilityStatus: string;
  possessionStatus: string;
  developmentStatus: string;
}

interface FilterBarProps {
  filters: ExtendedFilterOptions;
  onChange: (filters: ExtendedFilterOptions) => void;
  onReset: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const handleChange = (key: keyof ExtendedFilterOptions, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className={`bg-[#F4F4F4] border border-[#000000] p-5 font-mono ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#000000] font-bold">
          <Filter className="w-4 h-4 text-[#000000]" />
          <span>Real-Rate Filter Matrix</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase text-[#666666] hover:text-[#000000] tracking-wider"
        >
          <RotateCcw className="w-3 h-3" /> Reset Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* 1. Property Type */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Types</option>
            <option value="RESIDENTIAL_PLOT">Plot (Residential)</option>
            <option value="COMMERCIAL_PLOT">Plot (Commercial)</option>
            <option value="HOUSE_VILLA">House / Villa</option>
            <option value="APARTMENT">Apartment / Suite</option>
            <option value="PLAZA_BUILDING">Shop / Commercial Building</option>
            <option value="FARMHOUSE">Farmhouse</option>
            <option value="FILE">File / Allocation</option>
          </select>
        </div>

        {/* 2. Intended Purpose */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Intended Purpose</label>
          <select
            value={filters.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Purposes</option>
            <option value="INVESTMENT">Investment Capital Gains</option>
            <option value="BUILD">Immediate House Construction</option>
            <option value="RESIDENCE">Turnkey Residence</option>
            <option value="RENTAL">Rental Cashflow</option>
            <option value="COMMERCIAL">Commercial Business</option>
          </select>
        </div>

        {/* 3. Location / Society */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Society Location</label>
          <select
            value={filters.society}
            onChange={(e) => handleChange('society', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Societies</option>
            <option value="Kohistan Enclave">Kohistan Enclave (Wah)</option>
            <option value="New City Phase 2">New City Phase 2 (Wah)</option>
            <option value="Multi Gardens B-17">Multi Gardens B-17 (Islamabad)</option>
            <option value="Faisal Hills">Faisal Hills (Taxila)</option>
            <option value="TopCity-1">TopCity-1 (Islamabad Airport)</option>
          </select>
        </div>

        {/* 4. Size Category */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Plot Size</label>
          <select
            value={filters.sizeMarla}
            onChange={(e) => handleChange('sizeMarla', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Sizes</option>
            <option value="5">5 Marla (1,125 SqFt)</option>
            <option value="7">7 Marla (1,575 SqFt)</option>
            <option value="10">10 Marla (2,250 SqFt)</option>
            <option value="20">1 Kanal (4,500 SqFt)</option>
          </select>
        </div>

        {/* 5. Price Minimum */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Min Price (PKR)</label>
          <select
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">No Minimum</option>
            <option value="4000000">40 Lakhs</option>
            <option value="7500000">75 Lakhs</option>
            <option value="10000000">1.0 Crore</option>
            <option value="20000000">2.0 Crore</option>
          </select>
        </div>

        {/* 6. Price Maximum */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Max Price (PKR)</label>
          <select
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">No Maximum</option>
            <option value="6000000">Up to 60 Lakhs</option>
            <option value="10000000">Up to 1.0 Crore</option>
            <option value="20000000">Up to 2.0 Crore</option>
            <option value="50000000">Up to 5.0 Crore</option>
          </select>
        </div>

        {/* 7. Possession Status */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Possession Status</label>
          <select
            value={filters.possessionStatus}
            onChange={(e) => handleChange('possessionStatus', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Possessions</option>
            <option value="AVAILABLE">On-Ground Possessed</option>
            <option value="UPCOMING">Upcoming Possession</option>
          </select>
        </div>

        {/* 8. Availability Opportunity Tag */}
        <div>
          <label className="block text-[10px] uppercase text-[#666666] mb-1">Opportunity Tag</label>
          <select
            value={filters.availabilityStatus}
            onChange={(e) => handleChange('availabilityStatus', e.target.value)}
            className="w-full bg-[#FEFEFE] border border-[#BDBDBD] p-2 text-xs text-[#000000] rounded-none focus:outline-none focus:border-[#000000]"
          >
            <option value="">All Listings</option>
            <option value="AVAILABLE">Available</option>
            <option value="HOT_OPPORTUNITY">Hot Opportunity</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
      </div>
    </div>
  );
};
