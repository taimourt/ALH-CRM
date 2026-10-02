'use client';

import React from 'react';
import { Button, OutlineButton } from './Button';
import { SignatureAccent } from './SignatureAccent';
import { FlowLines } from './FlowLines';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'INVEST WITH UNCOMPROMISED ACCURACY',
  subtitle = 'Schedule an in-person office consultation at Wah Cantt or request a direct WhatsApp market rates assessment from our principal advisors.',
  className = '',
}) => {
  const whatsappUrl = 'https://wa.me/923005123456?text=Hello%20Asad%20Land%20Holdings,%20I%20would%20like%20to%20inquire%20about%20verified%20properties%20and%20investment.';

  return (
    <section className={`relative bg-[#000000] text-[#FEFEFE] py-20 px-6 overflow-hidden ${className}`}>
      <FlowLines opacity={0.15} variant="hero" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#BDBDBD] block mb-4">
          Direct Advisory & Investment Execution
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#FEFEFE] leading-tight mb-6">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed mb-10">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Button href={whatsappUrl} variant="secondary" size="lg">
            <MessageSquare className="w-4 h-4 mr-2 inline" /> Connect via WhatsApp
          </Button>
          <OutlineButton href="/contact" size="lg" className="border-[#FEFEFE] text-[#FEFEFE] hover:bg-[#FEFEFE] hover:text-[#000000]">
            <PhoneCall className="w-4 h-4 mr-2 inline" /> Office & Contact Info
          </OutlineButton>
        </div>

        <div className="pt-8 border-t border-[#222222] inline-block">
          <SignatureAccent name="Asad Ali" title="Real Estate on Real Rates" className="text-[#FEFEFE]" />
        </div>
      </div>
    </section>
  );
};
