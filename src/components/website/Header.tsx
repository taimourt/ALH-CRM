'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageSquare, Phone, ChevronRight, Globe } from 'lucide-react';
import { Button } from './Button';
import { CurrencySwitcher } from './CurrencySwitcher';

const NAV_ITEMS = [
  { label: 'Properties', href: '/properties' },
  { label: 'Societies', href: '/societies' },
  { label: 'Floor Plans', href: '/floor-plans' },
  { label: 'Blog', href: '/blog' },
  { label: 'Investment', href: '/investment' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Videos', href: '/videos' },
  { label: 'Overseas Desk', href: '/overseas', isHighlight: true },
  { label: 'About', href: '/about' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const whatsappUrl = 'https://wa.me/923005123456?text=Hello%20Asad%20Land%20Holdings,%20I%20am%20an%20overseas%20investor%20and%20want%20to%20inquire%20about%20verified%20properties.';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/95 backdrop-blur-md text-[#FEFEFE] py-3 shadow-lg border-b border-[#222222]'
          : 'bg-[#000000] text-[#FEFEFE] py-5 border-b border-[#222222]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Architectural Line Logo Mark */}
          <div className="w-8 h-8 border border-[#FEFEFE] flex items-center justify-center p-1 group-hover:bg-[#FEFEFE] group-hover:text-[#000000] transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-full h-full"
            >
              <path d="M3 12L12 4L21 12" />
              <path d="M5 20H19" />
              <path d="M7 12V20" />
              <path d="M12 12V20" />
              <path d="M17 12V20" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg uppercase tracking-tight font-sans text-[#FEFEFE]">
              ASAD LAND HOLDINGS
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-[#BDBDBD]">
              Real Estate on Real Rates
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-mono uppercase tracking-[0.12em]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#FEFEFE] font-bold'
                    : item.isHighlight
                    ? 'text-amber-400 font-bold hover:text-amber-300'
                    : 'text-[#BDBDBD] hover:text-[#FEFEFE]'
                }`}
              >
                {item.isHighlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#FEFEFE]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Group: Currency Switcher, WhatsApp, Find Property */}
        <div className="hidden lg:flex items-center gap-3">
          <CurrencySwitcher />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#FEFEFE] border border-[#444444] hover:bg-[#222222] transition-colors"
            title="WhatsApp Contact"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          <Button href="/find-property" variant="secondary" size="sm">
            FIND PROPERTY
          </Button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <CurrencySwitcher />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#444444] text-[#FEFEFE] hover:bg-[#222222]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#000000] border-b border-[#222222] px-6 py-6 font-mono">
          <div className="flex flex-col gap-3 text-xs uppercase tracking-widest text-[#BDBDBD] mb-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between py-2.5 border-b border-[#222222] ${
                  item.isHighlight ? 'text-amber-400 font-bold' : 'hover:text-[#FEFEFE]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isHighlight && <Globe className="w-4 h-4 text-amber-400" />}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#444444]" />
              </Link>
            ))}
            <Link
              href="/find-property"
              className="flex items-center justify-between py-2.5 border-b border-[#222222] text-[#FEFEFE] font-bold"
            >
              <span>Find My Property</span>
              <ChevronRight className="w-4 h-4 text-[#FEFEFE]" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#FEFEFE] text-[#000000] font-bold text-xs uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 fill-[#000000]" /> WhatsApp Advisory
            </a>
            <a
              href="tel:+923005123456"
              className="flex items-center justify-center gap-2 py-3 border border-[#444444] text-[#FEFEFE] text-xs uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" /> Call Direct Hotline
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
