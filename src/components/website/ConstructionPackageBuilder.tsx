'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { useCMS } from '@/contexts/cms-context';
import { formatPKRPrice } from './PriceDisplay';
import {
  HardHat,
  Calculator,
  CheckCircle2,
  Building,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Hammer,
  Droplets,
  Flame,
  FileText,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sun,
  Wifi,
  Clock,
  Printer
} from 'lucide-react';

interface PlotPreset {
  id: string;
  name: string;
  marla: number;
  dimensions: string;
  baseCoveredArea: number; // in sqft for standard double story
  popularLocation: string;
}

const PLOT_PRESETS: PlotPreset[] = [
  {
    id: '5-marla',
    name: '5 Marla',
    marla: 5,
    dimensions: '25 × 45 ft',
    baseCoveredArea: 2150,
    popularLocation: 'Kohistan Enclave / New City',
  },
  {
    id: '8-marla',
    name: '8 Marla',
    marla: 8,
    dimensions: '30 × 60 ft',
    baseCoveredArea: 3200,
    popularLocation: 'Kohistan Enclave F & I Block',
  },
  {
    id: '10-marla',
    name: '10 Marla',
    marla: 10,
    dimensions: '35 × 70 ft',
    baseCoveredArea: 4200,
    popularLocation: 'Kohistan Enclave Block A & B',
  },
  {
    id: '13-marla',
    name: '13 Marla',
    marla: 13,
    dimensions: '40 × 75 ft',
    baseCoveredArea: 5100,
    popularLocation: 'Kohistan Enclave Executive',
  },
  {
    id: '1-kanal',
    name: '1 Kanal',
    marla: 20,
    dimensions: '50 × 90 ft',
    baseCoveredArea: 7600,
    popularLocation: 'Kohistan Executive / New City',
  },
];

type FloorOption = 'SINGLE' | 'DOUBLE' | 'TRIPLE_BASEMENT';
type QualityTier = 'GREY' | 'APLUS_LUXURY' | 'ULTRA_EXECUTIVE';

interface TierSpec {
  id: QualityTier;
  name: string;
  tagline: string;
  ratePerSqFt: number; // in PKR
  badge: string;
  specs: string[];
}

const QUALITY_TIERS: TierSpec[] = [
  {
    id: 'GREY',
    name: 'Grey Structure Engineering',
    tagline: 'Rock-solid structural core engineered strictly with verified Grade 60 steel and fresh Wah Cement.',
    ratePerSqFt: 2650,
    badge: 'CORE STRUCTURE',
    specs: [
      'Certified Grade 60 Deformed Rebar with mill test reports',
      'Fresh OPC Cement batch procurement from Wah Cement',
      'First-Class Kiln Red Bricks (A-Awal) with water soaking',
      'Lawrencepur coarse river sand & Margalla machine crush',
      'Marble Strip DPC anti-seepage capillary barrier',
      'Heavy-gauge PPRC water supply & Class-D PVC conduits',
      'Termite barrier soil treatment (Bifenthrin spray)',
    ],
  },
  {
    id: 'APLUS_LUXURY',
    name: 'A+ Luxury Turnkey Finishing',
    tagline: 'Complete move-in ready turnkey villa with imported tiles, ash wood doors, and luxury kitchen.',
    ratePerSqFt: 5450,
    badge: 'MOST POPULAR',
    specs: [
      'Everything in Grey Structure Engineering included',
      'Full Spanish & imported 60×120 cm porcelain floor tiles',
      'Solid Ash-wood main door & semi-solid interior doors',
      'Double-glazed thermal break aluminum / UPVC window glazing',
      'Custom modular UV high-gloss kitchen with Granite/Corian tops',
      'Grohe / RAK Ceramics sanitary fittings with vanity units',
      'False ceilings with LED cove lighting & Berger luxury paint',
    ],
  },
  {
    id: 'ULTRA_EXECUTIVE',
    name: 'Ultra-Executive Smart Villa',
    tagline: 'State-of-the-art architectural luxury with Italian marble, smart home automation, and hybrid solar.',
    ratePerSqFt: 6950,
    badge: 'FLAGSHIP LUXURY',
    specs: [
      'Everything in A+ Luxury Turnkey included',
      'Imported Italian Botticino / Greek marble stairs & feature walls',
      'Automated smart lighting, motorized blinds & biometric lock system',
      'Concealed copper piping & drainage for multi-split inverter ACs',
      'Designer glass railings with stainless steel architectural posts',
      'Custom landscaping with outdoor ambient accent illumination',
      'Comprehensive 1-year turnkey structural & MEP warranty',
    ],
  },
];

