'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SectionHeading } from '@/components/website/SectionHeading';
import { FloorPlanCard } from '@/components/website/FloorPlanCard';
import { FloorPlanViewer } from '@/components/website/FloorPlanViewer';
import { useCMS } from '@/contexts/cms-context';
import { FlowLines } from '@/components/website/FlowLines';
import { 
  Compass, 
  Layers, 
  BedDouble, 
  Building2, 
  ShieldCheck, 
  Calculator, 
  Download, 
  MessageSquare, 
  Play, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function FloorPlansCatalogPage() {
  const { floorPlans } = useCMS();
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('ALL');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('ALL');
  const [featuredPlanId, setFeaturedPlanId] = useState<string>(() => floorPlans[0]?.id || 'fp-5m-executive');

  // Filtered List
  const filteredPlans = useMemo(() => {
    return floorPlans.filter((plan) => {
      if (selectedSizeFilter !== 'ALL' && plan.plotSizeCategory !== selectedSizeFilter) {
        return false;
      }
      if (selectedStyleFilter !== 'ALL' && plan.architecturalStyle !== selectedStyleFilter) {
        return false;
      }
      return true;
    });
  }, [floorPlans, selectedSizeFilter, selectedStyleFilter]);

  const featuredPlan = useMemo(() => {
    return floorPlans.find(p => p.id === featuredPlanId) || floorPlans[0];
  }, [floorPlans, featuredPlanId]);

  return (
    <div className="bg-[#FEFEFE] min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO HEADER                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-8 pb-14 bg-[#0A0C10] text-[#FEFEFE] border-b border-[#242834] overflow-hidden">
        <FlowLines opacity={0.15} variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Construction Studio', href: '/calculators' },
              { label: 'Architectural Floor Plans Catalog' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 font-mono text-xs uppercase tracking-widest mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Asad Land Holdings Architecture Studio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-[#FEFEFE] uppercase mb-4">
                3D & 2D Architectural <br className="hidden sm:inline" />
                <span className="text-[#F59E0B]">Floor Plan & Layout</span> Catalog
              </h1>

              <p className="text-sm sm:text-base text-[#AAAAAA] font-sans max-w-2xl leading-relaxed">
                See what you can build before you buy your plot. Standardized, Cantonment Board & RDA-compliant architectural blueprints for 5 Marla (25×45), 8 Marla (30×60), 10 Marla (35×70), and 1 Kanal (50×90) with turnkey BOQ cost estimates.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 bg-[#12151D] border border-[#262B3A]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Standard Cuttings</span>
                <span className="text-lg font-bold text-[#FEFEFE]">5M, 8M, 10M, 1K</span>
                <span className="text-[10px] text-emerald-400 block mt-1">100% Bylaws Compliant</span>
              </div>
              <div className="p-4 bg-[#12151D] border border-[#262B3A]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Dual Renders</span>
                <span className="text-lg font-bold text-[#F59E0B]">3D + 2D CAD</span>
                <span className="text-[10px] text-[#888888] block mt-1">Ground & First Floor</span>
              </div>
              <div className="p-4 bg-[#12151D] border border-[#262B3A]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">Turnkey BOQ</span>
                <span className="text-lg font-bold text-[#38BDF8]">Live Cost Est.</span>
                <span className="text-[10px] text-[#888888] block mt-1">Grey + Premium Finish</span>
              </div>
              <div className="p-4 bg-[#12151D] border border-[#262B3A]">
                <span className="text-[10px] text-[#888888] uppercase block mb-1">CAD Delivery</span>
                <span className="text-lg font-bold text-emerald-400">PDF & DWG</span>
                <span className="text-[10px] text-[#888888] block mt-1">Instant WhatsApp dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. INTERACTIVE FEATURED BLUEPRINT VIEWER                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-widest font-bold block">
              Interactive CAD Blueprint Inspector
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-mono text-[#000000] uppercase">
              Featured Architectural Layout
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#888888] hidden sm:inline">Select Sample:</span>
            {floorPlans.map((p) => (
              <button
                key={p.id}
                onClick={() => setFeaturedPlanId(p.id)}
                className={`px-2.5 py-1 text-xs border uppercase transition-colors ${
                  featuredPlanId === p.id
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#F4F4F4] text-[#666666] border-[#E5E5E5] hover:text-[#000000]'
                }`}
              >
                {p.plotDimensions}
              </button>
            ))}
          </div>
        </div>

        <FloorPlanViewer plan={featuredPlan} />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CATALOG FILTER BAR & FLOOR PLANS GRID                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#F8F9FA] py-14 border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest font-bold block">
                Standardized Dimensions
              </span>
              <h3 className="text-2xl font-black font-mono text-[#000000] uppercase">
                Explore All Floor Plans by Plot Size
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setSelectedSizeFilter('ALL')}
                className={`px-3 py-1.5 border uppercase transition-colors ${
                  selectedSizeFilter === 'ALL'
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#FEFEFE] text-[#666666] border-[#D1D5DB] hover:text-[#000000]'
                }`}
              >
                All Sizes
              </button>
              <button
                onClick={() => setSelectedSizeFilter('5_MARLA')}
                className={`px-3 py-1.5 border uppercase transition-colors ${
                  selectedSizeFilter === '5_MARLA'
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#FEFEFE] text-[#666666] border-[#D1D5DB] hover:text-[#000000]'
                }`}
              >
                5 Marla (25×45)
              </button>
              <button
                onClick={() => setSelectedSizeFilter('8_MARLA')}
                className={`px-3 py-1.5 border uppercase transition-colors ${
                  selectedSizeFilter === '8_MARLA'
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#FEFEFE] text-[#666666] border-[#D1D5DB] hover:text-[#000000]'
                }`}
              >
                8 Marla (30×60)
              </button>
              <button
                onClick={() => setSelectedSizeFilter('10_MARLA')}
                className={`px-3 py-1.5 border uppercase transition-colors ${
                  selectedSizeFilter === '10_MARLA'
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#FEFEFE] text-[#666666] border-[#D1D5DB] hover:text-[#000000]'
                }`}
              >
                10 Marla (35×70)
              </button>
              <button
                onClick={() => setSelectedSizeFilter('1_KANAL')}
                className={`px-3 py-1.5 border uppercase transition-colors ${
                  selectedSizeFilter === '1_KANAL'
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] font-bold'
                    : 'bg-[#FEFEFE] text-[#666666] border-[#D1D5DB] hover:text-[#000000]'
                }`}
              >
                1 Kanal (50×90)
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <FloorPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. CUSTOM CAD MODIFICATIONS & ARCHITECT CONSULTATION               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#0A0C10] text-[#FEFEFE] py-16 border-t border-[#242834]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono text-xs uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Turnkey Architectural Engineering</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight uppercase">
                Need a Custom CAD Layout for Your Specific Plot?
              </h3>

              <p className="text-xs sm:text-sm text-[#AAAAAA] font-sans max-w-2xl leading-relaxed">
                Whether you have an odd-dimension corner plot, three-side-open cutting, or want a specialized basement home theater in Kohistan Enclave or New City Phase 2, our licensed civil engineers and architects will design your custom 3D elevation and structural drawings.
              </p>

              <div className="flex flex-wrap gap-4 font-mono text-xs text-[#CCCCCC] pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete 3D Elevation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Structural RCC Framing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cantonment/RDA Approval File
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs">
              <a
                href="https://wa.me/923005123456?text=Hi%20Asad%20Land%20Holdings,%20I%20would%20like%20to%20request%20a%20custom%20architectural%20floor%20plan%20and%20consultation%20with%20Engr.%20Hammad%20Khan."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Book Architect Call via WhatsApp</span>
              </a>

              <Link
                href="/calculators"
                className="py-3 px-6 bg-[#181B24] hover:bg-[#252A38] text-[#FEFEFE] text-center uppercase border border-[#2F3548] transition-colors"
              >
                Calculate BOQ Construction Cost
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
