'use client';

import React from 'react';
import Link from 'next/link';
import { FlowLines } from './FlowLines';
import { ArchitecturalLine } from './ArchitecturalLine';
import { MapPin, Phone, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const whatsappUrl = 'https://wa.me/923005123456?text=Hello%20Asad%20Land%20Holdings,%20I%20am%20inquiring%20about%20verified%20properties.';

  return (
    <footer className="relative bg-[#000000] text-[#FEFEFE] pt-16 pb-20 border-t border-[#222222] overflow-hidden">
      <FlowLines opacity={0.15} variant="footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand & Philosophy Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-[#FEFEFE] flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#FEFEFE]">
                  <path d="M3 12L12 4L21 12" />
                  <path d="M5 20H19" />
                  <path d="M7 12V20" />
                  <path d="M12 12V20" />
                  <path d="M17 12V20" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg uppercase tracking-tight font-sans text-[#FEFEFE]">
                  ASAD LAND HOLDINGS
                </h3>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#BDBDBD] block">
                  REAL ESTATE ON REAL RATES
                </span>
              </div>
            </div>

            <p className="text-xs text-[#BDBDBD] leading-relaxed max-w-sm mb-6 font-sans">
              Wah Cantt and Islamabad&apos;s authoritative real-estate advisory, sales, and construction engineering firm. Operating strictly on verified market valuations and title deeds.
            </p>

            <div className="flex items-center gap-3 font-mono text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEFEFE] text-[#000000] font-bold uppercase tracking-wider text-[10px] hover:bg-[#E5E5E5] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-[#000000]" /> WhatsApp Advisory
              </a>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="font-mono">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FEFEFE] mb-4">
              Properties & Societies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BDBDBD]">
              <li>
                <Link href="/properties" className="hover:text-[#FEFEFE] transition-colors">
                  Properties Catalog
                </Link>
              </li>
              <li>
                <Link href="/societies/kohistan-enclave-wah" className="hover:text-[#FEFEFE] transition-colors">
                  Kohistan Enclave
                </Link>
              </li>
              <li>
                <Link href="/societies/new-city-phase-2-wah" className="hover:text-[#FEFEFE] transition-colors">
                  New City Phase 2
                </Link>
              </li>
              <li>
                <Link href="/societies/multi-gardens-b17-islamabad" className="hover:text-[#FEFEFE] transition-colors">
                  Multi Gardens B-17
                </Link>
              </li>
              <li>
                <Link href="/societies/faisal-hills-taxila" className="hover:text-[#FEFEFE] transition-colors">
                  Faisal Hills Taxila
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Market Insights */}
          <div className="font-mono">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FEFEFE] mb-4">
              Intelligence & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BDBDBD]">
              <li>
                <Link href="/overseas" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Overseas Pakistani Desk</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/societies/map-explorer" className="text-white font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>🗺️ Interactive Map Explorer</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/floor-plans" className="text-white font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>📐 3D/2D Floor Plans Catalog</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/investment" className="hover:text-[#FEFEFE] transition-colors">
                  Investment Intelligence
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-[#FEFEFE] transition-colors">
                  ROI & Construction Calculators
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-[#FEFEFE] transition-colors">
                  Site Tour Videos
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#FEFEFE] transition-colors">
                  Market Articles
                </Link>
              </li>
              <li>
                <Link href="/find-property" className="hover:text-[#FEFEFE] transition-colors">
                  Find Property Matchmaker
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Contact Info */}
          <div className="font-mono">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FEFEFE] mb-4">
              Wah Cantt Head Office
            </h4>
            <ul className="space-y-3 text-xs text-[#BDBDBD]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FEFEFE] shrink-0 mt-0.5" />
                <span>Main GT Road, Near Kohistan Enclave Gate, Wah Cantt, PK</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FEFEFE] shrink-0" />
                <a href="tel:+923005123456" className="hover:text-[#FEFEFE] transition-colors">
                  +92 300 5123456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FEFEFE] shrink-0" />
                <a href="mailto:info@asadlandholdings.com" className="hover:text-[#FEFEFE] transition-colors">
                  info@asadlandholdings.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#FEFEFE] underline hover:text-[#BDBDBD]"
                >
                  View Location Map & Hours <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Architectural Line Divider */}
        <div className="py-6">
          <ArchitecturalLine size="sm" className="text-[#BDBDBD]" />
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#666666] gap-4">
          <div>
            © {new Date().getFullYear()} Asad Land Holdings. All rights reserved. Real Estate on Real Rates.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#BDBDBD] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#BDBDBD] transition-colors">
              Terms of Advisory
            </Link>
            <Link href="/dashboard" className="hover:text-[#FEFEFE] text-[#BDBDBD] transition-colors font-bold">
              Agent Portal / CRM Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
