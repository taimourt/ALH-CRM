'use client';

import React from 'react';
import Image from 'next/image';
import { AgentItem } from '@/lib/website-data';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from './Button';

interface AgentCardProps {
  agent: AgentItem;
  className?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, className = '' }) => {
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(
    `Hello ${agent.name}, I am reaching out regarding investment and property inquiry on Asad Land Holdings.`
  )}`;

  return (
    <div className={`bg-[#FEFEFE] border border-[#E5E5E5] p-6 flex flex-col md:flex-row gap-6 items-center ${className}`}>
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-[#F4F4F4] overflow-hidden border border-[#000000]">
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          className="object-cover"
          sizes="144px"
        />
      </div>

      <div className="flex-1 text-center md:text-left">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] block mb-1">
          {agent.role}
        </span>
        <h3 className="text-xl font-bold text-[#000000] uppercase tracking-tight mb-2">
          {agent.name}
        </h3>
        <p className="text-xs text-[#666666] leading-relaxed mb-4 max-w-xl">
          {agent.bio}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <Button href={whatsappUrl} variant="primary" size="sm">
            <MessageSquare className="w-3.5 h-3.5 mr-2" /> WhatsApp Advisor
          </Button>
          <a
            href={`tel:${agent.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#000000] text-[10px] font-mono uppercase tracking-widest text-[#000000] hover:bg-[#F4F4F4]"
          >
            <Phone className="w-3.5 h-3.5" /> {agent.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
