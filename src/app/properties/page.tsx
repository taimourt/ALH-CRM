'use client';

import React, { useState, useMemo } from 'react';
import { SectionHeading } from '@/components/website/SectionHeading';
import { PropertyCard } from '@/components/website/PropertyCard';
import { SearchBar } from '@/components/website/SearchBar';
import { FilterBar, ExtendedFilterOptions } from '@/components/website/FilterBar';
import { EmptyState } from '@/components/website/EmptyState';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { useCMS } from '@/contexts/cms-context';
import { trackEvent } from '@/lib/analytics';

export default function PropertiesPage() {
  const { properties } = useCMS();
  const publishedProperties = useMemo(() => properties.filter((p) => p.status !== 'draft'), [properties]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExtendedFilterOptions>({
    city: '',
    society: '',
    propertyType: '',
    purpose: '',
    sizeMarla: '',
    minPrice: '',
    maxPrice: '',
    availabilityStatus: '',
    possessionStatus: '',
    developmentStatus: '',
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      city: '',
      society: '',
      propertyType: '',
      purpose: '',
      sizeMarla: '',
      minPrice: '',
      maxPrice: '',
      availabilityStatus: '',
      possessionStatus: '',
      developmentStatus: '',
    });
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) {
      trackEvent('search_performed', { query: q });
    }
  };

  const handleFilterChange = (newFilters: ExtendedFilterOptions) => {
    setFilters(newFilters);
    trackEvent('filter_used', { filters: newFilters });
  };

  const filteredProperties = useMemo(() => {
    return publishedProperties.filter((p) => {
      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.society.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filters.city && p.city !== filters.city) return false;
      if (filters.society && p.society !== filters.society) return false;
      if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
      if (filters.purpose && p.purpose !== filters.purpose) return false;
      if (filters.sizeMarla && p.sizeMarla !== Number(filters.sizeMarla)) return false;
      if (filters.minPrice && p.demandPrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.demandPrice > Number(filters.maxPrice)) return false;
      if (filters.availabilityStatus && p.availabilityStatus !== filters.availabilityStatus) return false;
      if (filters.possessionStatus && p.possessionStatus !== filters.possessionStatus) return false;

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Properties Catalog' }]} />

      <SectionHeading
        eyebrow="Empirical Real Estate Inventory"
        title="Verified Real-Rate Properties"
        subtitle="Explore active listings in Kohistan Enclave, New City Phase 2, Multi Gardens B-17, and Faisal Hills backed by actual transaction rates."
      />

      <div className="space-y-6 mb-10">
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-[#E5E5E5] mb-8 font-mono text-xs text-[#666666]">
        <span>
          Showing <strong className="text-[#000000]">{filteredProperties.length}</strong> of{' '}
          {properties.length} verified listings
        </span>
        <span className="uppercase text-[10px] tracking-widest text-[#000000]">
          Wah & Islamabad Region
        </span>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState onAction={handleResetFilters} actionText="Reset Search & Filters" />
      )}
    </div>
  );
}

