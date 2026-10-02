'use client';

import React from 'react';
import Link from 'next/link';
import { RealRateTicker } from './RealRateTicker';
import { HistoricalRateChart } from './HistoricalRateChart';
import { PriceAlertSubscription } from './PriceAlertSubscription';
import { SectionHeading } from './SectionHeading';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Scale,
  DollarSign
} from 'lucide-react';

interface RealVsSpeculativeSectionProps {
  initialSocietySlug?: string;
  className?: string;
}

export function RealVsSpeculativeSection({
  initialSocietySlug = 'kohistan-enclave-wah',
  className = '',
}: RealVsSpeculativeSectionProps) {
  return (
    <section className={`py-12 sm:py-16 bg-[#08090C] text-[#FEFEFE] border-y border-[#22252E] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. SECTION HEADING */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono text-xs uppercase tracking-widest mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Core Brand Philosophy • Real Estate on Real Rates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight uppercase">
              Real vs. Speculative Market Rate Index
            </h2>
            <p className="text-xs sm:text-sm text-[#AAAAAA] font-sans max-w-2xl mt-2 leading-relaxed">
              Empirical historical tracking comparing verified registered stamp deeds against speculative classified portal asking rates in Wah Cantt and Islamabad.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <Link
              href="/investment"
              className="px-4 py-2.5 bg-[#171920] hover:bg-[#222632] text-[#FEFEFE] border border-[#2E3342] transition-colors flex items-center gap-1.5"
            >
              <span>Investment Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. REAL TRANSACTION TICKER */}
        <div className="border border-[#262A36]">
          <RealRateTicker filterSocietySlug={initialSocietySlug} />
        </div>

        {/* 3. 5-YEAR HISTORICAL CHART */}
        <div>
          <HistoricalRateChart initialSocietySlug={initialSocietySlug} />
        </div>

        {/* 4. WHY PORTAL DEMANDS MISLEAD (PHILOSOPHY MATRIX) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 bg-[#12141A] border border-[#22252E]">
            <div className="flex items-center gap-2 text-[#EF4444] font-bold uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>1. The Portal Ask Bubble</span>
            </div>
            <p className="text-xs text-[#AAAAAA] font-sans leading-relaxed">
              Unverified classified portals display aspirational demands posted by non-exclusive brokers, inflating prices by 18% to 26% above genuine cash transfers.
            </p>
          </div>

          <div className="p-5 bg-[#12141A] border border-[#22252E]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>2. ALH Real Closing Truth</span>
            </div>
            <p className="text-xs text-[#AAAAAA] font-sans leading-relaxed">
              Every rate presented on Asad Land Holdings is extracted from registered transfer records, physical site inspections, and executed Cantonment/RDA registry deeds.
            </p>
          </div>

          <div className="p-5 bg-[#12141A] border border-[#22252E]">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>3. Direct Buyer Savings</span>
            </div>
            <p className="text-xs text-[#AAAAAA] font-sans leading-relaxed">
              By eliminating speculative layers and paper files, our clients save between PKR 12 Lakh to PKR 50 Lakh on standard residential and commercial plots.
            </p>
          </div>
        </div>

        {/* 5. PRICE ALERT SUBSCRIPTION WIDGET */}
        <div>
          <PriceAlertSubscription initialSocietySlug={initialSocietySlug} />
        </div>
      </div>
    </section>
  );
}
