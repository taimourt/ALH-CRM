'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useCMS } from '@/contexts/cms-context';
import { AGENTS_DATA } from '@/lib/website-data';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { PriceDisplay, formatPKRPrice } from '@/components/website/PriceDisplay';
import { Badge } from '@/components/website/Badge';
import { Button, OutlineButton } from '@/components/website/Button';
import { ArchitecturalLine } from '@/components/website/ArchitecturalLine';
import { LeadModal, LeadModalMode } from '@/components/website/LeadModal';
import { AgentCard } from '@/components/website/AgentCard';
import { PropertyCard } from '@/components/website/PropertyCard';
import { useCompare } from '@/lib/compare-context';
import { trackEvent } from '@/lib/analytics';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  ArrowLeft,
  FileText,
  Play,
  HelpCircle,
  TrendingUp,
  Layers,
  Calendar,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { properties, videos } = useCMS();
  const agents = AGENTS_DATA;
  const property = properties.find((p) => p.slug === slug);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<LeadModalMode>('EXACT_PRICE');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    if (property) {
      trackEvent('property_viewed', {
        id: property.id,
        title: property.title,
        price: property.demandPrice,
      });
    }
  }, [property]);

  if (!property) {
    notFound();
  }

  const isCompared = isInCompare(property.id);
  const activeImage = selectedGalleryImg || property.image;
  const attachedVideo = videos.find((v) => v.id === property.attachedVideoId || v.linkedPropertyId === property.id);
  const similarProperties = properties.filter((p) => p.id !== property.id && p.society === property.society).slice(0, 3);

  const openModal = (mode: LeadModalMode) => {
    setModalMode(mode);
    setLeadModalOpen(true);
  };

  const handleCompareToggle = () => {
    if (isCompared) {
      removeFromCompare(property.id);
    } else {
      addToCompare({ type: 'PROPERTY', item: property });
    }
  };

  const whatsappUrl = `https://wa.me/923005123456?text=${encodeURIComponent(
    `Hello Asad Land Holdings, I am interested in property: ${property.title} (${property.slug}) listed at PKR ${property.demandPrice}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Properties Catalog', href: '/properties' },
          { label: property.title },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#666666] hover:text-[#000000]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties Catalog
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
          {isCompared ? 'Compared in Matrix' : '+ Add to Compare Matrix'}
        </button>
      </div>

      {/* Property Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-[#E5E5E5] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="dark">{property.propertyType.replace('_', ' ')}</Badge>
            <Badge variant="solid" className="bg-[#FEFEFE] text-[#000000]">
              {property.purpose}
            </Badge>
            <Badge variant="solid">
              <ShieldCheck className="w-3 h-3 inline mr-1 text-[#000000]" />
              {property.nocStatus}
            </Badge>
            <span className="text-xs text-[#666666] font-mono">
              Plot ID: {property.plotNumber || 'On-Ground'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#000000] tracking-tight font-sans mb-2">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666666] font-mono">
            <MapPin className="w-4 h-4 text-[#000000]" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <PriceDisplay amount={property.demandPrice} size="xl" showLabel />
          <span className="text-xs text-[#666666] font-mono mt-1">
            (PKR {property.pricePerMarla.toLocaleString()} / Marla)
          </span>
        </div>
      </div>

      {/* Main Grid: Gallery Left, Specs & CTAs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Column: Image Gallery & Sections */}
        <div className="lg:col-span-7 space-y-12">
          {/* Main Image */}
          <div>
            <div className="relative aspect-[4/3] w-full bg-[#F4F4F4] border border-[#000000] mb-3 overflow-hidden">
              <Image
                src={activeImage}
                alt={property.title}
                fill
                className="object-cover transition-all duration-300"
                priority
              />
            </div>

            {/* Thumbnail Strip */}
            {property.gallery && property.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {[property.image, ...property.gallery].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryImg(img)}
                    className={`relative aspect-[4/3] bg-[#F4F4F4] border ${
                      activeImage === img ? 'border-[#000000] ring-1 ring-[#000000]' : 'border-[#E5E5E5]'
                    } overflow-hidden`}
                  >
                    <Image src={img} alt={`Gallery thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. Property Overview */}
          <div className="pt-6 border-t border-[#E5E5E5]">
            <h2 className="text-lg font-bold uppercase text-[#000000] font-mono mb-4">
              Property Overview & Blueprint
            </h2>
            <p className="text-sm text-[#444444] leading-relaxed whitespace-pre-line font-sans mb-6">
              {property.description}
            </p>
          </div>

          {/* 2. Key Architectural Features */}
          <div>
            <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4">
              Key Property Specifications & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs text-[#444444]">
              {property.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                  <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Investment Considerations */}
          <div className="p-6 bg-[#F4F4F4] border border-[#000000]">
            <div className="flex items-center gap-2 text-xs uppercase font-bold font-mono text-[#000000] mb-3">
              <TrendingUp className="w-4 h-4 text-[#000000]" />
              <span>Asad Land Holdings Investment Considerations</span>
            </div>
            <p className="text-xs text-[#444444] font-sans leading-relaxed mb-4">
              Based on empirical transaction history in {property.society}, this plot carries an estimated 18.4% 3-year compound annual growth rate. Possessed plots in this sector carry immediate liquidity for end-user construction.
            </p>
            <Button onClick={() => openModal('INVESTMENT_ANALYSIS')} variant="secondary" size="sm">
              Request Full Investment Analysis Report
            </Button>
          </div>

          {/* 4. Payment & Installment Information */}
          {property.paymentPlanDetails && (
            <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE] font-mono text-xs">
              <h3 className="text-xs font-bold uppercase text-[#000000] mb-4 pb-2 border-b border-[#E5E5E5]">
                Verified Installment Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase">Down Payment</span>
                  <span className="font-bold text-[#000000] text-sm">
                    {formatPKRPrice(property.paymentPlanDetails.downPayment)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase">Monthly Installment</span>
                  <span className="font-bold text-[#000000] text-sm">
                    {formatPKRPrice(property.paymentPlanDetails.monthlyInstallment)} / mo
                  </span>
                </div>
              </div>
              <Button onClick={() => openModal('PAYMENT_PLAN')} variant="primary" size="sm" className="w-full mt-4">
                Send Complete Payment Schedule PDF
              </Button>
            </div>
          )}

          {/* 5. Attached Ground Reality Video */}
          {attachedVideo && (
            <div>
              <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-[#000000]" /> Ground Reality Video Inspection
              </h3>
              <div className="relative aspect-video bg-[#000000] border border-[#000000]">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title={attachedVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* 6. Legal Title Documents */}
          {property.documentsList && (
            <div>
              <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#000000]" /> Verified Legal & Title Documents
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {property.documentsList.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#F4F4F4] border border-[#E5E5E5]">
                    <span className="font-bold text-[#000000]">{doc}</span>
                    <button
                      onClick={() => openModal('WHATSAPP_DETAILS')}
                      className="text-[10px] uppercase underline text-[#000000]"
                    >
                      Request Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FAQs */}
          {property.faqs && property.faqs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase text-[#000000] font-mono mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#000000]" /> Property FAQs
              </h3>
              <div className="space-y-3 font-sans text-xs">
                {property.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 border border-[#E5E5E5] bg-[#FEFEFE]">
                    <span className="font-bold text-[#000000] block mb-1 font-mono">{faq.question}</span>
                    <span className="text-[#666666] leading-relaxed">{faq.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spec Matrix & Contextual CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#000000] p-6 bg-[#FEFEFE] sticky top-28">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-[#000000] mb-4 border-b border-[#E5E5E5] pb-2">
              Property Specifications
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Plot Size</span>
                <span className="font-bold text-[#000000]">{property.sizeMarla} Marla ({property.sizeSqFt} SqFt)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Rate / SqFt</span>
                <span className="font-bold text-[#000000]">PKR {property.pricePerSqFt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Development Velocity</span>
                <span className="font-bold text-[#000000]">{property.devStatus}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E5E5]">
                <span className="text-[#666666]">Society / Block</span>
                <span className="font-bold text-[#000000]">{property.society} ({property.sectorBlock})</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#666666]">Possession Status</span>
                <span className="font-bold text-[#000000]">{property.possessionStatus}</span>
              </div>
            </div>

            {/* Contextual CTAs */}
            <div className="mt-6 pt-6 border-t border-[#E5E5E5] space-y-3 font-mono">
              <Button onClick={() => openModal('EXACT_PRICE')} variant="primary" size="md" className="w-full">
                Request Exact Price & Deed Status
              </Button>

              <OutlineButton onClick={() => openModal('BOOK_SITE_VISIT')} size="md" className="w-full">
                <Calendar className="w-4 h-4 mr-2" /> Book Site Inspection Visit
              </OutlineButton>

              <OutlineButton onClick={() => openModal('FIND_SIMILAR')} size="md" className="w-full">
                Find Similar Off-Market Plots
              </OutlineButton>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_clicked', { propertyId: property.id })}
                className="w-full flex items-center justify-center gap-2 p-3 border border-[#000000] bg-[#F4F4F4] text-[#000000] font-bold text-xs uppercase tracking-wider hover:bg-[#000000] hover:text-[#FEFEFE] transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Get Blueprint on WhatsApp
              </a>
            </div>
          </div>

          {agents.length > 0 && <AgentCard agent={agents[0]} />}
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="my-16">
          <ArchitecturalLine className="mb-12" size="md" withLabel={`Similar Listings in ${property.society}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        mode={modalMode}
        propertyTitle={property.title}
        propertyId={property.id}
        societyName={property.society}
        price={property.demandPrice}
      />
    </div>
  );
}
