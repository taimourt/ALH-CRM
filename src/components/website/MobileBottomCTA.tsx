'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Search } from 'lucide-react';

export const MobileBottomCTA: React.FC = () => {
  const whatsappUrl = 'https://wa.me/923218004186?text=Hello%20Asad%20Land%20Holdings,%20I%20am%20inquiring%20about%20verified%20properties.';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000000] text-[#FEFEFE] border-t border-[#222222] px-3 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FEFEFE] text-[#000000] py-2.5 px-2 text-[10px] font-mono uppercase tracking-wider font-bold"
      >
        <MessageSquare className="w-3.5 h-3.5 fill-[#000000]" /> WhatsApp
      </a>

      <a
        href="tel:+923218004186"
        className="inline-flex items-center justify-center p-2.5 border border-[#444444] text-[#FEFEFE] hover:bg-[#222222]"
        aria-label="Call Advisor"
      >
        <Phone className="w-4 h-4" />
      </a>

      <Link
        href="/find-property"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#222222] text-[#FEFEFE] py-2.5 px-2 text-[10px] font-mono uppercase tracking-wider font-bold border border-[#444444]"
      >
        <Search className="w-3.5 h-3.5 text-[#FEFEFE]" /> Find Property
      </Link>
    </div>
  );
};
