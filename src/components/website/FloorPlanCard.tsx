'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FloorPlanItem } from '@/lib/floor-plans-data';
import { PriceDisplay } from '@/components/website/PriceDisplay';
import { 
  BedDouble, 
  Bath, 
  Car, 
  Maximize2, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Compass
} from 'lucide-react';

interface FloorPlanCardProps {
  plan: FloorPlanItem;
  className?: string;
}

export function FloorPlanCard({ plan, className = '' }: FloorPlanCardProps) {
  return (
    <div className={`group bg-[#12141A] text-[#FEFEFE] border border-[#262A36] hover:border-[#F59E0B]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${className}`}>
      {/* 1. 3D ELEVATION IMAGE & BADGES */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0C10]">
        <Image
          src={plan.elevation3dRender}
          alt={plan.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dimension Pill Badge */}
        <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>{plan.plotDimensions}</span>
        </div>

        {/* Covered Area Badge */}
        <div className="absolute top-3 right-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-[#FEFEFE] border border-white/20">
          {plan.totalCoveredAreaSqFt} SqFt
        </div>

        {/* Style Tag */}
        <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-[#AAAAAA] uppercase tracking-wider">
          {plan.styleLabel}
        </div>
      </div>

      {/* 2. CARD CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold font-mono text-[#FEFEFE] group-hover:text-[#F59E0B] transition-colors line-clamp-1">
            {plan.title}
          </h3>
          <p className="text-xs text-[#CCCCCC] font-sans line-clamp-2 mt-1">
            {plan.subtitle}
          </p>
        </div>

        {/* Room Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#1E222D] text-xs font-mono text-[#CCCCCC]">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{plan.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{plan.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{plan.carPorchCapacity.split(' ')[0]} Car</span>
          </div>
        </div>

        {/* Turnkey BOQ Estimate Banner */}
        <div className="p-3 bg-[#181B24] border border-[#292F3E] flex items-center justify-between font-mono">
          <div>
            <span className="text-[9px] uppercase text-[#CCCCCC] block">Turnkey BOQ From:</span>
            <div className="text-sm font-black text-emerald-400">
              <PriceDisplay amount={plan.boqCostEstimates.premiumFinishingTotalPKR} />
            </div>
          </div>

          <span className="text-[10px] text-[#F59E0B] font-bold">
            {plan.spatialAnalysis.naturalLightScore}/10 Light Score
          </span>
        </div>
      </div>

      {/* 3. CARD FOOTER BUTTON */}
      <div className="p-4 pt-0">
        <Link
          href={`/floor-plans/${plan.slug}`}
          className="w-full py-2.5 px-4 bg-[#1F232E] group-hover:bg-[#F59E0B] text-[#FEFEFE] group-hover:text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 border border-[#313748] group-hover:border-[#F59E0B] transition-all"
        >
          <span>Inspect 2D / 3D Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
