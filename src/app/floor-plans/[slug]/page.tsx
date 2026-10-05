'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { FLOOR_PLANS_DATA, FloorPlanItem } from '@/lib/floor-plans-data';
import { CONSTRUCTION_SERIES_DATA } from '@/lib/construction-series-data';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { FloorPlanViewer } from '@/components/website/FloorPlanViewer';
import { FloorPlanCard } from '@/components/website/FloorPlanCard';
import { Button } from '@/components/website/Button';
import { 
  Compass, 
  Layers, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Calculator, 
  MessageSquare, 
  Sparkles,
  MapPin,
  Building2,
  Phone
} from 'lucide-react';

export default function FloorPlanDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const plan = FLOOR_PLANS_DATA.find((p) => p.slug === slug);

  if (!plan) {
    notFound();
  }

  // Find linked construction episode if available
  const linkedEpisode = plan.linkedConstructionSeriesEpisodeId
    ? CONSTRUCTION_SERIES_DATA.find((ep) => ep.id === plan.linkedConstructionSeriesEpisodeId)
    : null;

  // Other related floor plans
  const otherPlans = FLOOR_PLANS_DATA.filter((p) => p.id !== plan.id).slice(0, 2);

  const whatsappConsultUrl = `https://wa.me/923005123456?text=${encodeURIComponent(
    `Hi Asad Land Holdings, I am looking at the architectural plan for ${plan.title} (${plan.plotDimensions} - ${plan.totalCoveredAreaSqFt} SqFt). Please share full AutoCAD DWG drawings and turnkey construction timelines.`
  )}`;

  return (
    <div className="bg-[#FEFEFE] min-h-screen pb-16">
      {/* ------------------------------------------------------------------ */}
      {/* 1. BREADCRUMBS & TOP BAR                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Floor Plans Catalog', href: '/floor-plans' },
            { label: plan.title },
          ]}
        />

        <div className="flex items-center justify-between mb-6">
          <Link
            href="/floor-plans"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#666666] hover:text-[#000000]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Floor Plans Catalog
          </Link>

          <span className="text-xs font-mono text-[#CCCCCC] uppercase">
            Lead Architect: {plan.leadArchitect}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN INTERACTIVE VIEWER                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <FloorPlanViewer plan={plan} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. ARCHITECTURAL DETAILS & SUITABLE SOCIETIES                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Detailed Specifications */}
        <div className="lg:col-span-8 space-y-8 font-mono text-xs">
          {/* Key Highlights */}
          <div className="p-6 bg-[#F8F9FA] border border-[#E5E5E5]">
            <h3 className="text-sm font-bold uppercase text-[#000000] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97706]" /> Key Architectural Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#444444] font-sans">
              {plan.keyHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-[#FEFEFE] border border-[#E5E5E5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Societies & Matching Inventory */}
          <div className="p-6 bg-[#FEFEFE] border border-[#000000]">
            <h3 className="text-sm font-bold uppercase text-[#000000] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#000000]" /> Recommended Matching Sectors in Wah & Islamabad
            </h3>
            <p className="text-xs text-[#666666] font-sans leading-relaxed mb-4">
              This layout has been calibrated to fit standard plot demarcations and building bylaws across the following premier societies:
            </p>
            <div className="flex flex-wrap gap-2">
              {plan.suitableSocieties.map((soc, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#F4F4F4] border border-[#E5E5E5] text-[#000000] font-bold">
                  {soc}
                </span>
              ))}
            </div>
          </div>

          {/* Linked "Plot Say Ghar Tak" Masterclass Episode */}
          {linkedEpisode && (
            <div className="p-6 bg-[#0A0C10] text-[#FEFEFE] border border-[#262B3A]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#F59E0B] uppercase font-bold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" /> Linked &quot;Plot Say Ghar Tak&quot; Masterclass
                </span>
                <span className="text-[10px] text-[#CCCCCC] uppercase">
                  Episode #{linkedEpisode.episodeNumber} • {linkedEpisode.duration}
                </span>
              </div>
              <h4 className="text-base font-bold uppercase text-[#FEFEFE] mb-2 font-sans">
                {linkedEpisode.title}
              </h4>
              <p className="text-xs text-[#AAAAAA] font-sans leading-relaxed mb-4">
                {linkedEpisode.summary}
              </p>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] font-bold uppercase text-xs hover:bg-[#d97706] transition-colors"
              >
                <span>Watch Construction Episode</span>
                <Play className="w-3 h-3 fill-current" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Architect Direct Card & Booking */}
        <div className="lg:col-span-4 space-y-6 font-mono text-xs">
          <div className="p-6 bg-[#14161C] text-[#FEFEFE] border border-[#282D3C]">
            <span className="text-[10px] uppercase text-[#F59E0B] font-bold block mb-1">
              Architecture Lead
            </span>
            <h4 className="text-base font-bold text-[#FEFEFE]">{plan.leadArchitect}</h4>
            <span className="text-[11px] text-[#CCCCCC] block mb-4">Asad Land Holdings Studio</span>

            <p className="text-xs text-[#AAAAAA] font-sans leading-relaxed mb-6">
              {plan.architectRemarks}
            </p>

            <a
              href={whatsappConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold uppercase flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Discuss Floor Plan on WhatsApp</span>
            </a>

            <Link
              href="/calculators"
              className="w-full py-2.5 px-4 bg-[#1F232E] hover:bg-[#2B3140] text-[#FEFEFE] text-center uppercase border border-[#343C4E] block transition-colors"
            >
              Custom BOQ Material Estimator
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. OTHER ARCHITECTURAL DESIGNS                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold uppercase font-mono text-[#000000]">
            Explore Other Standardized Floor Plans
          </h3>
          <Link
            href="/floor-plans"
            className="text-xs font-mono uppercase font-bold text-[#000000] hover:underline"
          >
            View All Catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherPlans.map((p) => (
            <FloorPlanCard key={p.id} plan={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
