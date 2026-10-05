'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Globe
} from 'lucide-react';
import { ArchitecturalLine } from './ArchitecturalLine';
import { FlowLines } from './FlowLines';
import { CurrencySwitcher } from './CurrencySwitcher';

export const Footer: React.FC = () => {
  const whatsappUrl = 'https://wa.me/923218004186?text=Hello%20Asad%20Land%20Holdings,%20I%20am%20inquiring%20about%20verified%20properties.';

  return (
    <footer className="relative bg-[#000000] text-[#FEFEFE] pt-16 pb-12 border-t border-[#222222] overflow-hidden">
      {/* Background Flowlines Effect */}
      <FlowLines opacity={0.15} variant="footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand & Philosophy Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 group">
              <img
                src="/images/logo-white.png"
                alt="Asad Land Holdings — Real Estate on Real Rates"
                className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-xs text-[#CCCCCC] leading-relaxed max-w-sm mb-6 font-sans">
              Wah Cantt and Islamabad&apos;s authoritative real-estate advisory, sales, and construction engineering firm. Operating strictly on verified market valuations and title deeds.
            </p>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEFEFE] text-[#000000] font-bold uppercase tracking-wider text-[10px] hover:bg-[#E5E5E5] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-[#000000]" /> WhatsApp Advisory
              </a>
              <CurrencySwitcher variant="footer" direction="up" />
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="font-mono">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#FEFEFE] mb-4">
              Properties & Societies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4D4D4]">
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
            <ul className="space-y-2.5 text-xs text-[#D4D4D4]">
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
            <ul className="space-y-3 text-xs text-[#D4D4D4]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FEFEFE] shrink-0 mt-0.5" />
                <span>Shop no 3, Hassan Heights, F Block, Wah Cantt, 47040</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FEFEFE] shrink-0" />
                <a href="tel:+923218004186" className="hover:text-[#FEFEFE] transition-colors">
                  +92 321 8004186
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
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#A3A3A3] gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Asad Land Holdings. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-[#CCCCCC]">Real Estate on Real Rates</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-[#FEFEFE] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FEFEFE] transition-colors">
              Terms of Advisory
            </Link>
            <Link href="/dashboard" className="hover:text-[#FEFEFE] text-[#CCCCCC] transition-colors font-bold">
              Agent Portal / CRM Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
