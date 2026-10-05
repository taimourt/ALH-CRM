'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SOCIETY_MASTER_PLANS, 
  SectorBlockData, 
  LandmarkAnchor, 
  SocietyMasterPlan,
  PlotDimensionLegendItem
} from '@/lib/master-plans-data';
import { PriceDisplay } from '@/components/website/PriceDisplay';
import { useCurrency } from '@/contexts/currency-context';
import { 
  Compass, 
  Layers, 
  Zap, 
  Flame, 
  Droplets, 
  Wifi, 
  Route, 
  Maximize2, 
  Minimize2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  MessageSquare, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Navigation, 
  MapPin, 
  X,
  Info,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  FileSpreadsheet,
  Download,
  Eye,
  FileText
} from 'lucide-react';

interface SocietyMapExplorerProps {
  initialSocietySlug?: string;
  initialBlockId?: string;
  isCompact?: boolean;
  className?: string;
}

export function SocietyMapExplorer({
  initialSocietySlug = 'kohistan-enclave-wah',
  initialBlockId,
  isCompact = false,
  className = '',
}: SocietyMapExplorerProps) {
  const { currency } = useCurrency();
  const availableSocieties = Object.values(SOCIETY_MASTER_PLANS);

  // Active Society State
  const [selectedSocietySlug, setSelectedSocietySlug] = useState<string>(
    SOCIETY_MASTER_PLANS[initialSocietySlug] ? initialSocietySlug : 'kohistan-enclave-wah'
  );

  const activePlan: SocietyMasterPlan = useMemo(() => {
    return SOCIETY_MASTER_PLANS[selectedSocietySlug] || SOCIETY_MASTER_PLANS['kohistan-enclave-wah'];
  }, [selectedSocietySlug]);

  // Selected & Hovered Sector State
  const [selectedBlockId, setSelectedBlockId] = useState<string>(() => {
    if (initialBlockId && activePlan.blocks.some(b => b.id === initialBlockId)) {
      return initialBlockId;
    }
    return activePlan.blocks[0]?.id || '';
  });

  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Map Visualization Mode:
  // - 'official_drawing': High-res CAD Layout Drawing by Hadi Safi & Associates with interactive sector hotspots
  // - 'interactive_vector': Crisp CAD Vector Blueprint
  // - 'hybrid_overlay': Official Layout Drawing + Semi-transparent Vector Heatmap Overlay
  const [renderMode, setRenderMode] = useState<'official_drawing' | 'interactive_vector' | 'hybrid_overlay'>('official_drawing');

  // View Mode: Blueprint, Rates Heatmap, Possession %, Utilities Status
  const [viewMode, setViewMode] = useState<'blueprint' | 'rates' | 'possession' | 'utilities'>('rates');

  // Overlay Opacity for Hybrid mode
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);

  // Zoom & Pan state
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Landmark Radius Rings Overlay Toggle
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  // Show Plot Dimension Legend Modal/Drawer
  const [showLegendModal, setShowLegendModal] = useState<boolean>(false);

  // Video Tour Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<{ id: string; title: string } | null>(null);

  // Fullscreen Drawing Lightbox
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState<boolean>(false);

  // Active Selected Block Object
  const activeBlock: SectorBlockData | undefined = useMemo(() => {
    return activePlan.blocks.find(b => b.id === selectedBlockId) || activePlan.blocks[0];
  }, [activePlan, selectedBlockId]);

  // Hovered Block Object (for quick tooltip)
  const hoveredBlock: SectorBlockData | undefined = useMemo(() => {
    if (!hoveredBlockId) return undefined;
    return activePlan.blocks.find(b => b.id === hoveredBlockId);
  }, [activePlan, hoveredBlockId]);

  // Rate range calculations for heatmap
  const { minRate, maxRate } = useMemo(() => {
    const rates = activePlan.blocks.map(b => b.ratePerMarlaPKR);
    return {
      minRate: Math.min(...rates),
      maxRate: Math.max(...rates),
    };
  }, [activePlan]);

  // Switch society helper
  const handleSocietyChange = (slug: string) => {
    setSelectedSocietySlug(slug);
    const newPlan = SOCIETY_MASTER_PLANS[slug];
    if (newPlan && newPlan.blocks.length > 0) {
      setSelectedBlockId(newPlan.blocks[0].id);
    }
    setZoomScale(1);
  };

  // Helper to determine block color based on viewMode
  const getBlockFill = (block: SectorBlockData, isSelected: boolean, isHovered: boolean) => {
    if (viewMode === 'rates') {
      const ratio = maxRate > minRate ? (block.ratePerMarlaPKR - minRate) / (maxRate - minRate) : 0.5;
      if (ratio > 0.75) return isSelected ? '#DC2626' : '#EF4444'; // Top commercial / high-tier
      if (ratio > 0.45) return isSelected ? '#D97706' : '#F59E0B'; // Premium Executive
      if (ratio > 0.2) return isSelected ? '#2563EB' : '#3B82F6';  // Standard Prime
      return isSelected ? '#059669' : '#10B981';                   // Value / Developing
    }

    if (viewMode === 'possession') {
      if (block.possessionPct >= 100) return isSelected ? '#047857' : '#10B981';
      if (block.possessionPct >= 90) return isSelected ? '#B45309' : '#F59E0B';
      return isSelected ? '#C2410C' : '#EA580C';
    }

    if (viewMode === 'utilities') {
      const allConnected = block.utilities.suiGas && block.utilities.undergroundElectricity && block.utilities.waterFiltration;
      if (allConnected) return isSelected ? '#0284C7' : '#0EA5E9';
      return isSelected ? '#D97706' : '#F59E0B';
    }

    // Default Blueprint Mode
    switch (block.category) {
      case 'COMMERCIAL':
        return isSelected ? '#B91C1C' : '#DC2626';
      case 'EXECUTIVE':
        return isSelected ? '#B45309' : '#D97706';
      case 'CIVIC_AMENITY':
        return isSelected ? '#4338CA' : '#6366F1';
      case 'RESIDENTIAL':
      default:
        return isSelected ? '#1E40AF' : '#2563EB';
    }
  };

  const getBlockOpacity = (block: SectorBlockData, isSelected: boolean, isHovered: boolean) => {
    if (renderMode === 'official_drawing') {
      if (isSelected) return 0.55;
      if (isHovered) return 0.45;
      return 0.2;
    }
    if (renderMode === 'hybrid_overlay') {
      if (isSelected) return overlayOpacity;
      if (isHovered) return Math.min(1, overlayOpacity + 0.15);
      return Math.max(0.2, overlayOpacity - 0.2);
    }
    if (isSelected) return 0.95;
    if (isHovered) return 0.85;
    return 0.65;
  };

  // WhatsApp enquiry handler
  const getWhatsAppLink = (block: SectorBlockData) => {
    const text = `Hi Asad Land Holdings, I am inspecting the official Master Plan layout for ${activePlan.societyName} on your platform. I am inquiring about ${block.name} (Avg Rate: PKR ${(block.ratePerMarlaPKR / 100000).toFixed(1)} Lakh/Marla, Possession: ${block.possessionPct}%). Please share current verified plot inventory.`;
    return `https://wa.me/923005123456?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`bg-[#0A0A0A] text-[#FEFEFE] border border-[#262626] rounded-none overflow-hidden ${className}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & OFFICIAL DRAWING METADATA                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 sm:p-6 border-b border-[#262626] bg-[#121212]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 font-bold">
                <Compass className="w-3.5 h-3.5" /> Official Town Plan & Sector Matrix
              </span>
              <span className="text-[10px] font-mono text-[#AAAAAA] uppercase">
                • {activePlan.city} • {activePlan.totalAreaAcres} Acres
              </span>
              {activePlan.officialArchitect && (
                <span className="text-[10px] font-mono text-emerald-400 uppercase hidden md:inline">
                  • Layout by: {activePlan.officialArchitect}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#FEFEFE] flex items-center gap-2">
              <span>{activePlan.societyName}</span>
              <span className="text-xs font-mono font-normal text-[#CCCCCC] hidden sm:inline-block">
                Master Plan GIS Engine
              </span>
            </h2>
          </div>

          {/* Society Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1A1A1A] border border-[#333333]">
            {availableSocieties.map((soc) => {
              const isActive = soc.societySlug === selectedSocietySlug;
              return (
                <button
                  key={soc.id}
                  onClick={() => handleSocietyChange(soc.societySlug)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold shadow-sm'
                      : 'text-[#AAAAAA] hover:text-[#FEFEFE] hover:bg-[#262626]'
                  }`}
                >
                  {soc.societyName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector & Control Bar */}
        <div className="mt-4 pt-4 border-t border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Layout Display Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase text-[#BDBDBD] mr-1 hidden sm:inline">Engine View:</span>
            
            {activePlan.officialMapImage && (
              <button
                onClick={() => setRenderMode('official_drawing')}
                className={`px-2.5 py-1 text-xs border transition-colors flex items-center gap-1.5 ${
                  renderMode === 'official_drawing'
                    ? 'bg-[#F59E0B] text-[#0A0A0A] font-bold border-[#F59E0B]'
                    : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#333333] hover:text-[#FEFEFE]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Official CAD Drawing</span>
              </button>
            )}

            <button
              onClick={() => setRenderMode('hybrid_overlay')}
              className={`px-2.5 py-1 text-xs border transition-colors flex items-center gap-1.5 ${
                renderMode === 'hybrid_overlay'
                  ? 'bg-[#2563EB] text-[#FEFEFE] font-bold border-[#2563EB]'
                  : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#333333] hover:text-[#FEFEFE]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Hybrid GIS Overlay</span>
            </button>

            <button
              onClick={() => setRenderMode('interactive_vector')}
              className={`px-2.5 py-1 text-xs border transition-colors flex items-center gap-1.5 ${
                renderMode === 'interactive_vector'
                  ? 'bg-[#059669] text-[#FEFEFE] font-bold border-[#059669]'
                  : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#333333] hover:text-[#FEFEFE]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vector Blueprint</span>
            </button>
          </div>

          {/* Layer View Mode (Heatmap / Possession / Utilities) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setViewMode('rates')}
              className={`px-2 py-0.5 text-[11px] border transition-colors flex items-center gap-1 ${
                viewMode === 'rates'
                  ? 'bg-[#D97706] text-[#FEFEFE] border-[#D97706]'
                  : 'bg-[#171717] text-[#CCCCCC] border-[#2E2E2E] hover:text-[#FEFEFE]'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Rates Heatmap</span>
            </button>

            <button
              onClick={() => setViewMode('possession')}
              className={`px-2 py-0.5 text-[11px] border transition-colors flex items-center gap-1 ${
                viewMode === 'possession'
                  ? 'bg-[#059669] text-[#FEFEFE] border-[#059669]'
                  : 'bg-[#171717] text-[#CCCCCC] border-[#2E2E2E] hover:text-[#FEFEFE]'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Possession %</span>
            </button>

            <button
              onClick={() => setViewMode('utilities')}
              className={`px-2 py-0.5 text-[11px] border transition-colors flex items-center gap-1 ${
                viewMode === 'utilities'
                  ? 'bg-[#0284C7] text-[#FEFEFE] border-[#0284C7]'
                  : 'bg-[#171717] text-[#CCCCCC] border-[#2E2E2E] hover:text-[#FEFEFE]'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Utilities Matrix</span>
            </button>

            {/* Plot Dimensions Legend Button */}
            {activePlan.plotDimensionsLegend && (
              <button
                onClick={() => setShowLegendModal(true)}
                className="px-2 py-0.5 text-[11px] bg-[#1A1A1A] text-[#F59E0B] border border-[#F59E0B]/40 hover:bg-[#F59E0B]/10 transition-colors flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Plot Sizes Legend</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN INTERACTIVE MAP & INSPECTOR GRID                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#262626]">
        {/* Master Plan Canvas Area (8 Cols) */}
        <div className="lg:col-span-8 relative bg-[#0B0D11] p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-[#262626] overflow-hidden select-none flex flex-col justify-between min-h-[460px] sm:min-h-[580px]">
          
          {/* Engineering Blueprint Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20" 
            style={{
              backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Top Canvas Controls & Zoom Toolbar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#CCCCCC] mb-2 px-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#CCCCCC] uppercase tracking-wider font-bold">
                {activePlan.officialMapTitle || activePlan.societyName}
              </span>
            </div>

            {/* Canvas Zoom & Fullscreen Controls */}
            <div className="flex items-center gap-1.5 bg-[#171717] border border-[#2E2E2E] p-1">
              <button
                onClick={() => setZoomScale(Math.min(2.5, zoomScale + 0.25))}
                title="Zoom In"
                className="p-1 hover:bg-[#2A2A2A] text-[#FEFEFE] transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(Math.max(1, zoomScale - 0.25))}
                title="Zoom Out"
                className="p-1 hover:bg-[#2A2A2A] text-[#FEFEFE] transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                title="Reset Zoom"
                className="p-1 hover:bg-[#2A2A2A] text-[#CCCCCC] hover:text-[#FEFEFE] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-[#333333] mx-0.5" />
              <button
                onClick={() => setFullscreenMapOpen(true)}
                title="Fullscreen Map"
                className="p-1 hover:bg-[#2A2A2A] text-[#F59E0B] transition-colors flex items-center gap-1 text-[10px]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inspect High-Res</span>
              </button>
            </div>
          </div>

          {/* Master Canvas Container */}
          <div 
            className="relative z-10 w-full my-auto flex items-center justify-center overflow-auto max-h-[580px] p-2"
            style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            <div className="relative w-full max-w-[920px] aspect-[1000/700] flex items-center justify-center">
              
              {/* 1. Official Layout Scanned Blueprint Image Background */}
              {(renderMode === 'official_drawing' || renderMode === 'hybrid_overlay') && activePlan.officialMapImage && (
                <div className="absolute inset-0 z-0 w-full h-full">
                  <Image
                    src={activePlan.officialMapImage}
                    alt={activePlan.officialMapTitle || activePlan.societyName}
                    fill
                    className="object-contain filter contrast-[1.1] brightness-[1.02]"
                    priority
                  />
                </div>
              )}

              {/* 2. Interactive SVG Hotspot & Vector Layer */}
              <svg
                viewBox={activePlan.viewBox}
                className="absolute inset-0 z-10 w-full h-full transition-all duration-300"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <radialGradient id="landmarkPulse" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Only render synthetic arterial boulevards in pure vector mode */}
                {renderMode === 'interactive_vector' && (
                  <g className="roads-layer">
                    <rect 
                      x="120" 
                      y="340" 
                      width="760" 
                      height="26" 
                      fill="#1C1E24" 
                      stroke="#333A48" 
                      strokeWidth="1.5" 
                      rx="3"
                    />
                    <line 
                      x1="120" 
                      y1="353" 
                      x2="880" 
                      y2="353" 
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                      strokeDasharray="8 6" 
                      opacity="0.8" 
                    />
                    <text 
                      x="500" 
                      y="357" 
                      fill="#888888" 
                      fontSize="8" 
                      fontFamily="monospace" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      letterSpacing="2"
                    >
                      {activePlan.mainBoulevardText}
                    </text>
                  </g>
                )}

                {/* Landmark Proximity Rings */}
                {showLandmarks && (
                  <g className="landmarks-layer transition-opacity duration-300">
                    <circle cx="500" cy="350" r="160" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,6" opacity="0.2" />
                    <circle cx="500" cy="350" r="280" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4,8" opacity="0.15" />
                    
                    {activePlan.landmarks.map((lm) => (
                      <g key={lm.id} transform={`translate(${lm.x}, ${lm.y})`} className="cursor-pointer group">
                        <circle cx="0" cy="0" r="14" fill="url(#landmarkPulse)" className="animate-ping" opacity="0.4" />
                        <circle cx="0" cy="0" r="6" fill="#F59E0B" stroke="#000" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="2" fill="#000" />
                        
                        <rect 
                          x="-50" 
                          y="-24" 
                          width="100" 
                          height="18" 
                          fill="#0A0A0A" 
                          stroke="#F59E0B" 
                          strokeWidth="1" 
                          rx="2" 
                          opacity="0.9"
                        />
                        <text 
                          x="0" 
                          y="-12" 
                          fill="#FEFEFE" 
                          fontSize="7.5" 
                          fontFamily="monospace" 
                          fontWeight="bold" 
                          textAnchor="middle"
                        >
                          {lm.name.slice(0, 16)} ({lm.distanceKm}km)
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Interactive Sector Hotspots & Polygons */}
                <g className="sectors-layer">
                  {activePlan.blocks.map((block) => {
                    const isSelected = block.id === selectedBlockId;
                    const isHovered = block.id === hoveredBlockId;
                    const fillColor = getBlockFill(block, isSelected, isHovered);
                    const opacity = getBlockOpacity(block, isSelected, isHovered);

                    return (
                      <g
                        key={block.id}
                        onClick={() => setSelectedBlockId(block.id)}
                        onMouseEnter={() => setHoveredBlockId(block.id)}
                        onMouseLeave={() => setHoveredBlockId(null)}
                        className="cursor-pointer transition-all duration-200 group"
                      >
                        {/* Sector Boundary Polygon */}
                        {block.svgPath.type === 'polygon' && block.svgPath.points ? (
                          <polygon
                            points={block.svgPath.points}
                            fill={fillColor}
                            fillOpacity={opacity}
                            stroke={isSelected ? '#FEFEFE' : isHovered ? '#F59E0B' : '#000000'}
                            strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                            strokeLinejoin="round"
                            className="transition-all duration-200 filter group-hover:drop-shadow-lg"
                          />
                        ) : (
                          <rect
                            x={block.svgPath.x || 0}
                            y={block.svgPath.y || 0}
                            width={block.svgPath.width || 100}
                            height={block.svgPath.height || 80}
                            fill={fillColor}
                            fillOpacity={opacity}
                            stroke={isSelected ? '#FEFEFE' : isHovered ? '#F59E0B' : '#000000'}
                            strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                            rx="4"
                            className="transition-all duration-200"
                          />
                        )}

                        {/* Sector Floating Code Badge */}
                        {block.svgPath.cx && block.svgPath.cy && (
                          <g transform={`translate(${block.svgPath.cx}, ${block.svgPath.cy})`} pointerEvents="none">
                            <rect
                              x={isSelected ? -34 : -28}
                              y={isSelected ? -18 : -14}
                              width={isSelected ? 68 : 56}
                              height={isSelected ? 36 : 28}
                              fill="#0A0A0A"
                              fillOpacity="0.92"
                              stroke={isSelected ? '#F59E0B' : '#444444'}
                              strokeWidth={isSelected ? 2 : 1}
                              rx="3"
                            />
                            
                            <text
                              x="0"
                              y={isSelected ? -4 : -2}
                              fill="#FEFEFE"
                              fontSize={isSelected ? "11" : "9.5"}
                              fontFamily="monospace"
                              fontWeight="900"
                              textAnchor="middle"
                            >
                              {block.code}
                            </text>

                            <text
                              x="0"
                              y={isSelected ? 10 : 8}
                              fill={isSelected ? '#F59E0B' : '#CCCCCC'}
                              fontSize={isSelected ? "8.5" : "7"}
                              fontFamily="monospace"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {viewMode === 'possession'
                                ? `${block.possessionPct}% POSS`
                                : viewMode === 'utilities'
                                ? (block.utilities.suiGas ? 'GAS ON' : 'GAS DEV')
                                : `${(block.ratePerMarlaPKR / 100000).toFixed(1)}L/M`}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom Interactive Legend / Status Helper */}
          <div className="relative z-10 mt-3 pt-3 border-t border-[#1C1F26] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#CCCCCC]">
            <div className="flex flex-wrap items-center gap-3">
              {viewMode === 'rates' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase text-[#CCCCCC]">Valuation Scale:</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10B981]" /> Developing</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#3B82F6]" /> Prime Res.</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#F59E0B]" /> Executive</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#EF4444]" /> Commercial Hub</span>
                </div>
              )}
              {viewMode === 'possession' && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#10B981]" /> 100% On-Ground Possessed</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#F59E0B]" /> 90%+ Rapid Construction</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#EA580C]" /> Balloted & Developing</span>
                </div>
              )}
              {viewMode === 'utilities' && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#0EA5E9]" /> 100% Underground Gas & Electric</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#F59E0B]" /> Gas Extension in Progress</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#AAAAAA]">
              * Click any highlighted sector on the drawing to inspect verified inventory
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. SECTOR INSPECTOR PANEL (4 Cols)                                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 bg-[#141414] p-5 sm:p-6 flex flex-col justify-between space-y-6">
          {activeBlock ? (
            <>
              <div>
                {/* Sector Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                        activeBlock.category === 'COMMERCIAL'
                          ? 'bg-red-950/40 text-red-400 border-red-800/40'
                          : activeBlock.category === 'EXECUTIVE'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                          : 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                      }`}>
                        {activeBlock.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#CCCCCC]">
                        {activePlan.societyName}
                      </span>
                    </div>
                    <h3 className="text-xl font-black font-mono text-[#FEFEFE]">
                      {activeBlock.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#CCCCCC] block uppercase">Sector Code</span>
                    <span className="text-lg font-black font-mono text-[#F59E0B]">
                      {activeBlock.code}
                    </span>
                  </div>
                </div>

                {/* Rates & Valuation Section */}
                <div className="my-4 p-3.5 bg-[#1C1C1C] border border-[#2E2E2E]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#CCCCCC] block">
                        Verified Rate Per Marla
                      </span>
                      <div className="text-lg font-black font-mono text-[#FEFEFE] mt-0.5">
                        <PriceDisplay amount={activeBlock.ratePerMarlaPKR} />
                        <span className="text-xs font-normal text-[#CCCCCC] ml-1 font-sans">/ Marla</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#CCCCCC] block">Inventory</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {activeBlock.availablePlots} Available Plots
                      </span>
                    </div>
                  </div>

                  {/* Road Width Badge */}
                  <div className="mt-2.5 pt-2 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono text-[#AAAAAA]">
                    <span className="flex items-center gap-1.5">
                      <Route className="w-3.5 h-3.5 text-[#F59E0B]" /> Boulevard Width:
                    </span>
                    <span className="font-bold text-[#FEFEFE]">{activeBlock.roadWidthFt} Feet Carpeted</span>
                  </div>
                </div>

                {/* Ground Possession Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#CCCCCC] uppercase text-[10px]">Ground Possession Status:</span>
                    <span className="font-bold text-[#FEFEFE]">{activeBlock.possessionStatus}</span>
                  </div>
                  <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        activeBlock.possessionPct >= 100
                          ? 'bg-emerald-500'
                          : activeBlock.possessionPct >= 90
                          ? 'bg-amber-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${activeBlock.possessionPct}%` }}
                    />
                  </div>
                </div>

                {/* Underground Utilities Matrix */}
                <div className="mb-5">
                  <span className="text-[10px] font-mono uppercase text-[#CCCCCC] block mb-2">
                    Underground Utilities & Infrastructure:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className={`p-2 border flex items-center gap-2 ${
                      activeBlock.utilities.undergroundElectricity 
                        ? 'bg-[#182218] border-emerald-900/40 text-emerald-300' 
                        : 'bg-[#221818] border-red-900/40 text-red-400'
                    }`}>
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">Electricity {activeBlock.utilities.undergroundElectricity ? '✓' : '✗'}</span>
                    </div>

                    <div className={`p-2 border flex items-center gap-2 ${
                      activeBlock.utilities.suiGas 
                        ? 'bg-[#182218] border-emerald-900/40 text-emerald-300' 
                        : 'bg-[#221818] border-red-900/40 text-red-400'
                    }`}>
                      <Flame className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">Sui Gas {activeBlock.utilities.suiGas ? '✓' : 'Pending'}</span>
                    </div>

                    <div className={`p-2 border flex items-center gap-2 ${
                      activeBlock.utilities.waterFiltration 
                        ? 'bg-[#182218] border-emerald-900/40 text-emerald-300' 
                        : 'bg-[#221818] border-red-900/40 text-red-400'
                    }`}>
                      <Droplets className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">Water Filter {activeBlock.utilities.waterFiltration ? '✓' : '✗'}</span>
                    </div>

                    <div className={`p-2 border flex items-center gap-2 ${
                      activeBlock.utilities.opticalFiber 
                        ? 'bg-[#182218] border-emerald-900/40 text-emerald-300' 
                        : 'bg-[#221818] border-red-900/40 text-red-400'
                    }`}>
                      <Wifi className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px]">Fiber Optic {activeBlock.utilities.opticalFiber ? '✓' : '✗'}</span>
                    </div>
                  </div>
                </div>

                {/* Plot Sizes Available */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-[#CCCCCC] block mb-1.5">
                    Available Plot Cuttings:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {activeBlock.plotSizes.map((size, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#1F1F1F] border border-[#333333] text-[#FEFEFE]">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features Bullet List */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-[#CCCCCC] block mb-1.5">
                    On-Ground Features & Landmarks:
                  </span>
                  <ul className="space-y-1 text-xs text-[#AAAAAA] font-sans">
                    {activeBlock.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#F59E0B] font-mono text-xs">▸</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Linked On-Ground Video Walkthrough */}
                {activeBlock.linkedVideoId && (
                  <div className="p-3 bg-[#1A1A1A] border border-[#333333] mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-[#F59E0B] flex items-center gap-1 font-bold">
                        <Play className="w-3 h-3 fill-current" /> Sector Walkthrough Tour
                      </span>
                    </div>
                    <p className="text-xs text-[#CCCCCC] font-sans line-clamp-1 mb-2">
                      {activeBlock.linkedVideoTitle || `Ground reality inspection of ${activeBlock.name}`}
                    </p>
                    <button
                      onClick={() => setActiveVideoModal({
                        id: activeBlock.linkedVideoId!,
                        title: activeBlock.linkedVideoTitle || `${activeBlock.name} Walkthrough`
                      })}
                      className="w-full py-1.5 px-3 bg-[#262626] hover:bg-[#333333] text-[#FEFEFE] text-xs font-mono uppercase flex items-center justify-center gap-1.5 border border-[#444444] transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-red-500 fill-current" /> Watch Ground Video
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom WhatsApp CTA Button */}
              <div className="pt-2 border-t border-[#262626]">
                <a
                  href={getWhatsAppLink(activeBlock)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Inquire for {activeBlock.name} Plots</span>
                </a>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-[#CCCCCC] font-mono text-xs">
              Select a sector from the blueprint to inspect details
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. ALL SECTORS QUICK COMPARISON GRID TABLE                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 sm:p-6 bg-[#0E0E0E]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F59E0B]" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#FEFEFE] font-bold">
              {activePlan.societyName} — Sector Valuation & Availability Matrix
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#CCCCCC]">
            {activePlan.blocks.length} Sectors Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262626] text-[10px] text-[#CCCCCC] uppercase">
                <th className="pb-2.5 font-normal">Sector / Block</th>
                <th className="pb-2.5 font-normal">Category</th>
                <th className="pb-2.5 font-normal">Avg Rate / Marla</th>
                <th className="pb-2.5 font-normal">Ground Possession</th>
                <th className="pb-2.5 font-normal">Utilities (Gas/Elec)</th>
                <th className="pb-2.5 font-normal">Available Inventory</th>
                <th className="pb-2.5 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {activePlan.blocks.map((block) => {
                const isSelected = block.id === selectedBlockId;
                return (
                  <tr
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#1C1C1C] text-[#FEFEFE]' : 'hover:bg-[#141414] text-[#AAAAAA]'
                    }`}
                  >
                    <td className="py-3 font-bold text-[#FEFEFE] flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-[#262626] border border-[#333333] text-[10px] text-[#F59E0B]">
                        {block.code}
                      </span>
                      <span>{block.name}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 border ${
                        block.category === 'COMMERCIAL'
                          ? 'text-red-400 border-red-900/50'
                          : block.category === 'EXECUTIVE'
                          ? 'text-amber-400 border-amber-900/50'
                          : 'text-blue-400 border-blue-900/50'
                      }`}>
                        {block.category}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-[#FEFEFE]">
                      <PriceDisplay amount={block.ratePerMarlaPKR} />
                    </td>
                    <td className="py-3">
                      <span className={`text-[11px] ${block.possessionPct >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {block.possessionPct}% ({block.possessionStatus.split(' ')[0]})
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] text-[#CCCCCC]">
                        {block.utilities.suiGas && block.utilities.undergroundElectricity ? '⚡ Gas & Elec Active' : '⚡ Electricity Ready'}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">
                      {block.availablePlots} Plots
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                        }}
                        className={`px-2.5 py-1 text-[10px] uppercase font-mono border transition-colors ${
                          isSelected
                            ? 'bg-[#FEFEFE] text-[#0A0A0A] border-[#FEFEFE] font-bold'
                            : 'bg-transparent text-[#CCCCCC] border-[#333333] hover:text-[#FEFEFE]'
                        }`}
                      >
                        {isSelected ? 'Inspecting' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. PLOT SIZES & DIMENSIONS LEGEND MODAL                            */}
      {/* ------------------------------------------------------------------ */}
      {showLegendModal && activePlan.plotDimensionsLegend && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#121212] border border-[#333333] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-base font-bold font-mono text-[#FEFEFE] uppercase">
                  {activePlan.societyName} • Official Plot Dimensions & Zoning Legend
                </h3>
              </div>
              <button
                onClick={() => setShowLegendModal(false)}
                className="p-1 hover:bg-[#262626] text-[#AAAAAA] hover:text-[#FEFEFE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#262626] text-[10px] text-[#CCCCCC] uppercase">
                    <th className="pb-2 font-normal">Plot Category</th>
                    <th className="pb-2 font-normal">Exact Dimensions</th>
                    <th className="pb-2 font-normal">Valuation Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {activePlan.plotDimensionsLegend.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1A1A1A]">
                      <td className="py-2.5 font-bold text-[#FEFEFE] flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-sm shrink-0 border border-white/20"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-2.5 text-[#AAAAAA]">
                        {item.dimension}
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">
                        {item.avgPriceRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#BDBDBD]">
                Official Blueprint Dimensions by Hadi Safi & Associates
              </span>
              <button
                onClick={() => setShowLegendModal(false)}
                className="px-4 py-1.5 bg-[#FEFEFE] text-[#0A0A0A] text-xs font-mono uppercase font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. FULLSCREEN HIGH-RES LIGHTBOX MODAL                              */}
      {/* ------------------------------------------------------------------ */}
      {fullscreenMapOpen && activePlan.officialMapImage && (
        <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#333333] text-xs font-mono text-[#FEFEFE]">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold uppercase tracking-wider">{activePlan.officialMapTitle || activePlan.societyName}</span>
              <span className="text-[#CCCCCC] hidden sm:inline">• High-Resolution Master Plan Blueprint</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={activePlan.officialMapImage}
                download="Kohistan-Enclave-Master-Plan-Official.jpg"
                className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#FEFEFE] border border-[#333333] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Full Blueprint</span>
              </a>
              <button
                onClick={() => setFullscreenMapOpen(false)}
                className="p-1.5 hover:bg-[#262626] text-[#AAAAAA] hover:text-[#FEFEFE] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 w-full my-4 overflow-auto flex items-center justify-center">
            <div className="relative w-full h-full max-h-[85vh]">
              <Image
                src={activePlan.officialMapImage}
                alt={activePlan.officialMapTitle || activePlan.societyName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#333333] flex items-center justify-between text-[11px] font-mono text-[#CCCCCC]">
            <span>Project of Kohistan Builders and Developers • Hadi Safi & Associates</span>
            <button
              onClick={() => setFullscreenMapOpen(false)}
              className="px-4 py-1.5 bg-[#262626] hover:bg-[#333333] text-[#FEFEFE] uppercase"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. VIDEO WALKTHROUGH MODAL POPUP                                   */}
      {/* ------------------------------------------------------------------ */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#121212] border border-[#333333] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500 fill-current" />
                <h4 className="text-sm font-bold font-mono text-[#FEFEFE] uppercase">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 hover:bg-[#262626] text-[#AAAAAA] hover:text-[#FEFEFE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-[#000000]">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal.id}?autoplay=1&rel=0`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-[#0A0A0A] flex items-center justify-between">
              <span className="text-xs font-mono text-[#CCCCCC]">
                Ground inspection footage by Asad Land Holdings
              </span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-1.5 bg-[#262626] hover:bg-[#333333] text-[#FEFEFE] text-xs font-mono uppercase"
              >
                Close Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
