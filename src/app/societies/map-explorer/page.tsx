'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SectionHeading } from '@/components/website/SectionHeading';
import { SocietyMapExplorer } from '@/components/website/SocietyMapExplorer';
import { Button } from '@/components/website/Button';
import { FlowLines } from '@/components/website/FlowLines';
import { 
  Compass, 
  Layers, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function MapExplorerPage() {
  return (
    <div className="bg-[#FEFEFE] min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO & INTRO HEADER                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-8 pb-12 bg-[#0A0A0A] text-[#FEFEFE] border-b border-[#262626] overflow-hidden">
        <FlowLines opacity={0.15} variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Societies Directory', href: '/societies' },
              { label: 'Interactive Master Plan Explorer' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-mono text-xs uppercase tracking-widest mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Proprietary Architectural GIS Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-[#FEFEFE] uppercase mb-4">
                Interactive Society <br className="hidden sm:inline" />
                <span className="text-[#F59E0B]">Master Plan & Sector Map</span> Explorer
              </h1>

              <p className="text-sm sm:text-base text-[#AAAAAA] font-sans max-w-2xl leading-relaxed">
                Explore real-time on-ground valuations, possession percentages, underground utilities checklists, and linked video walkthroughs across Kohistan Enclave, New City Phase 2, and Multi Gardens B-17.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 bg-[#141414] border border-[#262626]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Coverage</span>
                <span className="text-lg font-bold text-[#FEFEFE]">3 Mega Townships</span>
                <span className="text-[10px] text-emerald-400 block mt-1">100% On-Ground Demarcated</span>
              </div>
              <div className="p-4 bg-[#141414] border border-[#262626]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Valuation Mode</span>
                <span className="text-lg font-bold text-[#F59E0B]">Live Multi-Currency</span>
                <span className="text-[10px] text-[#888888] block mt-1">PKR, USD, GBP, AED, SAR</span>
              </div>
              <div className="p-4 bg-[#141414] border border-[#262626]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Utilities Audit</span>
                <span className="text-lg font-bold text-[#38BDF8]">6 Key Matrices</span>
                <span className="text-[10px] text-[#888888] block mt-1">Gas, Power, Fiber, Water</span>
              </div>
              <div className="p-4 bg-[#141414] border border-[#262626]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Ground Proof</span>
                <span className="text-lg font-bold text-red-400">48+ Tours</span>
                <span className="text-[10px] text-[#888888] block mt-1">Linked Video Footage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. THE INTERACTIVE MAP EXPLORER ENGINE                             */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <SocietyMapExplorer />

        {/* ---------------------------------------------------------------- */}
        {/* 3. HOW TO USE & VALUATION METHODOLOGY                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="mt-16 pt-12 border-t border-[#E5E5E5]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F9F9F9] border border-[#E5E5E5]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#000000] mb-3">
                <TrendingUp className="w-4 h-4 text-[#D97706]" />
                <span>1. Verified Rate Heatmap</span>
              </div>
              <p className="text-xs text-[#555555] font-sans leading-relaxed">
                Unlike speculative classified portals with inflated asking rates, ALH rates reflect actual registered transaction deeds and current cash transfers occurring within each specific sector.
              </p>
            </div>

            <div className="p-6 bg-[#F9F9F9] border border-[#E5E5E5]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#000000] mb-3">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>2. Physical Ground Possession Audit</span>
              </div>
              <p className="text-xs text-[#555555] font-sans leading-relaxed">
                We clearly separate 100% on-ground ready-to-build plots from developing extension files, safeguarding overseas investors against off-ground delays and non-demarcated inventory.
              </p>
            </div>

            <div className="p-6 bg-[#F9F9F9] border border-[#E5E5E5]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#000000] mb-3">
                <Zap className="w-4 h-4 text-[#0284C7]" />
                <span>3. Underground Utilities Verification</span>
              </div>
              <p className="text-xs text-[#555555] font-sans leading-relaxed">
                Each block is continuously audited for operational Sui Northern Gas connections, underground WAPDA grid cables, water filtration plants, and optical fiber internet line readiness.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. ON-GROUND SITE VISIT CTA                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="mt-12 p-8 sm:p-10 bg-[#0A0A0A] text-[#FEFEFE] border border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight uppercase">
              Schedule an On-Ground Master Plan Site Visit
            </h3>
            <p className="text-xs sm:text-sm text-[#AAAAAA] font-sans max-w-xl">
              Want to physically inspect the exact plot boundaries, road elevation, and utility meters? Our senior advisors will accompany you on an in-person or live WhatsApp video walkthrough.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/overseas"
              className="px-5 py-3 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#FEFEFE] text-xs font-mono uppercase tracking-wider border border-[#333333] transition-colors"
            >
              Overseas Investor Desk
            </Link>

            <a
              href="https://wa.me/923005123456?text=Hi%20Asad%20Land%20Holdings,%20I%20would%20like%20to%20schedule%20an%20on-ground%20site%20visit%20for%20the%20Master%20Plan%20sectors."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Book Site Visit via WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
