'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SocietyItem } from '@/lib/website-data';
import { Badge } from './Badge';
import { formatPKRPrice } from './PriceDisplay';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface SocietyCardProps {
  society: SocietyItem;
  className?: string;
}

export const SocietyCard: React.FC<SocietyCardProps> = ({ society, className = '' }) => {
  return (
    <div className={`group bg-[#FEFEFE] border border-[#E5E5E5] transition-all duration-300 hover:border-[#000000] flex flex-col h-full ${className}`}>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F4F4]">
        <Image
          src={society.heroImage}
          alt={society.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="dark">{society.city}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="solid" className="bg-[#FEFEFE]/90 text-[#000000]">
            <ShieldCheck className="w-3 h-3 inline mr-1 text-[#000000]" />
            {society.nocStatus}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-[#000000] uppercase tracking-tight mb-2 group-hover:underline">
          <Link href={`/societies/${society.slug}`}>{society.name}</Link>
        </h3>

        <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-4">
          {society.tagline}
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 bg-[#F4F4F4] text-[11px] font-mono mb-4">
          <div>
            <span className="text-[#666666] block text-[9px] uppercase">Price Range</span>
            <span className="font-bold text-[#000000]">
              {formatPKRPrice(society.priceRangeMin)} +
            </span>
          </div>
          <div>
            <span className="text-[#666666] block text-[9px] uppercase">Annual Yield</span>
            <span className="font-bold text-[#000000]">{society.annualAppreciation}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#666666]">
            {society.devStatus}
          </span>
          <Link
            href={`/societies/${society.slug}`}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#000000] group-hover:translate-x-1 transition-transform"
          >
            Explore Society <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
