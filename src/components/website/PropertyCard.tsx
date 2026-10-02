'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyItem } from '@/lib/website-data';
import { PriceDisplay } from './PriceDisplay';
import { Badge } from './Badge';
import { LeadModal, LeadModalMode } from './LeadModal';
import { useCompare } from '@/lib/compare-context';
import { trackEvent } from '@/lib/analytics';
import { MapPin, Maximize2, MessageSquare, Calendar, Layers, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyItem;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<LeadModalMode>('EXACT_PRICE');
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const isCompared = isInCompare(property.id);

  const openLeadModal = (mode: LeadModalMode) => {
    setModalMode(mode);
    setLeadModalOpen(true);
    trackEvent('price_requested', {
      propertyId: property.id,
      title: property.title,
      mode,
    });
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <>
      <div className={`group bg-[#FEFEFE] border border-[#E5E5E5] transition-all duration-300 hover:border-[#000000] flex flex-col h-full relative ${className}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F4F4]">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="dark">{property.propertyType.replace('_', ' ')}</Badge>
            <Badge variant="solid" className="bg-[#FEFEFE] text-[#000000]">
              {property.purpose}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            <button
              onClick={handleCompareToggle}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 border transition-colors ${
                isCompared
                  ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                  : 'bg-[#FEFEFE]/90 text-[#000000] border-[#000000] hover:bg-[#000000] hover:text-[#FEFEFE]'
              }`}
              title="Add to comparison"
            >
              <Layers className="w-3 h-3" />
              {isCompared ? 'Compared' : '+ Compare'}
            </button>
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge variant="solid" className="bg-[#FEFEFE]/90 text-[#000000]">
              <ShieldCheck className="w-3 h-3 inline mr-1 text-[#000000]" />
              {property.nocStatus}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#666666] font-mono mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#000000]" />
            <span className="truncate">{property.society}, {property.city}</span>
          </div>

          <h3 className="text-base font-bold text-[#000000] uppercase tracking-tight line-clamp-2 mb-2 group-hover:underline font-sans">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          <p className="text-xs text-[#666666] font-sans line-clamp-2 mb-3 leading-relaxed">
            {property.description}
          </p>

          <div className="grid grid-cols-2 gap-3 py-2.5 my-2 border-y border-[#E5E5E5] text-[11px] font-mono">
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">Plot Size</span>
              <span className="font-bold text-[#000000]">{property.sizeMarla} Marla</span>
            </div>
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">Possession</span>
              <span className="font-bold text-[#000000] truncate block">{property.devStatus}</span>
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between mb-4">
            <PriceDisplay amount={property.demandPrice} size="md" showLabel />
            <span className="text-[10px] font-mono uppercase text-[#666666] bg-[#F4F4F4] px-2 py-0.5 border border-[#E5E5E5]">
              {property.availabilityStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E5E5] text-[10px] font-mono uppercase tracking-wider">
            <button
              onClick={() => openLeadModal('EXACT_PRICE')}
              className="py-2 px-2 bg-[#000000] text-[#FEFEFE] font-bold text-center hover:bg-[#222222]"
            >
              Exact Price
            </button>

            <Link
              href={`/properties/${property.slug}`}
              className="py-2 px-2 border border-[#000000] text-[#000000] font-bold text-center hover:bg-[#F4F4F4] flex items-center justify-center gap-1"
            >
              View <Maximize2 className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono uppercase tracking-wider">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_clicked', { propertyId: property.id })}
              className="py-1.5 px-2 border border-[#E5E5E5] bg-[#F4F4F4] text-[#000000] text-center hover:bg-[#E5E5E5] flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3 h-3" /> WhatsApp
            </a>

            <button
              onClick={() => openLeadModal('BOOK_SITE_VISIT')}
              className="py-1.5 px-2 border border-[#E5E5E5] bg-[#F4F4F4] text-[#000000] text-center hover:bg-[#E5E5E5] flex items-center justify-center gap-1"
            >
              <Calendar className="w-3 h-3" /> Site Visit
            </button>
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        mode={modalMode}
        propertyTitle={property.title}
        propertyId={property.id}
        societyName={property.society}
        price={property.demandPrice}
      />
    </>
  );
};
