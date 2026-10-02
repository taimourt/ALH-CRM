'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/website/SectionHeading';
import { SocietyCard } from '@/components/website/SocietyCard';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SocietyMapExplorer } from '@/components/website/SocietyMapExplorer';
import { SOCIETIES_DATA } from '@/lib/website-data';
import { Compass, Layers, ArrowRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export default function SocietiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Societies Directory' }]} />

      <SectionHeading
        eyebrow="Geographic Footprint"
        title="Covered Societies & Townships"
        subtitle="Detailed analysis of regulatory approvals (RDA/CDA), development velocity, plot price ranges, and annual yields in Wah Cantt, Taxila, and Islamabad."
      />

      {/* ------------------------------------------------------------------ */}
      {/* FEATURED: INTERACTIVE SECTOR MAP EXPLORER BANNER & ENGINE          */}
      {/* ------------------------------------------------------------------ */}
      <div className="mb-16">
        <div className="p-6 sm:p-8 bg-[#0A0A0A] text-[#FEFEFE] border border-[#262626] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#F59E0B]">
                <Compass className="w-3.5 h-3.5" />
                <span>Feature 4 • Architectural Vector Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight uppercase">
                Interactive Society Master Plan & Sector Explorer
              </h3>
              <p className="text-xs sm:text-sm text-[#AAAAAA] font-sans max-w-2xl leading-relaxed">
                Move beyond static images. Inspect actual rate-per-marla heatmaps, 100% on-ground physical possession percentages, underground utilities checklists, and landmark distance rings for Kohistan Enclave, New City Phase 2, and Multi Gardens B-17.
              </p>
            </div>

            <Link
              href="/societies/map-explorer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEFEFE] text-[#0A0A0A] hover:bg-[#F59E0B] font-mono text-xs uppercase font-bold tracking-wider transition-colors shrink-0"
            >
              <span>Launch Fullscreen Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Map Explorer */}
        <SocietyMapExplorer />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SOCIETIES DIRECTORY LIST                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="pt-8 border-t border-[#E5E5E5]">
        <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#000000]" /> All Approved Societies & Detailed Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SOCIETIES_DATA.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>
      </div>
    </div>
  );
}

