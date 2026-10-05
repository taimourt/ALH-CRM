import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { EditorialHeading } from '@/components/website/EditorialHeading';
import { SectionHeading } from '@/components/website/SectionHeading';
import { FlowLines } from '@/components/website/FlowLines';
import { ArchitecturalLine } from '@/components/website/ArchitecturalLine';
import { Button, OutlineButton } from '@/components/website/Button';
import { PropertyCard } from '@/components/website/PropertyCard';
import { SocietyCard } from '@/components/website/SocietyCard';
import { AgentCard } from '@/components/website/AgentCard';
import { CTASection } from '@/components/website/CTASection';
import { StatBlock } from '@/components/website/StatBlock';
import { SignatureAccent } from '@/components/website/SignatureAccent';
import { ShortsSlider } from '@/components/website/ShortsSlider';
import { ConstructionSeriesSection } from '@/components/website/ConstructionSeriesSection';
import { ConstructionPackageBuilder } from '@/components/website/ConstructionPackageBuilder';
import { PROPERTIES_DATA, SOCIETIES_DATA, INVESTMENT_REPORTS, VIDEOS_DATA, STANDARD_VIDEOS_DATA, AGENTS_DATA } from '@/lib/website-data';


import { RealRateTicker } from '@/components/website/RealRateTicker';
import { HistoricalRateChart } from '@/components/website/HistoricalRateChart';
import { generateOrganizationSchema } from '@/lib/seo';
import { ShieldCheck, TrendingUp, Compass, Calculator, Play, ArrowRight, CheckCircle2, Scale } from 'lucide-react';





