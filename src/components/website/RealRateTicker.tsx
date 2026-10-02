'use client';

import React, { useState } from 'react';
import { VERIFIED_TRANSACTION_TICKER, VerifiedTransactionDeed } from '@/lib/rate-index-data';
import { PriceDisplay } from '@/components/website/PriceDisplay';
import { 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ArrowUpRight, 
  Sparkles,
  X,
  FileCheck,
  MapPin,
  UserCheck,
  Zap,
  Info
} from 'lucide-react';

interface RealRateTickerProps {
  variant?: 'banner' | 'embedded' | 'compact';
  filterSocietySlug?: string;
  className?: string;
}

export function RealRateTicker({
  variant = 'banner',
  filterSocietySlug,
  className = '',
}: RealRateTickerProps) {
  const [selectedDeed, setSelectedDeed] = useState<VerifiedTransactionDeed | null>(null);
  const [activeSocietyFilter, setActiveSocietyFilter] = useState<string>(filterSocietySlug || 'ALL');

  const filteredDeeds = VERIFIED_TRANSACTION_TICKER.filter((deed) => {
    if (activeSocietyFilter === 'ALL') return true;
    return deed.societySlug === activeSocietyFilter;
  });

  return (
    <>
      <div className={`bg-[#0A0A0A] text-[#FEFEFE] border-y border-[#262626] font-mono select-none overflow-hidden ${className}`}>
        {/* Top Ticker Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1F1F1F] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#F59E0B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Real-Rate Transaction Ticker
            </span>
            <span className="text-[10px] text-[#888888] hidden sm:inline">
              • Verified Closing Deeds vs. Inflated Portal Demands
            </span>
          </div>

          {/* Quick Society Filter Tabs */}
          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setActiveSocietyFilter('ALL')}
              className={`px-2 py-0.5 uppercase transition-colors ${
                activeSocietyFilter === 'ALL'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold'
                  : 'text-[#888888] hover:text-[#FEFEFE]'
              }`}
            >
              All Towns
            </button>
            <button
              onClick={() => setActiveSocietyFilter('kohistan-enclave-wah')}
              className={`px-2 py-0.5 uppercase transition-colors ${
                activeSocietyFilter === 'kohistan-enclave-wah'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold'
                  : 'text-[#888888] hover:text-[#FEFEFE]'
              }`}
            >
              Kohistan
            </button>
            <button
              onClick={() => setActiveSocietyFilter('new-city-phase-2-wah')}
              className={`px-2 py-0.5 uppercase transition-colors ${
                activeSocietyFilter === 'new-city-phase-2-wah'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold'
                  : 'text-[#888888] hover:text-[#FEFEFE]'
              }`}
            >
              New City
            </button>
            <button
              onClick={() => setActiveSocietyFilter('multi-gardens-b17-islamabad')}
              className={`px-2 py-0.5 uppercase transition-colors ${
                activeSocietyFilter === 'multi-gardens-b17-islamabad'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold'
                  : 'text-[#888888] hover:text-[#FEFEFE]'
              }`}
            >
              B-17
            </button>
          </div>
        </div>

        {/* Scrolling / Interactive Cards Ticker Track */}
        <div className="relative py-3 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 w-max">
            {filteredDeeds.map((deed) => (
              <div
                key={deed.id}
                onClick={() => setSelectedDeed(deed)}
                className="group cursor-pointer p-3 bg-[#141414] hover:bg-[#1C1C1C] border border-[#282828] hover:border-[#F59E0B]/60 transition-all duration-200 flex items-center gap-3.5 shrink-0"
              >
                {/* Status Dot & Society */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-[#AAAAAA] uppercase tracking-wider font-bold">
                      {deed.societyName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#FEFEFE] group-hover:text-[#F59E0B] transition-colors">
                    {deed.sectorBlock} • {deed.plotSize}
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-8 bg-[#282828]" />

                {/* Real Closing Rate vs Portal Ask */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#888888] uppercase">Real Closing:</span>
                  <div className="text-xs font-bold text-emerald-400">
                    <PriceDisplay amount={deed.realClosingRatePKR} />
                  </div>
                </div>

                {/* Buyer Savings Pill */}
                <div className="px-2 py-1 bg-emerald-950/40 border border-emerald-800/50 flex flex-col items-end">
                  <span className="text-[8.5px] font-mono text-emerald-300 uppercase">
                    Saved -{deed.buyerSavingsPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    <PriceDisplay amount={deed.buyerSavingsPKR} />
                  </span>
                </div>

                {/* Time & View Deed Icon */}
                <div className="text-right pl-1">
                  <span className="text-[9px] text-[#666666] block">{deed.transactionDate}</span>
                  <span className="text-[9px] text-[#AAAAAA] group-hover:text-[#FEFEFE] underline flex items-center justify-end gap-0.5">
                    Deed Audit <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* VERIFIED DEED AUDIT MODAL                                          */}
      {/* ------------------------------------------------------------------ */}
      {selectedDeed && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none">
          <div className="relative w-full max-w-lg bg-[#121212] border border-[#333333] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold uppercase text-[#FEFEFE]">
                    Verified Real Rate Transaction Audit
                  </h4>
                  <span className="text-[10px] text-[#888888] uppercase">
                    Deed Ref: #{selectedDeed.id} • Closed {selectedDeed.transactionDate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeed(null)}
                className="p-1 hover:bg-[#262626] text-[#AAAAAA] hover:text-[#FEFEFE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Deed Property Overview */}
            <div className="my-5 p-4 bg-[#181818] border border-[#2E2E2E] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#888888] uppercase">Society & Sector:</span>
                <span className="font-bold text-[#FEFEFE]">
                  {selectedDeed.societyName} ({selectedDeed.sectorBlock})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888888] uppercase">Demarcated Plot Size:</span>
                <span className="font-bold text-[#FEFEFE]">{selectedDeed.plotSize} ({selectedDeed.plotNumberDemarcated})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888888] uppercase">Possession Status:</span>
                <span className="text-emerald-400 font-bold">{selectedDeed.possessionStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888888] uppercase">Buyer Profile:</span>
                <span className="text-[#F59E0B] font-bold">{selectedDeed.buyerLocation}</span>
              </div>
            </div>

            {/* Financial Comparison Matrix */}
            <div className="p-4 bg-[#0A0A0A] border border-[#262626] mb-5 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
                <span className="text-[#888888]">Speculative Classified Portal Ask:</span>
                <span className="text-red-400 line-through">
                  <PriceDisplay amount={selectedDeed.portalAskingRatePKR} />
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
                <span className="font-bold text-[#FEFEFE]">ALH Verified Closing Rate:</span>
                <span className="text-base font-black text-emerald-400">
                  <PriceDisplay amount={selectedDeed.realClosingRatePKR} />
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-[#F59E0B]">Total Direct Buyer Savings:</span>
                <span className="font-black text-[#F59E0B]">
                  <PriceDisplay amount={selectedDeed.buyerSavingsPKR} /> (-{selectedDeed.buyerSavingsPct.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Verification Signature */}
            <div className="p-3 bg-[#161B22] border border-[#233044] text-[11px] text-[#88A4C7] flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified against registered stamp deed & Cantt/Society transfer counter by <strong>{selectedDeed.verifiedBy}</strong>.</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/923005123456?text=${encodeURIComponent(
                  `Hi Asad Land Holdings, I am inquiring about real rate plot inventory similar to Deed #${selectedDeed.id} in ${selectedDeed.societyName} (${selectedDeed.sectorBlock} - ${selectedDeed.plotSize}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs uppercase text-center transition-colors"
              >
                Inquire for Similar Plots
              </a>
              <button
                onClick={() => setSelectedDeed(null)}
                className="py-2.5 px-4 bg-[#262626] hover:bg-[#333333] text-[#FEFEFE] text-xs uppercase transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
