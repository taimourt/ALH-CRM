'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FloorPlanItem, RoomDimensionItem } from '@/lib/floor-plans-data';
import { PriceDisplay } from '@/components/website/PriceDisplay';
import { useCurrency } from '@/contexts/currency-context';
import { 
  Compass, 
  Layers, 
  Maximize2, 
  Play, 
  BedDouble, 
  Bath, 
  Car, 
  Utensils, 
  Wind, 
  Sun, 
  CheckCircle2, 
  Download, 
  MessageSquare, 
  Calculator, 
  Sparkles, 
  Eye, 
  FileText, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';

interface FloorPlanViewerProps {
  plan: FloorPlanItem;
  className?: string;
}

export function FloorPlanViewer({ plan, className = '' }: FloorPlanViewerProps) {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'3D_RENDER' | 'GROUND_FLOOR_2D' | 'FIRST_FLOOR_2D'>('3D_RENDER');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [pdfDownloadModal, setPdfDownloadModal] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  const groundRooms = plan.roomDimensions.filter(r => r.floor === 'GROUND');
  const firstRooms = plan.roomDimensions.filter(r => r.floor === 'FIRST');

  const whatsappInquiryUrl = `https://wa.me/923218004186?text=${encodeURIComponent(
    `Hi Asad Land Holdings, I am reviewing the architectural floor plan for ${plan.title} (${plan.plotDimensions} - ${plan.totalCoveredAreaSqFt} SqFt). I would like to request CAD DWG drawings and a custom consultation with Engr. Hammad Khan.`
  )}`;

  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone) return;
    setPdfSuccess(true);
  };

  return (
    <div className={`bg-[#0D0F12] text-[#FEFEFE] border border-[#262A36] font-mono select-none overflow-hidden ${className}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & SPECIFICATIONS BAR                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 sm:p-6 border-b border-[#262A36] bg-[#14161C]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 font-bold">
                <Compass className="w-3.5 h-3.5" /> Architectural CAD Standard • {plan.plotDimensions}
              </span>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">
                • {plan.totalCoveredAreaSqFt} SqFt Covered Area
              </span>
              <span className="text-[10px] text-[#CCCCCC] uppercase hidden sm:inline">
                • {plan.styleLabel}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#FEFEFE]">
              {plan.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#AAAAAA] font-sans mt-1">
              {plan.subtitle}
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 bg-[#1B1E26] border border-[#2F3444] flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-[#F59E0B]" />
              <span>{plan.bedrooms} Beds</span>
            </div>
            <div className="px-3 py-1.5 bg-[#1B1E26] border border-[#2F3444] flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-[#38BDF8]" />
              <span>{plan.bathrooms} Baths</span>
            </div>
            <div className="px-3 py-1.5 bg-[#1B1E26] border border-[#2F3444] flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>{plan.carPorchCapacity}</span>
            </div>
            <div className="px-3 py-1.5 bg-[#1B1E26] border border-[#2F3444] flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#EC4899]" />
              <span>{plan.kitchensCount} Kitchens</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (3D Render vs Ground Floor 2D vs First Floor 2D) */}
        <div className="mt-5 pt-4 border-t border-[#222632] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('3D_RENDER')}
              className={`px-3.5 py-1.5 text-xs border transition-colors flex items-center gap-1.5 ${
                activeTab === '3D_RENDER'
                  ? 'bg-[#F59E0B] text-[#0A0A0A] font-bold border-[#F59E0B]'
                  : 'bg-[#171920] text-[#AAAAAA] border-[#2A2E3B] hover:text-[#FEFEFE]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D Exterior Elevation Render</span>
            </button>

            <button
              onClick={() => setActiveTab('GROUND_FLOOR_2D')}
              className={`px-3.5 py-1.5 text-xs border transition-colors flex items-center gap-1.5 ${
                activeTab === 'GROUND_FLOOR_2D'
                  ? 'bg-[#2563EB] text-[#FEFEFE] font-bold border-[#2563EB]'
                  : 'bg-[#171920] text-[#AAAAAA] border-[#2A2E3B] hover:text-[#FEFEFE]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ground Floor 2D Blueprint ({plan.groundFloorCoveredAreaSqFt} SqFt)</span>
            </button>

            <button
              onClick={() => setActiveTab('FIRST_FLOOR_2D')}
              className={`px-3.5 py-1.5 text-xs border transition-colors flex items-center gap-1.5 ${
                activeTab === 'FIRST_FLOOR_2D'
                  ? 'bg-[#059669] text-[#FEFEFE] font-bold border-[#059669]'
                  : 'bg-[#171920] text-[#AAAAAA] border-[#2A2E3B] hover:text-[#FEFEFE]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>First Floor 2D Blueprint ({plan.firstFloorCoveredAreaSqFt} SqFt)</span>
            </button>
          </div>

          <button
            onClick={() => setPdfDownloadModal(true)}
            className="px-3 py-1.5 bg-[#1F2430] hover:bg-[#2A3142] text-[#FEFEFE] border border-[#3A4358] text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Download Architectural CAD PDF</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN VISUALIZER CANVAS & BLUEPRINT AREA                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#262A36]">
        {/* Visualizer Canvas (8 Cols) */}
        <div className="lg:col-span-8 relative bg-[#090B0E] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#262A36] flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
          {/* Engineering Blueprint Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20" 
            style={{
              backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* TAB 1: 3D Exterior Elevation Render */}
          {activeTab === '3D_RENDER' && (
            <div className="relative z-10 w-full my-auto flex flex-col items-center">
              <div className="relative aspect-[16/10] w-full max-w-2xl bg-[#000000] border border-[#2E3342] overflow-hidden shadow-2xl">
                <Image
                  src={plan.gallery[activeImageIndex] || plan.elevation3dRender}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-[#000000]/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono text-[#FEFEFE] border border-white/20">
                  3D Architectural Elevation • Photorealistic Render
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {plan.gallery.length > 1 && (
                <div className="flex items-center gap-2 mt-4">
                  {plan.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 border overflow-hidden transition-all ${
                        activeImageIndex === idx ? 'border-[#F59E0B] scale-105' : 'border-[#333333] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Ground Floor 2D Vector CAD Blueprint */}
          {activeTab === 'GROUND_FLOOR_2D' && (
            <div className="relative z-10 w-full my-auto flex flex-col items-center">
              <div className="w-full max-w-2xl bg-[#0F1318] p-4 sm:p-6 border border-[#2E3342] shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262B38] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#38BDF8]">GROUND FLOOR BLUEPRINT</span>
                    <span className="text-[#CCCCCC]">({plan.plotDimensions})</span>
                  </div>
                  <span className="text-[10px] text-[#AAAAAA]">{plan.groundFloorCoveredAreaSqFt} SqFt Net</span>
                </div>

                {/* SVG 2D Architectural Blueprint */}
                <svg viewBox="0 0 500 400" className="w-full h-auto overflow-visible font-mono select-none">
                  {/* Outer Plot Boundary */}
                  <rect x="20" y="20" width="460" height="360" fill="#0A0C0F" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Front Car Porch */}
                  <rect 
                    x="30" y="270" width="180" height="100" 
                    fill={hoveredRoom === 'Car Porch' ? '#2563EB' : '#141820'} 
                    fillOpacity={hoveredRoom === 'Car Porch' ? 0.4 : 0.9}
                    stroke="#475569" strokeWidth="2" 
                    onMouseEnter={() => setHoveredRoom('Car Porch')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-colors"
                  />
                  <text x="120" y="325" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">CAR PORCH</text>
                  <text x="120" y="340" fill="#94A3B8" fontSize="8" textAnchor="middle">14&apos;0&quot; × 12&apos;6&quot;</text>

                  {/* Drawing Room */}
                  <rect 
                    x="220" y="270" width="250" height="100" 
                    fill={hoveredRoom === 'Drawing Room' ? '#F59E0B' : '#141820'} 
                    fillOpacity={hoveredRoom === 'Drawing Room' ? 0.35 : 0.9}
                    stroke="#475569" strokeWidth="2" 
                    onMouseEnter={() => setHoveredRoom('Drawing Room')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-colors"
                  />
                  <text x="345" y="320" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">FORMAL DRAWING & DINING</text>
                  <text x="345" y="335" fill="#94A3B8" fontSize="8" textAnchor="middle">12&apos;0&quot; × 14&apos;0&quot;</text>

                  {/* Central TV Lounge & Staircase */}
                  <rect 
                    x="30" y="140" width="280" height="120" 
                    fill={hoveredRoom === 'Living & TV Lounge' || hoveredRoom === 'Grand TV Lounge' ? '#10B981' : '#141820'} 
                    fillOpacity={hoveredRoom?.includes('Lounge') ? 0.35 : 0.9}
                    stroke="#475569" strokeWidth="2" 
                    onMouseEnter={() => setHoveredRoom('Living & TV Lounge')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-colors"
                  />
                  <text x="170" y="195" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">GREAT TV LOUNGE</text>
                  <text x="170" y="210" fill="#94A3B8" fontSize="8.5" textAnchor="middle">14&apos;6&quot; × 16&apos;0&quot;</text>

                  {/* Kitchen Area */}
                  <rect 
                    x="320" y="140" width="150" height="120" 
                    fill={hoveredRoom?.includes('Kitchen') ? '#EC4899' : '#141820'} 
                    fillOpacity={hoveredRoom?.includes('Kitchen') ? 0.35 : 0.9}
                    stroke="#475569" strokeWidth="2" 
                    onMouseEnter={() => setHoveredRoom('Open Kitchen & Island')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-colors"
                  />
                  <text x="395" y="195" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">ISLAND KITCHEN</text>
                  <text x="395" y="210" fill="#94A3B8" fontSize="8" textAnchor="middle">9&apos;0&quot; × 11&apos;6&quot;</text>

                  {/* Ground Master Bed */}
                  <rect 
                    x="30" y="30" width="280" height="100" 
                    fill={hoveredRoom?.includes('Master') ? '#8B5CF6' : '#141820'} 
                    fillOpacity={hoveredRoom?.includes('Master') ? 0.35 : 0.9}
                    stroke="#475569" strokeWidth="2" 
                    onMouseEnter={() => setHoveredRoom('Master Bedroom (Ground)')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-colors"
                  />
                  <text x="170" y="75" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">GROUND MASTER SUITE</text>
                  <text x="170" y="90" fill="#94A3B8" fontSize="8" textAnchor="middle">12&apos;0&quot; × 14&apos;6&quot;</text>

                  {/* Rear OTS Ventilation Shaft & Bath */}
                  <rect 
                    x="320" y="30" width="150" height="100" 
                    fill="#064E3B" fillOpacity="0.4"
                    stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3"
                  />
                  <text x="395" y="75" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">REAR OTS / AIR SHAFT</text>
                  <text x="395" y="90" fill="#94A3B8" fontSize="8" textAnchor="middle">Attached Bath + Laundry</text>
                </svg>
              </div>
            </div>
          )}

          {/* TAB 3: First Floor 2D Vector CAD Blueprint */}
          {activeTab === 'FIRST_FLOOR_2D' && (
            <div className="relative z-10 w-full my-auto flex flex-col items-center">
              <div className="w-full max-w-2xl bg-[#0F1318] p-4 sm:p-6 border border-[#2E3342] shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262B38] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#059669]">FIRST FLOOR BLUEPRINT</span>
                    <span className="text-[#CCCCCC]">({plan.plotDimensions})</span>
                  </div>
                  <span className="text-[10px] text-[#AAAAAA]">{plan.firstFloorCoveredAreaSqFt} SqFt Net</span>
                </div>

                {/* SVG First Floor */}
                <svg viewBox="0 0 500 400" className="w-full h-auto overflow-visible font-mono select-none">
                  <rect x="20" y="20" width="460" height="360" fill="#0A0C0F" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Front Sunset Terrace */}
                  <rect x="30" y="280" width="180" height="90" fill="#1E293B" fillOpacity="0.5" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="120" y="330" fill="#38BDF8" fontSize="9.5" fontWeight="bold" textAnchor="middle">FRONT SUNSET TERRACE</text>
                  <text x="120" y="345" fill="#94A3B8" fontSize="8" textAnchor="middle">14&apos;0&quot; × 8&apos;0&quot;</text>

                  {/* Bed 2 Front */}
                  <rect x="220" y="260" width="250" height="110" fill="#141820" stroke="#475569" strokeWidth="2" />
                  <text x="345" y="315" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">FIRST BEDROOM 2</text>
                  <text x="345" y="330" fill="#94A3B8" fontSize="8" textAnchor="middle">12&apos;0&quot; × 14&apos;0&quot; (Attached Bath)</text>

                  {/* First Lounge */}
                  <rect x="30" y="140" width="280" height="130" fill="#141820" stroke="#475569" strokeWidth="2" />
                  <text x="170" y="200" fill="#E2E8F0" fontSize="10.5" fontWeight="bold" textAnchor="middle">FAMILY GALLERY LOUNGE</text>
                  <text x="170" y="215" fill="#94A3B8" fontSize="8" textAnchor="middle">Coffee Bar + Balcony View</text>

                  {/* Bed 3 Rear */}
                  <rect x="30" y="30" width="280" height="100" fill="#141820" stroke="#475569" strokeWidth="2" />
                  <text x="170" y="75" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">FIRST BEDROOM 3</text>
                  <text x="170" y="90" fill="#94A3B8" fontSize="8" textAnchor="middle">12&apos;0&quot; × 14&apos;6&quot; (Attached Bath)</text>

                  {/* OTS Void */}
                  <rect x="320" y="30" width="150" height="210" fill="#064E3B" fillOpacity="0.4" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="395" y="130" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">OPEN TO SKY (OTS)</text>
                  <text x="395" y="145" fill="#94A3B8" fontSize="8" textAnchor="middle">Light Well & Ventilation</text>
                </svg>
              </div>
            </div>
          )}

          {/* Bottom Canvas Notice */}
          <div className="relative z-10 mt-3 pt-3 border-t border-[#1C202B] flex flex-wrap items-center justify-between text-[11px] text-[#CCCCCC]">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cantonment Board & RDA Setback Bylaws Verified
            </span>
            <span>Designed by Asad Land Holdings Architecture Studio</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. TURNKEY BOQ COST ESTIMATES & ROOM DIMENSIONS (4 Cols)           */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 bg-[#14161C] p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Turnkey BOQ Package Estimates Box */}
            <div className="p-4 bg-[#1A1E27] border border-[#2B3242] mb-5">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#252B3A]">
                <Calculator className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-xs font-bold uppercase text-[#FEFEFE]">
                  Estimated Construction Cost (BOQ)
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#AAAAAA] block">Grey Structure (A+ Grade):</span>
                    <span className="text-[10px] text-[#CCCCCC]">PKR 2,450 / SqFt (Steel/Cement/Bricks)</span>
                  </div>
                  <span className="font-bold text-emerald-400">
                    <PriceDisplay amount={plan.boqCostEstimates.greyStructureTotalPKR} />
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#232836]">
                  <div>
                    <span className="text-[#AAAAAA] block">Premium Turnkey Complete:</span>
                    <span className="text-[10px] text-[#CCCCCC]">PKR 4,600 / SqFt (Tiles, Ash Wood, Kitchens)</span>
                  </div>
                  <span className="font-bold text-[#F59E0B]">
                    <PriceDisplay amount={plan.boqCostEstimates.premiumFinishingTotalPKR} />
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#232836]">
                  <div>
                    <span className="text-[#AAAAAA] block">Executive Signature Finish:</span>
                    <span className="text-[10px] text-[#CCCCCC]">PKR 5,800 / SqFt (Spanish, Smart Home)</span>
                  </div>
                  <span className="font-bold text-[#38BDF8]">
                    <PriceDisplay amount={plan.boqCostEstimates.executiveSignatureTotalPKR} />
                  </span>
                </div>
              </div>
            </div>

            {/* Spatial & Ventilation Health Index */}
            <div className="p-4 bg-[#111318] border border-[#242835] mb-5">
              <span className="text-[10px] uppercase text-[#CCCCCC] font-bold block mb-2">
                Spatial & Natural Light Audit:
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="p-2 bg-[#171920] border border-[#272B38]">
                  <span className="text-[9px] text-[#CCCCCC] block">Natural Light</span>
                  <span className="font-black text-[#F59E0B]">{plan.spatialAnalysis.naturalLightScore}/10</span>
                </div>
                <div className="p-2 bg-[#171920] border border-[#272B38]">
                  <span className="text-[9px] text-[#CCCCCC] block">Cross Vent.</span>
                  <span className="font-black text-emerald-400">{plan.spatialAnalysis.crossVentilationScore}/10</span>
                </div>
                <div className="p-2 bg-[#171920] border border-[#272B38]">
                  <span className="text-[9px] text-[#CCCCCC] block">Circulation</span>
                  <span className="font-black text-[#38BDF8]">{plan.spatialAnalysis.circulationEfficiencyPct}%</span>
                </div>
              </div>

              <p className="text-[11px] text-[#AAAAAA] font-sans leading-relaxed">
                {plan.spatialAnalysis.ventilationDescription}
              </p>
            </div>

            {/* Key Room Dimensions Breakdown */}
            <div>
              <span className="text-[10px] uppercase text-[#CCCCCC] font-bold block mb-2">
                Room Dimensions Table ({plan.roomDimensions.length} Key Spaces):
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {plan.roomDimensions.map((room, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredRoom(room.roomName)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className={`p-2 border flex items-center justify-between transition-colors ${
                      hoveredRoom === room.roomName
                        ? 'bg-[#1F2430] border-[#F59E0B] text-[#FEFEFE]'
                        : 'bg-[#151820] border-[#242836] text-[#CCCCCC]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[11px] block">{room.roomName}</span>
                      <span className="text-[9px] text-[#A0AEC0]">{room.features.join(' • ')}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">{room.dimensionFt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-3 border-t border-[#242835]">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Consult Architect on WhatsApp</span>
            </a>

            <button
              onClick={() => setPdfDownloadModal(true)}
              className="w-full py-2.5 px-4 bg-[#1F232D] hover:bg-[#2B3140] text-[#FEFEFE] text-xs uppercase border border-[#343C4E] flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Download Free PDF Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. PDF DOWNLOAD LEAD CAPTURE MODAL                                 */}
      {/* ------------------------------------------------------------------ */}
      {pdfDownloadModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#14161C] border border-[#333948] p-6 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#252B3A] mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-sm font-bold text-[#FEFEFE] uppercase">
                  Download Full CAD Blueprint PDF
                </h4>
              </div>
              <button
                onClick={() => setPdfDownloadModal(false)}
                className="p-1 hover:bg-[#262626] text-[#CCCCCC] hover:text-[#FEFEFE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!pdfSuccess ? (
              <form onSubmit={handlePdfSubmit} className="space-y-4">
                <p className="text-xs text-[#AAAAAA] font-sans">
                  Enter your WhatsApp details to receive the high-resolution architectural 2D CAD PDF drawings with complete electrical & plumbing layout for <strong>{plan.title}</strong>.
                </p>

                <div>
                  <label className="block text-[10px] uppercase text-[#CCCCCC] mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Usman Tariq"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2.5 bg-[#0D0F12] border border-[#282E3E] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#CCCCCC] mb-1">WhatsApp Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567 / +44 7..."
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#0D0F12] border border-[#282E3E] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F59E0B] hover:bg-[#d97706] text-[#0A0A0A] font-black text-xs uppercase transition-colors"
                >
                  Send PDF via WhatsApp
                </button>
              </form>
            ) : (
              <div className="space-y-4 py-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h5 className="text-sm font-bold text-[#FEFEFE] uppercase">Blueprint PDF Dispatched!</h5>
                <p className="text-xs text-[#AAAAAA] font-sans">
                  The complete architectural package for {plan.title} has been forwarded to <strong>{userPhone}</strong>.
                </p>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-[#0A0A0A] text-xs font-bold uppercase transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Open in WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