export const metadata: Metadata = {
  title: 'Asad Land Holdings — Real Estate on Real Rates | Wah Cantt & Islamabad',
  description: 'Official platform of Asad Land Holdings. Premium real-estate investment, sales, transparent property valuation, and architectural construction in Wah Cantt, Taxila, and Islamabad.',
  openGraph: {
    title: 'Asad Land Holdings — Real Estate on Real Rates',
    description: 'Empirical market intelligence, verified plot rates, and turnkey construction engineering in Wah Cantt and Islamabad.',
    url: 'https://asadlandholdings.com',
    siteName: 'Asad Land Holdings',
  },
};

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const featuredProperties = PROPERTIES_DATA.filter(p => p.isFeatured).slice(0, 3);
  const featuredSocieties = SOCIETIES_DATA.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* HERO SECTION                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-[#FEFEFE] pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-[#E5E5E5]">
        <FlowLines opacity={0.35} variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#000000] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-[0.25em] mb-6">
                <span>Wah Cantt • Taxila • Islamabad</span>
              </div>

              <EditorialHeading size="2xl" className="mb-6">
                REAL ESTATE<br />
                ON REAL RATES.
              </EditorialHeading>

              <p className="text-base sm:text-lg text-[#444444] leading-relaxed max-w-2xl font-normal mb-8">
                Asad Land Holdings provides empirical market intelligence, verified title deeds, and architectural precision to help individuals and institutional investors discover, evaluate, and acquire real estate based on actual transaction values.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="/properties" variant="primary" size="lg">
                  EXPLORE PROPERTIES
                </Button>
                <OutlineButton href="/find-property" size="lg">
                  FIND MY PROPERTY
                </OutlineButton>
              </div>

              {/* Hero Architectural Metric Line */}
              <div className="mt-12 pt-8 border-t border-[#E5E5E5] grid grid-cols-3 gap-6 font-mono text-xs">
                <div>
                  <span className="block text-[10px] text-[#666666] uppercase">Valuation Accuracy</span>
                  <span className="text-lg font-black text-[#000000]">100% Real</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#666666] uppercase">Active Societies</span>
                  <span className="text-lg font-black text-[#000000]">5+ Key Hubs</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#666666] uppercase">Verified Titles</span>
                  <span className="text-lg font-black text-[#000000]">CDA / RDA Clear</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: High-End Architectural Line Drawing Motif */}
            <div className="lg:col-span-5 relative">
              <div className="border border-[#000000] p-8 bg-[#FEFEFE] shadow-2xl relative">
                <div className="w-full aspect-square border border-[#E5E5E5] p-6 flex flex-col justify-between relative overflow-hidden bg-[#F4F4F4]/50">
                  
                  {/* Subtle Background Structural Grid */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Top Architectural Blueprint Header */}
                  <div className="flex items-center justify-between border-b border-[#000000] pb-3 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] font-bold">
                      ARCHITECTURAL BLUEPRINT
                    </span>
                    <span className="text-[10px] font-mono text-[#666666]">
                      REF: ALH-2026-WAH
                    </span>
                  </div>

                  {/* Central Architectural SVG Motif */}
                  <div className="my-auto py-8 text-[#000000] flex justify-center z-10">
                    <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" className="w-full max-w-[280px] h-auto">
                      {/* Roof structure line art */}
                      <path d="M20 100 L100 20 L180 100" strokeWidth="1.5" strokeLinecap="square" />
                      <path d="M35 88 L100 35 L165 88" strokeWidth="0.75" strokeDasharray="3 3" />
                      {/* Base structure lines */}
                      <path d="M30 140 H170" strokeWidth="1.5" />
                      <path d="M40 100 V140" strokeWidth="1" />
                      <path d="M75 100 V140" strokeWidth="1" />
                      <path d="M125 100 V140" strokeWidth="1" />
                      <path d="M160 100 V140" strokeWidth="1" />
                      {/* Wave contour flow lines */}
                      <path d="M10 150 Q100 120 190 150" strokeWidth="0.5" />
                      <path d="M10 135 Q100 105 190 135" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                  </div>

                  {/* Bottom Blueprint Footer */}
                  <div className="border-t border-[#000000] pt-3 flex items-center justify-between font-mono text-[9px] uppercase text-[#000000] z-10">
                    <span>ASAD LAND HOLDINGS</span>
                    <span className="font-bold">VERIFIED REAL RATES</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-[#000000] text-[#FEFEFE] px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold border border-[#000000]">
                  ARCHITECTURAL PRECISION
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* LIVE REAL-RATE TICKER BANNER                                       */}
      {/* ------------------------------------------------------------------ */}
      <RealRateTicker />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: FEATURED PROPERTIES                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#FEFEFE] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading
              eyebrow="Empirical Listings"
              title="Featured Real-Rate Properties"
              subtitle="Directly verified inventory in Kohistan Enclave, New City Phase 2, and B-17 with exact plot details."
              className="mb-0 max-w-2xl"
            />
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#000000] hover:underline mt-4 md:mt-0"
            >
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GROUND REALITY VIDEO SHORTS FEED SLIDER (PLAY ON HOVER)            */}
      {/* ------------------------------------------------------------------ */}
      <ShortsSlider />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: SOCIETIES WE COVER                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#F4F4F4] border-b border-[#E5E5E5] relative overflow-hidden">
        <FlowLines opacity={0.2} variant="subtle" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Geographic Coverage"
            title="Societies Under Our Coverage"
            subtitle="Deep market coverage across Wah Cantt, Taxila, and Islamabad Zone 2 housing developments."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {featuredSocieties.map((soc) => (
              <SocietyCard key={soc.id} society={soc} />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button href="/societies" variant="secondary" size="md">
              View All Covered Societies
            </Button>
            <Button href="/societies/map-explorer" variant="primary" size="md" className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F59E0B]" />
              <span>🗺️ Interactive Sector Map Explorer</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: INVESTMENT INTELLIGENCE & REAL VS SPECULATIVE INDEX     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#FEFEFE] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Market Economics"
                title="Real Rates vs. Speculative Files"
                subtitle="Why paper files lose liquidity while on-ground possessed land yields steady 16%-22% annualized capital gains."
                className="mb-6"
              />

              <div className="space-y-4 font-sans text-xs sm:text-sm text-[#444444] mb-8">
                <div className="p-4 border border-[#E5E5E5] bg-[#F4F4F4]">
                  <div className="font-bold text-[#000000] uppercase font-mono mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#000000]" /> Verified Possessed Plots
                  </div>
                  <p className="text-[#666666]">
                    Immediate construction rights, active gas & electricity, and zero risk of file cancellations.
                  </p>
                </div>

                <div className="p-4 border border-[#E5E5E5] bg-[#FEFEFE]">
                  <div className="font-bold text-[#000000] uppercase font-mono mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#000000]" /> Empirical Rental Returns
                  </div>
                  <p className="text-[#666666]">
                    Wah Cantt educational hub creates consistent 7.5%+ rental yields for 10 Marla and 1 Kanal villas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button href="/investment" variant="primary" size="md">
                  Read Market Reports
                </Button>
                <Button href="/investment/rate-index" variant="secondary" size="md" className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Real Rate Index</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatBlock
                value="18.4%"
                label="Kohistan Enclave CAGR"
                sublabel="5-Year compound annual growth rate for Block A residential plots."
              />
              <StatBlock
                value="8.2%"
                label="Peak Rental Yield"
                sublabel="Achieved on modern turnkey villas in New City Phase 2."
              />
              <StatBlock
                value="100%"
                label="Title Verification"
                sublabel="Every listed property is checked with CDA/RDA or Cantt Board."
              />
              <StatBlock
                value="14+ Yrs"
                label="Wah Market Presence"
                sublabel="Direct transaction experience and deep land ownership records."
              />
            </div>
          </div>

          {/* Interactive 5-Year Rate Index Chart Embedded */}
          <div className="pt-8 border-t border-[#E5E5E5]">
            <HistoricalRateChart />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4: PROPERTY FINDER INTERACTIVE WIZARD PREVIEW              */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#000000] text-[#FEFEFE] border-b border-[#222222] relative overflow-hidden">
        <FlowLines opacity={0.15} variant="hero" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="w-10 h-10 text-[#FEFEFE] mx-auto mb-4" />

          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#FEFEFE] mb-4">
            FIND YOUR PERFECT PROPERTY MATCH
          </h2>

          <p className="text-sm text-[#BDBDBD] max-w-xl mx-auto mb-10 leading-relaxed">
            Answer 4 simple questions regarding your intended location, budget, and plot size to receive curated real-rate options.
          </p>

          <div className="bg-[#111111] border border-[#333333] p-8 text-left font-mono max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-[10px] text-[#CCCCCC] uppercase mb-1">Target Location</label>
                <div className="p-3 bg-[#000000] border border-[#333333] text-xs text-[#FEFEFE]">
                  Wah Cantt / GT Road
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#CCCCCC] uppercase mb-1">Investment Goal</label>
                <div className="p-3 bg-[#000000] border border-[#333333] text-xs text-[#FEFEFE]">
                  Immediate House Build
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#CCCCCC] uppercase mb-1">Budget Horizon</label>
                <div className="p-3 bg-[#000000] border border-[#333333] text-xs text-[#FEFEFE]">
                  PKR 1 Crore – 2 Crore
                </div>
              </div>
            </div>

            <Button href="/find-property" variant="secondary" size="lg" className="w-full">
              Launch Matchmaker Wizard
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5: CALCULATORS PREVIEW                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#FEFEFE] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Proprietary Tools"
            title="Real Estate & Construction Calculators"
            subtitle="Evaluate projected rental income, capital appreciation, and turnkey villa construction costs in Wah & Islamabad."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="border border-[#E5E5E5] p-8 bg-[#F4F4F4]">
              <Calculator className="w-8 h-8 text-[#000000] mb-4" />
              <h3 className="text-xl font-bold uppercase text-[#000000] font-mono mb-2">
                Turnkey Construction Estimator
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed mb-6 font-sans">
                Calculate precise Grey Structure and A+ Luxury Finishing BOQ costs based on actual 2026 Wah Cantt steel, cement, and sanitary rates.
              </p>
              <OutlineButton href="/calculators" size="sm">
                Open Construction Estimator
              </OutlineButton>
            </div>

            <div className="border border-[#E5E5E5] p-8 bg-[#F4F4F4]">
              <TrendingUp className="w-8 h-8 text-[#000000] mb-4" />
              <h3 className="text-xl font-bold uppercase text-[#000000] font-mono mb-2">
                Property ROI & Rental Yield Calculator
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed mb-6 font-sans">
                Project 3-year capital gains and rental cash flows across Kohistan Enclave, New City Phase 2, and B-17 Multi Gardens.
              </p>
              <OutlineButton href="/calculators" size="sm">
                Open ROI Calculator
              </OutlineButton>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 6: CONSTRUCTION SERIES — PLOT SAY GHAR TAK                 */}
      {/* ------------------------------------------------------------------ */}
      <ConstructionSeriesSection />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 7: INTERACTIVE HOUSE CONSTRUCTION BOQ & PACKAGE BUILDER    */}
      {/* ------------------------------------------------------------------ */}
      <ConstructionPackageBuilder />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 8: FULL-LENGTH SITE TOURS & IN-DEPTH MARKET VIDEOS         */}
      {/* ------------------------------------------------------------------ */}


      <section className="py-20 bg-[#F4F4F4] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeading
              eyebrow="Ground Reality"
              title="Full Site Tour & Rate Analysis Videos"
              subtitle="Watch transparent on-ground video tours of plot developments, asphalt roads, and luxury house construction in Wah Cantt and Islamabad."
              className="mb-0 max-w-2xl"
            />
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#000000] hover:underline mt-4 md:mt-0"
            >
              Watch All Videos & Shorts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STANDARD_VIDEOS_DATA.map((vid) => (
              <div key={vid.id} className="border border-[#E5E5E5] bg-[#FEFEFE] p-4 group flex flex-col justify-between">
                <div>
                  <Link href="/videos" className="block relative aspect-video bg-[#000000] overflow-hidden mb-4">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                      <div className="w-12 h-12 bg-[#FEFEFE] text-[#000000] flex items-center justify-center border border-[#000000] group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#000000] ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-[#000000] text-[#FEFEFE] text-[9px] font-mono px-2 py-0.5 z-10">
                      {vid.duration}
                    </span>
                  </Link>

                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#666666] block mb-1">
                    {vid.society} • {vid.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-[#000000] uppercase tracking-tight line-clamp-2">
                    <Link href="/videos" className="hover:underline">{vid.title}</Link>
                  </h3>
                </div>

                <p className="mt-3 text-xs text-[#666666] line-clamp-2 font-sans">
                  {vid.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* SECTION 7: WHY ASAD LAND HOLDINGS                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#FEFEFE] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Pillars"
            title="Why Asad Land Holdings"
            subtitle="Built on architectural integrity, zero hidden markups, and verified property transactions."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 font-mono">
            <div className="p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
              <div className="w-10 h-10 border border-[#000000] flex items-center justify-center text-base font-bold mb-6">
                01
              </div>
              <h3 className="text-lg font-bold uppercase text-[#000000] mb-3">
                Truth in Valuation
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed font-sans">
                We never quote artificial portal prices or non-existent files. Every rate reflects actual verified transactions in Wah and Islamabad.
              </p>
            </div>

            <div className="p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
              <div className="w-10 h-10 border border-[#000000] flex items-center justify-center text-base font-bold mb-6">
                02
              </div>
              <h3 className="text-lg font-bold uppercase text-[#000000] mb-3">
                Architectural Engineering
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed font-sans">
                In-house civil engineers handle structural BOQs, architectural layout blueprints, and turnkey construction management.
              </p>
            </div>

            <div className="p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
              <div className="w-10 h-10 border border-[#000000] flex items-center justify-center text-base font-bold mb-6">
                03
              </div>
              <h3 className="text-lg font-bold uppercase text-[#000000] mb-3">
                Direct Principal Access
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed font-sans">
                Speak directly with founding leadership and verified project heads rather than inexperienced third-party brokers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 8: HUMAN / FOUNDER SECTION WITH SIGNATURE ACCENT            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-[#F4F4F4] border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#000000] p-8 md:p-12 bg-[#FEFEFE]">
            <ArchitecturalLine className="max-w-xs mb-8" size="sm" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#666666] block mb-2">
                  Leadership Philosophy
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#000000] mb-6 font-sans">
                  &ldquo;Real estate must be treated as an architectural asset, not a paper lottery.&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-sans mb-8">
                  Over the past 14 years in Wah Cantt and Islamabad, Asad Land Holdings has established a reputation for absolute title clarity, precise land valuation, and high-margin construction engineering. Our pledge is simple: real estate on real rates, backed by empirical data and human expertise.
                </p>

                <SignatureAccent name="Asad Ali" title="Founder & Managing Director" />
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-60 sm:w-64 aspect-[3/4] border-2 border-[#000000] p-2 bg-[#FEFEFE] shadow-xl">
                  <div className="relative w-full h-full overflow-hidden bg-[#1A1A1A]">
                    <img
                      src="/images/founder-asad-ali.jpg"
                      alt="Asad Ali — Founder & Managing Director"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#000000]/85 text-white p-3 font-mono border-t border-[#333333] backdrop-blur-sm">
                      <p className="font-bold text-xs uppercase tracking-tight">Asad Ali</p>
                      <p className="text-[#BDBDBD] text-[9px] uppercase tracking-wider">Founder & Managing Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 9: FINAL ENQUIRY CTA                                       */}
      {/* ------------------------------------------------------------------ */}
      <CTASection />
    </>
  );
}
