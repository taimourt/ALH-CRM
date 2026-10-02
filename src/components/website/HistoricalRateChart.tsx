'use client';

import React, { useState, useMemo } from 'react';
import { 
  HISTORICAL_RATE_INDEX, 
  SocietyPlotRateIndex, 
  YearlyRateDataPoint 
} from '@/lib/rate-index-data';
import { PriceDisplay } from '@/components/website/PriceDisplay';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Layers, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HistoricalRateChartProps {
  initialSocietySlug?: string;
  initialPlotSize?: '5_MARLA' | '10_MARLA' | '1_KANAL' | 'COMMERCIAL_4_MARLA';
  className?: string;
}

export function HistoricalRateChart({
  initialSocietySlug = 'kohistan-enclave-wah',
  initialPlotSize = '10_MARLA',
  className = '',
}: HistoricalRateChartProps) {
  const [selectedSocietySlug, setSelectedSocietySlug] = useState<string>(initialSocietySlug);
  const [selectedPlotSize, setSelectedPlotSize] = useState<'5_MARLA' | '10_MARLA' | '1_KANAL' | 'COMMERCIAL_4_MARLA'>(initialPlotSize);
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  // Filter available indices for the selected society
  const availableIndices = useMemo(() => {
    return HISTORICAL_RATE_INDEX.filter(item => item.societySlug === selectedSocietySlug);
  }, [selectedSocietySlug]);

  // Active Index
  const activeIndex: SocietyPlotRateIndex = useMemo(() => {
    const found = availableIndices.find(item => item.plotSize === selectedPlotSize);
    return found || availableIndices[0] || HISTORICAL_RATE_INDEX[0];
  }, [availableIndices, selectedPlotSize]);

  // Hovered Year Data
  const activeYearData: YearlyRateDataPoint = useMemo(() => {
    if (!hoveredYear) return activeIndex.historical5Year[activeIndex.historical5Year.length - 1];
    return activeIndex.historical5Year.find(y => y.year === hoveredYear) || activeIndex.historical5Year[activeIndex.historical5Year.length - 1];
  }, [activeIndex, hoveredYear]);

  // Calculate SVG Chart Dimensions & Coordinates
  const chartHeight = 260;
  const chartWidth = 600;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  const minVal = useMemo(() => {
    const allVals = activeIndex.historical5Year.flatMap(d => [d.realTransactionRatePKR, d.portalAskingRatePKR]);
    return Math.min(...allVals) * 0.85;
  }, [activeIndex]);

  const maxVal = useMemo(() => {
    const allVals = activeIndex.historical5Year.flatMap(d => [d.realTransactionRatePKR, d.portalAskingRatePKR]);
    return Math.max(...allVals) * 1.1;
  }, [activeIndex]);

  const getX = (idx: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (idx / (activeIndex.historical5Year.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - padding.top - padding.bottom;
    const ratio = (val - minVal) / (maxVal - minVal);
    return chartHeight - padding.bottom - ratio * usableHeight;
  };

  // Generate SVG Path Strings for Real & Portal Lines
  const realLinePath = useMemo(() => {
    return activeIndex.historical5Year
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.realTransactionRatePKR)}`)
      .join(' ');
  }, [activeIndex, minVal, maxVal]);

  const portalLinePath = useMemo(() => {
    return activeIndex.historical5Year
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.portalAskingRatePKR)}`)
      .join(' ');
  }, [activeIndex, minVal, maxVal]);

  // Shaded Polygon for Speculative Bubble Gap
  const spreadPolygonPath = useMemo(() => {
    const forward = activeIndex.historical5Year.map((d, i) => `${getX(i)},${getY(d.portalAskingRatePKR)}`);
    const backward = [...activeIndex.historical5Year].reverse().map((d, i) => {
      const origIndex = activeIndex.historical5Year.length - 1 - i;
      return `${getX(origIndex)},${getY(d.realTransactionRatePKR)}`;
    });
    return `M ${forward.join(' L ')} L ${backward.join(' L ')} Z`;
  }, [activeIndex, minVal, maxVal]);

  return (
    <div className={`bg-[#0D0F12] text-[#FEFEFE] border border-[#262626] font-mono select-none overflow-hidden ${className}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. CHART HEADER & SWITCHERS                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 sm:p-6 border-b border-[#262626] bg-[#14161B]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-bold">
                <TrendingUp className="w-3 h-3" /> 5-Year Empirical Historical Rate Index
              </span>
              <span className="text-[10px] text-[#888888] uppercase">
                • Registered Stamp Deeds vs. Classified Portals
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#FEFEFE]">
              {activeIndex.societyName} <span className="text-[#888888] font-normal text-sm sm:text-base">({activeIndex.plotSizeLabel})</span>
            </h3>
          </div>

          {/* Society Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1A1C22] border border-[#333742]">
            <button
              onClick={() => setSelectedSocietySlug('kohistan-enclave-wah')}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                selectedSocietySlug === 'kohistan-enclave-wah'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold shadow-sm'
                  : 'text-[#AAAAAA] hover:text-[#FEFEFE]'
              }`}
            >
              Kohistan Enclave
            </button>
            <button
              onClick={() => setSelectedSocietySlug('new-city-phase-2-wah')}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                selectedSocietySlug === 'new-city-phase-2-wah'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold shadow-sm'
                  : 'text-[#AAAAAA] hover:text-[#FEFEFE]'
              }`}
            >
              New City Phase 2
            </button>
            <button
              onClick={() => setSelectedSocietySlug('multi-gardens-b17-islamabad')}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                selectedSocietySlug === 'multi-gardens-b17-islamabad'
                  ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold shadow-sm'
                  : 'text-[#AAAAAA] hover:text-[#FEFEFE]'
              }`}
            >
              Multi Gardens B-17
            </button>
          </div>
        </div>

        {/* Plot Size Category Filter Pills */}
        <div className="mt-4 pt-3 border-t border-[#22252E] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase text-[#777777] mr-1">Plot Category:</span>
            {availableIndices.map((item) => {
              const isSelected = item.plotSize === selectedPlotSize;
              return (
                <button
                  key={item.plotSize}
                  onClick={() => setSelectedPlotSize(item.plotSize)}
                  className={`px-2.5 py-1 text-xs border transition-colors ${
                    isSelected
                      ? 'bg-[#F59E0B] text-[#0A0A0A] font-bold border-[#F59E0B]'
                      : 'bg-[#17191F] text-[#AAAAAA] border-[#2A2E38] hover:text-[#FEFEFE]'
                  }`}
                >
                  {item.plotSize === '5_MARLA' ? '5 Marla' : item.plotSize === '10_MARLA' ? '10 Marla' : item.plotSize === '1_KANAL' ? '1 Kanal' : '4 Marla Commercial'}
                </button>
              );
            })}
          </div>

          {/* Legend Markers */}
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded-sm" />
              <span className="text-emerald-400 font-bold">ALH Real Rate (Closing)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-red-400 border-b border-dashed border-red-400" />
              <span className="text-red-400">Portal Asking (Hype)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. DUAL INTERACTIVE SVG CHART & MILESTONES                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Chart Vector (8 Cols) */}
        <div className="lg:col-span-8 relative bg-[#090B0E] p-4 border border-[#22252E] rounded-none">
          {/* Engineering Blueprint Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-15" 
            style={{
              backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible relative z-10">
            <defs>
              <linearGradient id="speculativeGapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((fraction, idx) => {
              const val = minVal + fraction * (maxVal - minVal);
              const y = getY(val);
              return (
                <g key={idx}>
                  <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#1E232F" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={padding.left - 8} y={y + 3} fill="#555E70" fontSize="8" textAnchor="end" fontFamily="monospace">
                    PKR {(val / 100000).toFixed(0)}L
                  </text>
                </g>
              );
            })}

            {/* Speculative Spread Shaded Gap Area */}
            <path d={spreadPolygonPath} fill="url(#speculativeGapGradient)" />

            {/* Speculative Portal Asking Line (Dotted Red) */}
            <path
              d={portalLinePath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />

            {/* ALH Real Rate Line (Solid Vibrant Green) */}
            <path
              d={realLinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Year Points & Interactive Hover Columns */}
            {activeIndex.historical5Year.map((d, idx) => {
              const x = getX(idx);
              const yReal = getY(d.realTransactionRatePKR);
              const yPortal = getY(d.portalAskingRatePKR);
              const isHovered = hoveredYear === d.year || (!hoveredYear && idx === activeIndex.historical5Year.length - 1);

              return (
                <g
                  key={d.year}
                  onMouseEnter={() => setHoveredYear(d.year)}
                  className="cursor-pointer group"
                >
                  {/* Vertical Guide Line on Hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={chartHeight - padding.bottom}
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Portal Ask Point (Red Triangle/Circle) */}
                  <circle
                    cx={x}
                    cy={yPortal}
                    r={isHovered ? 5 : 3.5}
                    fill="#EF4444"
                    stroke="#0A0A0A"
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  {/* Real Rate Point (Green Circle) */}
                  <circle
                    cx={x}
                    cy={yReal}
                    r={isHovered ? 6 : 4.5}
                    fill="#10B981"
                    stroke="#0A0A0A"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* Year X-Axis Label */}
                  <text
                    x={x}
                    y={chartHeight - padding.bottom + 20}
                    fill={isHovered ? '#F59E0B' : '#717D96'}
                    fontSize={isHovered ? '11' : '9.5'}
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {d.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Year Empirical Deep-Dive (4 Cols) */}
        <div className="lg:col-span-4 bg-[#14161B] p-5 border border-[#262A36] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#22252E]">
            <div>
              <span className="text-[10px] uppercase text-[#888888] block">Audited Fiscal Year</span>
              <span className="text-xl font-black text-[#F59E0B]">{activeYearData.year} Transaction Benchmark</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase text-[#888888] block">Trade Volume</span>
              <span className="text-xs font-bold text-emerald-400">{activeYearData.volumeDeals} Registered Deeds</span>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0D0F12] border border-[#1E212B]">
              <span className="text-[#AAAAAA]">ALH Real Closing Rate:</span>
              <span className="font-bold text-emerald-400 text-sm">
                <PriceDisplay amount={activeYearData.realTransactionRatePKR} />
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0D0F12] border border-[#1E212B]">
              <span className="text-[#AAAAAA]">Speculative Portal Demand:</span>
              <span className="font-bold text-red-400 line-through">
                <PriceDisplay amount={activeYearData.portalAskingRatePKR} />
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-red-950/20 border border-red-900/40 text-red-300">
              <span className="font-bold">Speculative Markup (Hype Gap):</span>
              <span className="font-black text-red-400 text-sm">
                +{activeYearData.speculativeSpreadPct.toFixed(1)}% Markup
              </span>
            </div>
          </div>

          {/* Year Milestone Description */}
          <div className="p-3 bg-[#171920] border border-[#262A36]">
            <span className="text-[10px] uppercase text-[#F59E0B] font-bold block mb-1">
              📍 Ground Reality Milestone ({activeYearData.year}):
            </span>
            <p className="text-xs text-[#CCCCCC] font-sans leading-relaxed">
              {activeYearData.milestone}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CORE METRICS KPI BANNER                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 sm:p-6 bg-[#111317] border-t border-[#22252E] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-3 bg-[#171A21] border border-[#262A36]">
          <span className="text-[10px] text-[#888888] uppercase block mb-1">5-Year Compound Growth</span>
          <span className="text-lg font-black text-emerald-400">+{activeIndex.cagr5Year}% CAGR</span>
          <span className="text-[10px] text-[#666666] block mt-0.5">Real on-ground capital gain</span>
        </div>

        <div className="p-3 bg-[#171A21] border border-[#262A36]">
          <span className="text-[10px] text-[#888888] uppercase block mb-1">Avg Direct Buyer Savings</span>
          <div className="text-lg font-black text-[#F59E0B]">
            <PriceDisplay amount={activeIndex.averageBuyerSavingsPKR} />
          </div>
          <span className="text-[10px] text-[#666666] block mt-0.5">Below speculative asking</span>
        </div>

        <div className="p-3 bg-[#171A21] border border-[#262A36]">
          <span className="text-[10px] text-[#888888] uppercase block mb-1">Liquidity Velocity</span>
          <span className="text-lg font-black text-[#38BDF8]">{activeIndex.liquidityScore} / 10</span>
          <span className="text-[10px] text-[#666666] block mt-0.5">Instant plot resale absorption</span>
        </div>

        <div className="p-3 bg-[#171A21] border border-[#262A36]">
          <span className="text-[10px] text-[#888888] uppercase block mb-1">Verified Real Valuation</span>
          <div className="text-lg font-black text-[#FEFEFE]">
            <PriceDisplay amount={activeIndex.currentAverageRealRatePKR} />
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Current 2026 registered deed</span>
        </div>
      </div>
    </div>
  );
}
