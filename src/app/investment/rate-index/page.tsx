'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SectionHeading } from '@/components/website/SectionHeading';
import { RealVsSpeculativeSection } from '@/components/website/RealVsSpeculativeSection';
import { FlowLines } from '@/components/website/FlowLines';
import { 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function RateIndexPage() {
  return (
    <div className="bg-[#FEFEFE] min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO HEADER                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-8 pb-12 bg-[#08090C] text-[#FEFEFE] border-b border-[#22252E] overflow-hidden">
        <FlowLines opacity={0.15} variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Investment Hub', href: '/investment' },
              { label: 'Real vs. Speculative Rate Index' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono text-xs uppercase tracking-widest mb-4">
                <Scale className="w-3.5 h-3.5" />
                <span>Empirical Valuation Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-[#FEFEFE] uppercase mb-4">
                Real vs. Speculative <br className="hidden sm:inline" />
                <span className="text-emerald-400">Market Rate Ticker</span> & Historical Index
              </h1>

              <p className="text-sm sm:text-base text-[#AAAAAA] font-sans max-w-2xl leading-relaxed">
                Asad Land Holdings was founded on a simple empirical principle: <strong>Real Estate on Real Rates</strong>. Track 5 years of verified closing transaction deeds against inflated online classified portal demands.
              </p>
            </div>

            {/* Metric Highlights */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 bg-[#12141A] border border-[#22252E]">
                <span className="text-[10px] text-[#CCCCCC] uppercase block mb-1">Deed Integrity</span>
                <span className="text-lg font-bold text-emerald-400">100% Verified</span>
                <span className="text-[10px] text-[#CCCCCC] block mt-1">DC & Cantt stamp registries</span>
              </div>
              <div className="p-4 bg-[#12141A] border border-[#22252E]">
                <span className="text-[10px] text-[#CCCCCC] uppercase block mb-1">Portal Hype Spread</span>
                <span className="text-lg font-bold text-red-400">+18% to +26%</span>
                <span className="text-[10px] text-[#CCCCCC] block mt-1">Artificial classified bubble</span>
              </div>
              <div className="p-4 bg-[#12141A] border border-[#22252E]">
                <span className="text-[10px] text-[#CCCCCC] uppercase block mb-1">Direct Savings</span>
                <span className="text-lg font-bold text-[#F59E0B]">PKR 12L – 50L</span>
                <span className="text-[10px] text-[#CCCCCC] block mt-1">Per transaction average</span>
              </div>
              <div className="p-4 bg-[#12141A] border border-[#22252E]">
                <span className="text-[10px] text-[#CCCCCC] uppercase block mb-1">Price Drop Alerts</span>
                <span className="text-lg font-bold text-[#38BDF8]">Instant Radar</span>
                <span className="text-[10px] text-[#CCCCCC] block mt-1">SMS & WhatsApp triggers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. THE MASTER SECTION (TICKER + CHART + ALERTS)                     */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <RealVsSpeculativeSection />
      </main>
    </div>
  );
}
