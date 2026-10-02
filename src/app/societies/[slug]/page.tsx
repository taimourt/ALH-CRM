'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { SOCIETIES_DATA, PROPERTIES_DATA, VIDEOS_DATA } from '@/lib/website-data';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Badge } from '@/components/website/Badge';
import { Button, OutlineButton } from '@/components/website/Button';
import { PropertyCard } from '@/components/website/PropertyCard';
import { ArchitecturalLine } from '@/components/website/ArchitecturalLine';
import { PriceDisplay, formatPKRPrice } from '@/components/website/PriceDisplay';
import { LeadModal, LeadModalMode } from '@/components/website/LeadModal';
import { useCompare } from '@/lib/compare-context';
import { trackEvent } from '@/lib/analytics';
import { SocietyMapExplorer } from '@/components/website/SocietyMapExplorer';
import { SOCIETY_MASTER_PLANS } from '@/lib/master-plans-data';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  TrendingUp,
  Layers,
  Award,
  HelpCircle,
  FileText,
  Play,
  Check,
  X,
  Compass,
} from 'lucide-react';

export default function SocietyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const society = SOCIETIES_DATA.find((s) => s.slug === slug);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<LeadModalMode>('TALK_AGENT');

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    if (society) {
      trackEvent('society_viewed', {
        id: society.id,
        name: society.name,
      });
    }
  }, [society]);

  if (!society) {
    notFound();
  }

  const isCompared = isInCompare(society.id);
  const societyProperties = PROPERTIES_DATA.filter(
    (p) => p.societySlug === society.slug || p.society === society.name
  );
  const societyVideos = VIDEOS_DATA.filter((v) => v.society === society.name || v.linkedSocietySlug === society.slug);

  const openModal = (mode: LeadModalMode) => {
    setModalMode(mode);
    setLeadModalOpen(true);
  };

  const handleCompareToggle = () => {
    if (isCompared) {
      removeFromCompare(society.id);
    } else {
      addToCompare({ type: 'SOCIETY', item: society });
    }
  };

  const whatsappUrl = `https://wa.me/923005123456?text=${encodeURIComponent(
    `Hello Asad Land Holdings, I am inquiring about plots and investment in ${society.name}`
  )}`;

  const { investmentAssessment: ia } = society;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Societies Directory', href: '/societies' },
          { label: society.name },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/societies"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#666666] hover:text-[#000000]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Societies Directory
        </Link>

        <button
          onClick={handleCompareToggle}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-colors ${
            isCompared
              ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
              : 'bg-[#FEFEFE] text-[#000000] border-[#000000] hover:bg-[#F4F4F4]'
          }`}
        >
          <Layers className="w-4 h-4" />
          {isCompared ? 'Compared in Matrix' : '+ Compare Society'}
        </button>
      </div>

      {/* 1. HERO BANNER */}
      <div className="relative aspect-[21/9] w-full bg-[#000000] border border-[#000000] mb-8 overflow-hidden">
        <Image
          src={society.heroImage}
          alt={society.name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent flex flex-col justify-end p-6 md:p-10 text-[#FEFEFE]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="dark" className="border-[#FEFEFE]">{society.city}</Badge>
            <Badge variant="solid" className="bg-[#FEFEFE] text-[#000000]">
              <ShieldCheck className="w-3 h-3 inline mr-1 text-[#000000]" />
              {society.nocStatus}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#FEFEFE] tracking-tight font-sans">
            {society.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#BDBDBD] max-w-2xl mt-2 font-sans">
            {society.tagline}
          </p>
        </div>
      </div>

      {/* 2. METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#F4F4F4] border border-[#E5E5E5] font-mono text-xs mb-12">
        <div>
          <span className="text-[10px] text-[#666666] uppercase block">Price Range</span>
          <span className="font-bold text-[#000000]">
            {formatPKRPrice(society.priceRangeMin)} – {formatPKRPrice(society.priceRangeMax)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#666666] uppercase block">Annual Appreciation</span>
          <span className="font-bold text-[#000000]">{society.annualAppreciation}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#666666] uppercase block">Rental Yield</span>
          <span className="font-bold text-[#000000]">{society.rentalYield}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#666666] uppercase block">Developer</span>
          <span className="font-bold text-[#000000] truncate block">{society.developer}</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-8 space-y-12">
          {/* 3. SOCIETY OVERVIEW */}
          <div>
            <h2 className="text-xl font-bold uppercase text-[#000000] font-mono mb-4">
              Society Overview & Masterplan Analysis
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed font-sans mb-6">
              {society.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase text-[#000000] font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D97706]" /> Interactive Masterplan & Sector Navigator
              </h3>
              <Link
                href="/societies/map-explorer"
                className="text-xs font-mono uppercase text-[#000000] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Full Map Explorer</span> &rarr;
              </Link>
            </div>
            <p className="text-xs text-[#666666] font-sans leading-relaxed mb-6">
              {society.masterPlanDetails} Hover or click any block below to inspect current average transaction rate per Marla, on-ground possession status, and underground utility metrics.
            </p>

            <div className="my-6">
              <SocietyMapExplorer initialSocietySlug={society.slug} />
            </div>
          </div>

          {/* 4. ASAD LAND HOLDINGS INVESTMENT ASSESSMENT (EXPLICIT PROPRIETARY ASSESSMENT) */}
          <div className="border border-[#000000] p-8 bg-[#FEFEFE] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#000000]" />
                <div>
                  <h3 className="text-base font-bold uppercase text-[#000000] font-mono">
                    Asad Land Holdings Investment Assessment
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-[#666666]">
                    Internal ALH Proprietary Evaluation (Not an Objective Universal Benchmark)
                  </span>
                </div>
              </div>
              <div className="text-2xl font-black font-mono bg-[#000000] text-[#FEFEFE] px-3 py-1">
                {ia.overallScore} / 10
              </div>
            </div>

            <p className="text-xs text-[#666666] font-sans leading-relaxed">
              <strong>Evaluation Methodology:</strong> {ia.methodologyNotes}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Location Score</span>
                <span className="font-bold text-[#000000] text-sm">{ia.location} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Accessibility</span>
                <span className="font-bold text-[#000000] text-sm">{ia.accessibility} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Dev. Velocity</span>
                <span className="font-bold text-[#000000] text-sm">{ia.development} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Trade Liquidity</span>
                <span className="font-bold text-[#000000] text-sm">{ia.liquidity} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Price Entry</span>
                <span className="font-bold text-[#000000] text-sm">{ia.priceEntry} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Infrastructure</span>
                <span className="font-bold text-[#000000] text-sm">{ia.infrastructure} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">Rental Potential</span>
                <span className="font-bold text-[#000000] text-sm">{ia.rentalPotential} / 10</span>
              </div>
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[9px] text-[#666666] uppercase block">End-User Demand</span>
                <span className="font-bold text-[#000000] text-sm">{ia.demand} / 10</span>
              </div>
            </div>
          </div>

          {/* 5. PRICE TRENDS MATRIX */}
          <div>
            <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#000000]" /> Historical Price Appreciation Trends
            </h3>
            <div className="grid grid-cols-4 gap-3 font-mono text-xs">
              {society.priceTrends.map((pt) => (
                <div key={pt.year} className="p-4 border border-[#E5E5E5] bg-[#FEFEFE] text-center">
                  <span className="text-[10px] text-[#666666] uppercase block">{pt.year} Avg Rate</span>
                  <span className="font-bold text-[#000000] block mt-1">
                    PKR {(pt.avgRatePerMarla / 100000).toFixed(1)} Lakh / Marla
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. AMENITIES & NEARBY LANDMARKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs">
            <div className="p-6 border border-[#E5E5E5] bg-[#F4F4F4]">
              <h4 className="font-mono uppercase font-bold text-[#000000] mb-3 text-xs">
                Civil Amenities & Infrastructure
              </h4>
              <ul className="space-y-2">
                {society.amenities.map((a, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#000000] shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border border-[#E5E5E5] bg-[#F4F4F4]">
              <h4 className="font-mono uppercase font-bold text-[#000000] mb-3 text-xs">
                Nearby Key Landmarks
              </h4>
              <ul className="space-y-2">
                {society.nearbyLandmarks.map((lm, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#000000] shrink-0" />
                    <span>{lm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. PROS & CONSIDERATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs">
            <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
              <h4 className="font-mono uppercase font-bold text-[#000000] mb-3 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#000000]" /> Investment Advantages
              </h4>
              <ul className="space-y-2 text-[#444444]">
                {society.prosCons.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#000000]">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
              <h4 className="font-mono uppercase font-bold text-[#000000] mb-3 text-xs flex items-center gap-1.5">
                <X className="w-4 h-4 text-[#666666]" /> Key Considerations
              </h4>
              <ul className="space-y-2 text-[#666666]">
                {society.prosCons.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#666666]">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8. SOCIETY FAQS */}
          {society.faqs && (
            <div>
              <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#000000]" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3 font-sans text-xs">
                {society.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 border border-[#E5E5E5] bg-[#FEFEFE]">
                    <span className="font-bold text-[#000000] block mb-1 font-mono">{faq.question}</span>
                    <span className="text-[#666666] leading-relaxed">{faq.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <div className="lg:col-span-4 space-y-6 font-mono">
          <div className="border border-[#000000] p-6 bg-[#FEFEFE] space-y-4 sticky top-28">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-[#000000]">
              Inquire Market Rates in {society.name}
            </h3>
            <p className="text-xs text-[#666666]">
              Get real-time unlisted file & plot prices directly from our Wah office desk.
            </p>

            <Button onClick={() => openModal('TALK_AGENT')} variant="primary" size="md" className="w-full">
              Request Advisory Consultation
            </Button>

            <Button onClick={() => openModal('PAYMENT_PLAN')} variant="secondary" size="md" className="w-full">
              Get Payment Schedule PDF
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_clicked', { societySlug: society.slug })}
              className="w-full flex items-center justify-center gap-2 p-3 border border-[#000000] bg-[#F4F4F4] text-[#000000] font-bold text-xs uppercase tracking-wider hover:bg-[#000000] hover:text-[#FEFEFE] transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Connect via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* AVAILABLE INVENTORY */}
      {societyProperties.length > 0 && (
        <div className="my-16">
          <ArchitecturalLine className="mb-12" size="md" withLabel={`Available Inventory in ${society.name}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {societyProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* LEAD MODAL */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        mode={modalMode}
        societyName={society.name}
        societySlug={society.slug}
      />
    </div>
  );
}
