'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '@/lib/compare-context';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Button } from '@/components/website/Button';
import { EmptyState } from '@/components/website/EmptyState';
import { formatPKRPrice } from '@/components/website/PriceDisplay';
import { PROPERTIES_DATA, SOCIETIES_DATA } from '@/lib/website-data';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // If user navigated directly, seed with 2 sample properties if empty for easy demo
  const displayItems =
    compareItems.length > 0
      ? compareItems
      : [
          { type: 'PROPERTY' as const, item: PROPERTIES_DATA[0] },
          { type: 'PROPERTY' as const, item: PROPERTIES_DATA[1] },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Property & Society Comparison Matrix' }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <SectionHeading
          eyebrow="Side-by-Side Architectural Evaluation"
          title="Empirical Comparison Matrix"
          subtitle="Direct side-by-side evaluation of rates, plot sizes, development status, and investment considerations."
          className="mb-0"
        />

        {compareItems.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-mono uppercase tracking-widest text-[#666666] hover:text-[#000000] underline mt-4 md:mt-0"
          >
            Clear Selected Items
          </button>
        )}
      </div>

      {displayItems.length > 0 ? (
        <div className="overflow-x-auto border border-[#000000] bg-[#FEFEFE] mb-16">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#000000] bg-[#F4F4F4]">
                <th className="p-4 w-48 text-[#000000] uppercase">Evaluation Feature</th>
                {displayItems.map((c) => {
                  const id = c.type === 'PROPERTY' ? c.item.id : c.item.id;
                  const title = c.type === 'PROPERTY' ? c.item.title : c.item.name;

                  return (
                    <th key={id} className="p-4 min-w-[220px] text-[#000000] uppercase border-l border-[#E5E5E5] relative">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm block line-clamp-2">{title}</span>
                        <button
                          onClick={() => removeFromCompare(id)}
                          className="p-1 text-[#666666] hover:text-[#000000]"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#666666] block mt-1">[{c.type}]</span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E5E5]">
              {/* Row 1: Location & City */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">City / Location</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5]">
                    {c.type === 'PROPERTY' ? `${c.item.society}, ${c.item.city}` : `${c.item.name}, ${c.item.city}`}
                  </td>
                ))}
              </tr>

              {/* Row 2: Demand Rate / Range */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">Demand Rate / Range</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5] font-bold text-[#000000]">
                    {c.type === 'PROPERTY'
                      ? formatPKRPrice(c.item.demandPrice)
                      : `${formatPKRPrice(c.item.priceRangeMin)} – ${formatPKRPrice(c.item.priceRangeMax)}`}
                  </td>
                ))}
              </tr>

              {/* Row 3: Size / Category */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">Asset Category & Size</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5]">
                    {c.type === 'PROPERTY'
                      ? `${c.item.sizeMarla} Marla (${c.item.sizeSqFt} SqFt)`
                      : `${c.item.totalPlots.toLocaleString()} Plots across ${c.item.blocks.length} Blocks`}
                  </td>
                ))}
              </tr>

              {/* Row 4: Regulatory Approval NOC */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">NOC Clearance</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5]">
                    <span className="inline-flex items-center gap-1 font-bold text-[#000000]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#000000]" />
                      {c.item.nocStatus}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Development Status */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">Development Velocity</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5]">
                    {c.item.devStatus}
                  </td>
                ))}
              </tr>

              {/* Row 6: Estimated Yield / Appreciation */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">Annual Appreciation</td>
                {displayItems.map((c) => (
                  <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5] font-bold text-[#000000]">
                    {c.type === 'PROPERTY' ? '18.4% (Wah Benchmark)' : c.item.annualAppreciation}
                  </td>
                ))}
              </tr>

              {/* Row 7: Action Trigger */}
              <tr>
                <td className="p-4 font-bold text-[#000000] bg-[#F4F4F4]/50">Action</td>
                {displayItems.map((c) => {
                  const slug = c.type === 'PROPERTY' ? c.item.slug : c.item.slug;
                  const href = c.type === 'PROPERTY' ? `/properties/${slug}` : `/societies/${slug}`;

                  return (
                    <td key={c.type === 'PROPERTY' ? c.item.id : c.item.id} className="p-4 border-l border-[#E5E5E5]">
                      <Button href={href} variant="primary" size="sm" className="w-full">
                        View Full Blueprint
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Items Added for Comparison"
          description="Click the compare button on any property card or society page to evaluate them side-by-side."
        />
      )}
    </div>
  );
}