export const ConstructionPackageBuilder: React.FC = () => {
  const { materialRates } = useCMS();
  const [selectedPlotId, setSelectedPlotId] = useState<string>('10-marla');
  const [customCoveredArea, setCustomCoveredArea] = useState<number>(4200);
  const [floorOption, setFloorOption] = useState<FloorOption>('DOUBLE');
  const [hasRooftopPergola, setHasRooftopPergola] = useState<boolean>(true);
  const [qualityTier, setQualityTier] = useState<QualityTier>('APLUS_LUXURY');

  // Solar & Smart Add-ons
  const [solarCapacity, setSolarCapacity] = useState<number>(10); // in kW: 0, 5, 10, 15
  const [includeSmartAutomation, setIncludeSmartAutomation] = useState<boolean>(true);
  const [includeWaterBore, setIncludeWaterBore] = useState<boolean>(true);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);

  const selectedPreset = PLOT_PRESETS.find((p) => p.id === selectedPlotId);
  const activeTierSpec = QUALITY_TIERS.find((t) => t.id === qualityTier)!;

  const currentTierRatePerSqFt = (() => {
    if (qualityTier === 'GREY') return materialRates?.greyStructureRatePerSqFtPKR || 2650;
    if (qualityTier === 'APLUS_LUXURY') {
      return (materialRates?.greyStructureRatePerSqFtPKR || 2650) + (materialRates?.premiumFinishRatePerSqFtPKR || 2800);
    }
    if (qualityTier === 'ULTRA_EXECUTIVE') {
      return (materialRates?.greyStructureRatePerSqFtPKR || 2650) + (materialRates?.executiveFinishRatePerSqFtPKR || 4300);
    }
    return activeTierSpec.ratePerSqFt;
  })();

  // Calculate covered area multiplier based on floor choice
  let floorMultiplier = 1;
  if (floorOption === 'SINGLE') floorMultiplier = 0.55;
  if (floorOption === 'DOUBLE') floorMultiplier = 1.0;
  if (floorOption === 'TRIPLE_BASEMENT') floorMultiplier = 1.48;

  const baseArea = selectedPreset ? selectedPreset.baseCoveredArea : customCoveredArea;
  const rooftopArea = hasRooftopPergola ? 350 : 0;
  const calculatedCoveredArea = Math.round(baseArea * floorMultiplier + rooftopArea);

  // Core Base Construction Cost
  const baseConstructionCost = calculatedCoveredArea * currentTierRatePerSqFt;

  // Add-on calculations
  let solarCost = 0;
  if (solarCapacity === 5) solarCost = 850000;
  else if (solarCapacity === 10) solarCost = 1450000;
  else if (solarCapacity === 15) solarCost = 2100000;

  const smartAutomationCost = includeSmartAutomation ? 450000 : 0;
  const waterBoreCost = includeWaterBore ? 380000 : 0;

  const totalProjectCost = baseConstructionCost + solarCost + smartAutomationCost + waterBoreCost;
  const effectiveRatePerSqFt = Math.round(totalProjectCost / calculatedCoveredArea);

  // Material Quantity BOQ Calculations (Empirical Engineering Ratios)
  const steelMetricTons = Number(((calculatedCoveredArea * 4.1) / 1000).toFixed(1));
  const cementBags = Math.round(calculatedCoveredArea * 0.43);
  const brickCount = Math.round(calculatedCoveredArea * 20);
  const sandCuFt = Math.round(calculatedCoveredArea * 3.5);
  const crushCuFt = Math.round(calculatedCoveredArea * 2.1);
  const timelineMonths = calculatedCoveredArea < 3000 ? '6 to 7 Months' : calculatedCoveredArea < 5000 ? '8 to 9 Months' : '10 to 12 Months';

  const whatsappText = encodeURIComponent(
    `Hello Asad Land Holdings, I configured a Turnkey House Construction BOQ on your platform:\n\n` +
    `• Plot Size: ${selectedPreset?.name || 'Custom'} (${selectedPreset?.dimensions || ''})\n` +
    `• Covered Area: ${calculatedCoveredArea.toLocaleString()} Sq.Ft (${floorOption.replace('_', ' ')})\n` +
    `• Quality Tier: ${activeTierSpec.name}\n` +
    `• Solar Power: ${solarCapacity > 0 ? `${solarCapacity}kW Hybrid System` : 'None'}\n` +
    `• Smart Home & Bore: ${includeSmartAutomation ? 'Yes' : 'No'} | ${includeWaterBore ? 'Yes' : 'No'}\n` +
    `• Estimated Total: PKR ${(totalProjectCost / 10000000).toFixed(2)} Crore (PKR ${effectiveRatePerSqFt.toLocaleString()}/Sq.Ft)\n` +
    `• Estimated Steel: ${steelMetricTons} Tons | Cement: ${cementBags.toLocaleString()} Bags | Bricks: ${brickCount.toLocaleString()}\n\n` +
    `I want to schedule an engineering meeting with your Chief Civil Engineer for site inspection in Wah Cantt / Islamabad.`
  );

  return (
    <section className="py-20 md:py-28 bg-[#090909] text-[#FEFEFE] border-b border-[#222222] relative overflow-hidden">
      {/* Background Architectural Blueprint Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141414] border border-amber-400/40 text-amber-400 text-[10px] font-mono uppercase tracking-[0.25em] mb-4 shadow">
            <HardHat className="w-3.5 h-3.5" />
            <span>PAIRED WITH &ldquo;PLOT SAY GHAR TAK&rdquo; MASTERCLASS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans">
            HOUSE CONSTRUCTION BOQ & PACKAGE BUILDER <span className="text-amber-400">.</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-sans">
            Configure your plot size, architectural floor layout, material quality tier, and solar automation to calculate exact structural material requirements (Steel, Cement, Bricks, Sand, Crush) and guaranteed turnkey BOQ cost.
          </p>
        </div>

        {/* MAIN 2-COLUMN BUILDER WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT CONFIGURATION CONTROLS (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. PLOT SIZE SELECTOR */}
            <div className="p-6 bg-[#121212] border border-[#242424] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-none bg-amber-400 text-[#000000] flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  SELECT PLOT SIZE & DIMENSIONS
                </span>
                <span className="text-[10px] font-mono text-[#888888]">Wah & Islamabad Standard</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLOT_PRESETS.map((p) => {
                  const isSelected = selectedPlotId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlotId(p.id);
                        setCustomCoveredArea(p.baseCoveredArea);
                        trackEvent('calculator_used', { plotSize: p.name });
                      }}
                      className={`p-3.5 text-left border transition-all ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-[#161616] border-[#2A2A2A] hover:border-[#444444]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold uppercase font-sans ${isSelected ? 'text-amber-400' : 'text-[#FEFEFE]'}`}>
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#888888]">{p.dimensions}</span>
                      </div>
                      <span className="text-[10px] text-[#777777] font-mono block">
                        {p.popularLocation}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. STRUCTURAL FLOORS & SCOPE */}
            <div className="p-6 bg-[#121212] border border-[#242424] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-none bg-amber-400 text-[#000000] flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  STRUCTURAL FLOORS & COVERED AREA
                </span>
                <span className="text-[11px] font-mono font-bold text-[#FEFEFE]">
                  {calculatedCoveredArea.toLocaleString()} Sq.Ft Covered
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 font-mono text-xs">
                {[
                  { key: 'SINGLE', label: 'Single Story', sub: 'Ground Floor Only' },
                  { key: 'DOUBLE', label: 'Double Story', sub: 'Ground + 1st Floor (Standard)' },
                  { key: 'TRIPLE_BASEMENT', label: 'Full Basement + 2 Floors', sub: 'Triple Story Luxury' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFloorOption(f.key as FloorOption)}
                    className={`p-3 text-left border transition-all ${
                      floorOption === f.key
                        ? 'bg-[#1C1C1C] border-amber-400 text-[#FEFEFE]'
                        : 'bg-[#161616] border-[#2A2A2A] text-[#888888] hover:border-[#444444]'
                    }`}
                  >
                    <span className="block font-bold text-xs uppercase text-[#FEFEFE] mb-0.5">{f.label}</span>
                    <span className="block text-[9px] text-[#777777]">{f.sub}</span>
                  </button>
                ))}
              </div>

              {/* Rooftop Pergola Toggle */}
              <label className="flex items-center gap-3 p-3 bg-[#161616] border border-[#2A2A2A] cursor-pointer hover:border-[#3A3A3A] transition-colors">
                <input
                  type="checkbox"
                  checked={hasRooftopPergola}
                  onChange={(e) => setHasRooftopPergola(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                />
                <div className="text-xs font-sans">
                  <span className="font-bold text-[#FEFEFE]">Include Rooftop Servant Quarter + Architectural Pergola</span>
                  <span className="text-[10px] text-[#888888] block font-mono">+350 Sq.Ft Covered Area</span>
                </div>
              </label>
            </div>

            {/* 3. MATERIAL QUALITY & FINISHING TIER */}
            <div className="p-6 bg-[#121212] border border-[#242424] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-none bg-amber-400 text-[#000000] flex items-center justify-center text-[11px] font-black">
                    3
                  </span>
                  CONSTRUCTION & FINISHING TIER
                </span>
                <span className="text-[10px] font-mono text-[#888888]">2026 Wah / Islamabad BOQ Rates</span>
              </div>

              <div className="space-y-3">
                {QUALITY_TIERS.map((tier) => {
                  const isSelected = qualityTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setQualityTier(tier.id)}
                      className={`p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-amber-400 ring-1 ring-amber-400'
                          : 'bg-[#161616] border-[#2A2A2A] hover:border-[#444444]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold uppercase font-sans ${isSelected ? 'text-amber-400' : 'text-[#FEFEFE]'}`}>
                            {tier.name}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#000000] text-[9px] font-mono font-bold text-amber-400 border border-[#333333]">
                            {tier.badge}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-black text-[#FEFEFE]">
                          PKR {tier.ratePerSqFt.toLocaleString()} <span className="text-[10px] font-normal text-[#888888]">/ SqFt</span>
                        </span>
                      </div>

                      <p className="text-xs text-[#999999] leading-relaxed font-sans mb-3">
                        {tier.tagline}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-sans text-[#BBBBBB]">
                        {tier.specs.slice(0, 4).map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. SMART ENERGY & ADD-ONS */}
            <div className="p-6 bg-[#121212] border border-[#242424] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-none bg-amber-400 text-[#000000] flex items-center justify-center text-[11px] font-black">
                    4
                  </span>
                  SMART ENERGY & UTILITY ADD-ONS
                </span>
                <span className="text-[10px] font-mono text-[#888888]">Optional Turnkey Upgrades</span>
              </div>

              {/* Solar System Selector */}
              <div className="mb-4">
                <label className="block text-xs font-mono text-[#A0A0A0] uppercase mb-2 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Hybrid Solar System (Tier-1 Panels + Inverter)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {[
                    { val: 0, label: 'No Solar', price: 'PKR 0' },
                    { val: 5, label: '5kW Hybrid', price: '+8.5 Lakhs' },
                    { val: 10, label: '10kW Hybrid', price: '+14.5 Lakhs' },
                    { val: 15, label: '15kW Hybrid', price: '+21.0 Lakhs' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setSolarCapacity(s.val)}
                      className={`p-2.5 text-left border transition-all ${
                        solarCapacity === s.val
                          ? 'bg-[#1C1C1C] border-amber-400 text-[#FEFEFE]'
                          : 'bg-[#161616] border-[#2A2A2A] text-[#777777] hover:border-[#444444]'
                      }`}
                    >
                      <span className="block font-bold text-[11px] text-[#FEFEFE]">{s.label}</span>
                      <span className="block text-[9px] text-amber-400">{s.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Automation & Bore Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 bg-[#161616] border border-[#2A2A2A] cursor-pointer hover:border-[#3A3A3A] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeSmartAutomation}
                    onChange={(e) => setIncludeSmartAutomation(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                  />
                  <div className="text-xs font-sans">
                    <span className="font-bold text-[#FEFEFE] flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-amber-400" /> Smart Home Automation
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">+PKR 4.5 Lakhs (CCTV & Lighting)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-[#161616] border border-[#2A2A2A] cursor-pointer hover:border-[#3A3A3A] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeWaterBore}
                    onChange={(e) => setIncludeWaterBore(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                  />
                  <div className="text-xs font-sans">
                    <span className="font-bold text-[#FEFEFE] flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> Borehole & Tank (3,500 Gal)
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">+PKR 3.8 Lakhs (Deep Well)</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT LIVE BOQ DOSSIER SUMMARY (5 COLS) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            {/* Total Cost & Executive Card */}
            <div className="border border-amber-400/50 bg-[#121212] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] block">
                    TOTAL ESTIMATED TURNKEY COST
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight mt-1">
                    PKR {(totalProjectCost / 10000000).toFixed(2)} <span className="text-lg font-bold text-[#FEFEFE]">Crore</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase text-[#777777] block">Rate Per SqFt</span>
                  <span className="text-base font-bold text-[#FEFEFE] font-mono">
                    PKR {effectiveRatePerSqFt.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* High-Level Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
                <div className="p-2.5 bg-[#181818] border border-[#282828]">
                  <span className="text-[9px] text-[#888888] block uppercase">Covered Area</span>
                  <span className="font-bold text-[#FEFEFE]">{calculatedCoveredArea.toLocaleString()} Sq.Ft</span>
                </div>
                <div className="p-2.5 bg-[#181818] border border-[#282828]">
                  <span className="text-[9px] text-[#888888] block uppercase">Est. Completion</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timelineMonths}
                  </span>
                </div>
              </div>

              {/* STRUCTURAL MATERIAL QUANTITY BILL (BOQ) */}
              <div className="border border-[#282828] bg-[#0C0C0C] p-4 mb-6">
                <div className="flex items-center justify-between mb-3 font-mono text-[10px] text-amber-400 font-bold uppercase border-b border-[#222222] pb-2">
                  <span>STRUCTURAL MATERIAL ESTIMATE (BOQ)</span>
                  <span>QUANTITY</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#E0E0E0]">
                    <span className="text-[#AAAAAA] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" /> Grade 60 Deformed Steel
                    </span>
                    <span className="font-bold text-[#FEFEFE]">{steelMetricTons} Metric Tons</span>
                  </div>

                  <div className="flex items-center justify-between text-[#E0E0E0]">
                    <span className="text-[#AAAAAA] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-400" /> Wah OPC Cement
                    </span>
                    <span className="font-bold text-[#FEFEFE]">{cementBags.toLocaleString()} Bags</span>
                  </div>

                  <div className="flex items-center justify-between text-[#E0E0E0]">
                    <span className="text-[#AAAAAA] flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-amber-400" /> A-Awal Kiln Bricks
                    </span>
                    <span className="font-bold text-[#FEFEFE]">{brickCount.toLocaleString()} Bricks</span>
                  </div>

                  <div className="flex items-center justify-between text-[#E0E0E0]">
                    <span className="text-[#AAAAAA]">Lawrencepur Coarse Sand</span>
                    <span className="font-bold text-[#FEFEFE]">{sandCuFt.toLocaleString()} Cu.Ft</span>
                  </div>

                  <div className="flex items-center justify-between text-[#E0E0E0]">
                    <span className="text-[#AAAAAA]">Margalla Machine Crush</span>
                    <span className="font-bold text-[#FEFEFE]">{crushCuFt.toLocaleString()} Cu.Ft</span>
                  </div>
                </div>
              </div>

              {/* MILESTONE PAYMENT SCHEDULE PREVIEW */}
              <div className="p-3 bg-[#181818] border border-[#282828] mb-6 font-mono text-[10px]">
                <span className="text-amber-400 font-bold uppercase block mb-1.5">
                  Milestone-Based Construction Billing:
                </span>
                <div className="grid grid-cols-4 gap-1 text-center text-[#888888]">
                  <div className="p-1 bg-[#121212] border border-[#242424]">
                    <span className="block text-[#FEFEFE] font-bold">15%</span>
                    <span>Booking</span>
                  </div>
                  <div className="p-1 bg-[#121212] border border-[#242424]">
                    <span className="block text-[#FEFEFE] font-bold">25%</span>
                    <span>Plinth DPC</span>
                  </div>
                  <div className="p-1 bg-[#121212] border border-[#242424]">
                    <span className="block text-[#FEFEFE] font-bold">35%</span>
                    <span>Structure</span>
                  </div>
                  <div className="p-1 bg-[#121212] border border-[#242424]">
                    <span className="block text-[#FEFEFE] font-bold">25%</span>
                    <span>Finishing</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/923005123456?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('calculator_used', { action: 'whatsapp_boq_sent' })}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-[#000000] font-mono font-black uppercase text-xs text-center flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" /> Send BOQ to Chief Engineer on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => setShowDossierModal(true)}
                  className="w-full py-3 px-4 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-[#FEFEFE] font-mono font-bold uppercase text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-400" /> View & Print Complete Engineering Dossier
                </button>
              </div>

            </div>

            {/* Link back to Plot Say Ghar Tak Masterclass */}
            <div className="p-4 bg-[#141414] border border-[#242424] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[#CCCCCC]">Watch how materials are tested on-site:</span>
              </div>
              <a
                href="#plot-say-ghar-tak"
                className="font-bold text-amber-400 hover:underline uppercase inline-flex items-center gap-1"
              >
                Watch Series →
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* FULL PRINTABLE ENGINEERING DOSSIER MODAL */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FEFEFE] text-[#000000] p-6 sm:p-10 border border-[#000000] shadow-2xl my-8 font-sans">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowDossierModal(false)}
              className="absolute top-4 right-4 p-2 bg-[#000000] text-[#FEFEFE] font-bold text-xs uppercase"
            >
              Close [✕]
            </button>

            {/* Blueprint Header */}
            <div className="border-b-2 border-[#000000] pb-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">
                  ASAD LAND HOLDINGS • CIVIL ENGINEERING DIVISION
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#000000]">
                  OFFICIAL TURNKEY CONSTRUCTION BOQ DOSSIER
                </h3>
                <span className="text-xs font-mono text-[#444444]">
                  Ref Code: ALH-BOQ-{Date.now().toString().slice(-6)} | Date: {new Date().toLocaleDateString('en-GB')}
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#000000] text-[#FEFEFE] font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
            </div>

            {/* Summary Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F4F4F4] border border-[#E5E5E5] mb-6 font-mono text-xs">
              <div>
                <span className="text-[9px] text-[#666666] uppercase block">Plot Configuration</span>
                <span className="font-bold text-[#000000]">{selectedPreset?.name} ({selectedPreset?.dimensions})</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666666] uppercase block">Total Covered Area</span>
                <span className="font-bold text-[#000000]">{calculatedCoveredArea.toLocaleString()} Sq.Ft</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666666] uppercase block">Finishing Tier</span>
                <span className="font-bold text-[#000000]">{activeTierSpec.name}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#666666] uppercase block">Estimated Handover</span>
                <span className="font-bold text-[#000000]">{timelineMonths}</span>
              </div>
            </div>

            {/* Bill of Quantities Items */}
            <div className="mb-6 font-sans">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#000000] mb-3 pb-1 border-b border-[#000000]">
                1. Structural Material Breakdown
              </h4>
              <table className="w-full text-xs text-left border border-[#E5E5E5]">
                <thead className="bg-[#EFEFEF] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5 border">Item Description</th>
                    <th className="p-2.5 border">Engineering Standard</th>
                    <th className="p-2.5 border">Estimated Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] font-mono">
                  <tr>
                    <td className="p-2.5 border font-bold">Deformed Steel Rebar</td>
                    <td className="p-2.5 border text-[#666666]">ASTM A615 Grade 60 (Certified Mill Batch)</td>
                    <td className="p-2.5 border font-bold">{steelMetricTons} Metric Tons</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-bold">Portland Cement (OPC)</td>
                    <td className="p-2.5 border text-[#666666]">Fresh Batch Wah Cement / Bestway</td>
                    <td className="p-2.5 border font-bold">{cementBags.toLocaleString()} Bags</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-bold">First-Class Red Bricks</td>
                    <td className="p-2.5 border text-[#666666]">A-Awal Kiln Burnt (Water Soaked)</td>
                    <td className="p-2.5 border font-bold">{brickCount.toLocaleString()} Bricks</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-bold">Coarse Sand</td>
                    <td className="p-2.5 border text-[#666666]">Lawrencepur Silt-Free River Sand</td>
                    <td className="p-2.5 border font-bold">{sandCuFt.toLocaleString()} Cu.Ft</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-bold">Machine Crush</td>
                    <td className="p-2.5 border text-[#666666]">Margalla 1/2&quot; to 3/4&quot; Graded Stone</td>
                    <td className="p-2.5 border font-bold">{crushCuFt.toLocaleString()} Cu.Ft</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-bold">DPC Moisture Barrier</td>
                    <td className="p-2.5 border text-[#666666]">Anti-Seepage Marble Strip + Bitumen + Polythene</td>
                    <td className="p-2.5 border font-bold">100% Perimeter</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Financial Summary */}
            <div className="p-4 bg-[#000000] text-[#FEFEFE] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs mb-6">
              <div>
                <span className="text-[10px] text-[#A0A0A0] uppercase block">Total Net BOQ Contract Value</span>
                <span className="text-2xl font-black text-amber-400">
                  PKR {totalProjectCost.toLocaleString()} (PKR {(totalProjectCost / 10000000).toFixed(2)} Cr)
                </span>
              </div>
              <div className="text-right font-sans text-xs text-[#CCCCCC]">
                Includes Civil Engineering Supervision, Structural BOQ Warranty, and Milestone-Based Billing.
              </div>
            </div>

            {/* Modal Bottom Sign-off */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5] text-xs font-mono text-[#666666]">
              <span>Asad Land Holdings • Main GT Road, Wah Cantt</span>
              <a
                href={`https://wa.me/923005123456?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] text-[#000000] font-bold uppercase inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Book Consultation with Engr. Hammad Khan
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
