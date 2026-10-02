'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Button, OutlineButton } from '@/components/website/Button';
import { PriceDisplay, formatPKRPrice } from '@/components/website/PriceDisplay';
import { CurrencySwitcher } from '@/components/website/CurrencySwitcher';
import { useCurrency, CURRENCY_CONFIGS, CurrencyCode } from '@/contexts/currency-context';
import { PROPERTIES_DATA, SOCIETIES_DATA, PropertyItem } from '@/lib/website-data';
import { trackEvent } from '@/lib/analytics';
import {
  Globe,
  ShieldCheck,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Landmark,
  Plane,
  Building2,
  Phone,
  MessageSquare,
  DollarSign,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HardHat,
  Sparkles,
  Layers,
  Flame,
  Award
} from 'lucide-react';

interface TimezoneOption {
  key: string;
  label: string;
  region: string;
  offset: string;
  sampleTime: string;
}

const TIMEZONES: TimezoneOption[] = [
  { key: 'GMT', label: 'London, UK (GMT/BST)', region: 'United Kingdom', offset: '+00:00 / +01:00', sampleTime: '10:00 AM – 06:00 PM' },
  { key: 'GST', label: 'Dubai, UAE (GST)', region: 'Middle East', offset: '+04:00', sampleTime: '11:00 AM – 09:00 PM' },
  { key: 'AST', label: 'Riyadh / Jeddah, KSA (AST)', region: 'Saudi Arabia', offset: '+03:00', sampleTime: '10:00 AM – 08:00 PM' },
  { key: 'EST', label: 'New York / Toronto (EST/EDT)', region: 'North America (East)', offset: '-05:00 / -04:00', sampleTime: '08:00 AM – 01:00 PM' },
  { key: 'CST', label: 'Chicago / Houston (CST/CDT)', region: 'North America (Central)', offset: '-06:00 / -05:00', sampleTime: '08:00 AM – 12:00 PM' },
  { key: 'PST', label: 'Los Angeles / SF (PST/PDT)', region: 'North America (West)', offset: '-08:00 / -07:00', sampleTime: '07:00 AM – 11:00 AM' },
  { key: 'AEST', label: 'Sydney / Melbourne (AEST)', region: 'Australia', offset: '+10:00', sampleTime: '03:00 PM – 10:00 PM' },
  { key: 'PKT', label: 'Islamabad, Pakistan (PKT)', region: 'Local Time', offset: '+05:00', sampleTime: '09:00 AM – 09:00 PM' },
];

export default function OverseasDeskPage() {
  const { currency, setCurrency, formatPrice, convertFromPKR } = useCurrency();

  // Consultation Scheduler State
  const [selectedTimezone, setSelectedTimezone] = useState<string>('GMT');
  const [selectedTopic, setSelectedTopic] = useState<string>('TURNKEY_CONSTRUCTION');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');
  const [clientName, setClientName] = useState<string>('');
  const [clientCountry, setClientCountry] = useState<string>('United Kingdom');
  const [clientWhatsApp, setClientWhatsApp] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Legal Guide Tab State
  const [activeLegalTab, setActiveLegalTab] = useState<'RDA' | 'POA' | 'TITLE' | 'REPATRIATION'>('RDA');

  // Overseas Currency Converter Calculator State
  const [calcForeignAmount, setCalcForeignAmount] = useState<number>(50000);
  const activeCurrencyConfig = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const convertedPKR = calcForeignAmount * activeCurrencyConfig.rateToPKR;

  // Filtered properties for overseas investors (high-yield / fully possessed)
  const overseasHotPicks = PROPERTIES_DATA.filter((p) => p.isFeatured || p.isHotInvestment).slice(0, 3);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientWhatsApp) {
      alert('Please provide your name and WhatsApp number.');
      return;
    }
    setBookingConfirmed(true);
    trackEvent('lead_created', {
      source: 'OVERSEAS_DESK_ZOOM_BOOKING',
      name: clientName,
      country: clientCountry,
      timezone: selectedTimezone,
      topic: selectedTopic,
      date: selectedDate,
      slot: selectedSlot,
    });
  };

  const whatsappConsultationUrl = `https://wa.me/923005123456?text=${encodeURIComponent(
    `Hello Asad Land Holdings, I am an Overseas Pakistani investor (${clientCountry || 'Overseas'}). I want to schedule a 1-on-1 strategy video consultation with Managing Director Asad Ali.\n\n` +
    `• Topic: ${selectedTopic.replace('_', ' ')}\n` +
    `• My Timezone: ${selectedTimezone}\n` +
    `• Preferred Slot: ${selectedDate} at ${selectedSlot}\n` +
    `• Name: ${clientName || 'Overseas Client'}\n` +
    `• Currency Preference: ${currency}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: 'Overseas Pakistani Investor Desk' }]} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION: OVERSEAS INVESTOR DESK                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-[#090909] text-[#FEFEFE] border border-[#262626] p-6 sm:p-12 mb-16 overflow-hidden shadow-2xl">
        {/* Background Architectural Blueprint Grid */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FEFEFE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          {/* Eyebrow & Country Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 font-mono text-[10px]">
            <span className="px-3 py-1 bg-amber-400 text-[#000000] font-black uppercase tracking-widest flex items-center gap-1.5 shadow">
              <Globe className="w-3.5 h-3.5" />
              OFFICIAL OVERSEAS INVESTOR DESK
            </span>
            <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333333] text-[#BDBDBD] uppercase">
              🇬🇧 UK • 🇦🇪 UAE • 🇸🇦 KSA • 🇺🇸 USA • 🇨🇦 CANADA • 🇪🇺 EUROPE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans leading-tight mb-6">
            REMOTE REAL ESTATE & TURNKEY VILLA CONSTRUCTION WITH 100% LEGAL TITLE SECURITY <span className="text-amber-400">.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#BDBDBD] leading-relaxed font-sans mb-8 max-w-3xl">
            Over 65% of high-value land transactions in Wah Cantt and Islamabad are executed for non-resident Pakistanis. Asad Land Holdings provides institutional-grade legal title verification, Roshan Digital Account (RDA) compliance, Power of Attorney (POA) embassy attestation, and bi-weekly 4K drone construction video monitoring with zero travel required.
          </p>

          {/* Action Row & Live Currency Switcher */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#schedule-consultation"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-[#000000] font-mono font-black uppercase text-xs flex items-center gap-2 shadow-xl transition-all"
            >
              <Video className="w-4 h-4" /> Book Zoom Consultation With Asad Ali
            </a>

            <a
              href="#legal-guide"
              className="px-6 py-3.5 bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-[#FEFEFE] font-mono font-bold uppercase text-xs flex items-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" /> SBP RDA & Legal Transfer Guide
            </a>
          </div>

          {/* Currency Live Switcher Banner */}
          <div className="pt-6 border-t border-[#262626] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#888888]">
              <span>Viewing Global Real Rates In:</span>
              <CurrencySwitcher variant="dark" />
            </div>

            <div className="flex items-center gap-4 text-[10px] text-[#777777]">
              <span>Live Benchmark: 1 USD ≈ 278.5 PKR</span>
              <span>•</span>
              <span>1 GBP ≈ 365.2 PKR</span>
              <span>•</span>
              <span>1 AED ≈ 75.8 PKR</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FOUR OVERSEAS CORE PILLARS                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 font-mono text-xs">
        <div className="p-6 bg-[#FEFEFE] border border-[#E5E5E5] flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 bg-[#000000] text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-sm uppercase text-[#000000] mb-2 font-sans">
              100% SBP RDA Compliance
            </h3>
            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
              Official banking wire channels and Roshan Digital Account payments with full capital gains repatriation rights and FBR non-resident tax exemptions.
            </p>
          </div>
          <span className="text-[9px] text-amber-600 font-bold uppercase mt-4 block">
            State Bank Verified
          </span>
        </div>

        <div className="p-6 bg-[#FEFEFE] border border-[#E5E5E5] flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 bg-[#000000] text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-sm uppercase text-[#000000] mb-2 font-sans">
              Embassy Power of Attorney
            </h3>
            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
              End-to-end guidance for digital Nadra overseas POA and Pakistani High Commission attestation. Full title registry execution without traveling.
            </p>
          </div>
          <span className="text-[9px] text-amber-600 font-bold uppercase mt-4 block">
            Zero Travel Required
          </span>
        </div>

        <div className="p-6 bg-[#FEFEFE] border border-[#E5E5E5] flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 bg-[#000000] text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-sm uppercase text-[#000000] mb-2 font-sans">
              4K Drone Milestone Logs
            </h3>
            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
              Bi-weekly 4K drone flyovers and 360° interior walkthroughs for turnkey house construction, showing exact rebar, concrete, and finishing progress.
            </p>
          </div>
          <span className="text-[9px] text-amber-600 font-bold uppercase mt-4 block">
            Video Verified On-Site
          </span>
        </div>

        <div className="p-6 bg-[#FEFEFE] border border-[#E5E5E5] flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 bg-[#000000] text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-sm uppercase text-[#000000] mb-2 font-sans">
              DHL Diplomatic Courier
            </h3>
            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
              Original Cantt Board and RDA allotment letters, title registries, and completion certificates securely dispatched via tracked DHL express.
            </p>
          </div>
          <span className="text-[9px] text-amber-600 font-bold uppercase mt-4 block">
            Insured Document Transit
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. INTERACTIVE 1-ON-1 ZOOM VIDEO CONSULTATION SCHEDULER            */}
      {/* ------------------------------------------------------------------ */}
      <section id="schedule-consultation" className="py-12 bg-[#0E0E0E] text-[#FEFEFE] border border-[#242424] p-6 sm:p-12 mb-16 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Consultation Pitch */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-amber-400/40 text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-4">
              <Video className="w-3.5 h-3.5" />
              <span>DIRECT EXECUTIVE CONSULTATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans mb-4">
              SCHEDULE A 1-ON-1 VIDEO STRATEGY CALL WITH MANAGING DIRECTOR ASAD ALI
            </h2>

            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-sans mb-6">
              Get empirical market valuations, ground reality videos of specific plots in Kohistan Enclave or New City Phase 2, and customized turnkey construction BOQ reviews adjusted for your time-zone.
            </p>

            <div className="space-y-3 font-mono text-xs text-[#D0D0D0] mb-8 border-y border-[#262626] py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>30-Minute Screen-Share Zoom / WhatsApp Video</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Real-time on-ground plot map & satellite overlays</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Turnkey engineering BOQ analysis & payment milestones</span>
              </div>
            </div>

            <div className="p-4 bg-[#141414] border border-[#2E2E2E] font-mono text-[11px] text-[#888888]">
              <span className="text-amber-400 font-bold uppercase block mb-1">Direct Hotline:</span>
              <span>WhatsApp / Call: +92 300 5123456</span>
              <span className="block mt-0.5">Email: asad@asadlandholdings.com</span>
            </div>
          </div>

          {/* Right: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#2E2E2E] p-6 sm:p-8">
            {bookingConfirmed ? (
              <div className="text-center py-10 space-y-4 font-sans">
                <div className="w-16 h-16 bg-amber-400 text-[#000000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold uppercase text-[#FEFEFE]">
                  Consultation Request Registered!
                </h3>
                <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#FEFEFE]">{clientName}</strong>. Our Overseas Executive Desk has scheduled your session for <strong className="text-amber-400">{selectedDate} at {selectedSlot} ({selectedTimezone})</strong>.
                </p>
                <div className="pt-4">
                  <a
                    href={whatsappConsultationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-[#000000] font-mono font-bold uppercase text-xs"
                  >
                    <MessageSquare className="w-4 h-4" /> Open Instant WhatsApp Confirmation
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5 font-mono text-xs">
                
                {/* 1. Timezone Selector */}
                <div>
                  <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                    1. Select Your Local Timezone
                  </label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.key} value={tz.key}>
                        {tz.label} — (Slots: {tz.sampleTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Consultation Topic */}
                <div>
                  <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                    2. Primary Investment Objective
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'TURNKEY_CONSTRUCTION', label: 'Turnkey Villa Construction & BOQ' },
                      { key: 'PLOT_PURCHASE', label: 'Verified Plot Demarcation & Purchase' },
                      { key: 'COMMERCIAL_INCOME', label: 'High Rental Yield Commercial Shop' },
                      { key: 'LEGAL_RDA_POA', label: 'RDA / Embassy POA Legal Process' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setSelectedTopic(t.key)}
                        className={`p-2.5 text-left border transition-colors ${
                          selectedTopic === t.key
                            ? 'bg-[#222222] border-amber-400 text-amber-400 font-bold'
                            : 'bg-[#0A0A0A] border-[#2A2A2A] text-[#888888] hover:border-[#444444]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      3. Preferred Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    >
                      <option value="Today">Today (Urgent Session)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Weekend (Saturday)">This Weekend (Saturday)</option>
                      <option value="This Weekend (Sunday)">This Weekend (Sunday)</option>
                      <option value="Next Week">Next Week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      Preferred Time Slot ({selectedTimezone})
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    >
                      <option value="11:00 AM">11:00 AM (Morning Slot)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                      <option value="05:00 PM">05:00 PM (Evening Slot)</option>
                      <option value="08:00 PM">08:00 PM (Night Slot)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Client Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. United Kingdom / UAE / USA"
                      value={clientCountry}
                      onChange={(e) => setClientCountry(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      WhatsApp Number (With Country Code) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7123 456789 / +971 50..."
                      value={clientWhatsApp}
                      onChange={(e) => setClientWhatsApp(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#888888] mb-1.5 font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="tariq@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333333] text-[#FEFEFE] text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-[#000000] font-bold uppercase text-xs tracking-wider transition-colors shadow-lg"
                >
                  Confirm Zoom Video Session Request →
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. SBP ROSHAN DIGITAL ACCOUNT & LEGAL TITLE TRANSFER GUIDE         */}
      {/* ------------------------------------------------------------------ */}
      <section id="legal-guide" className="py-12 mb-16">
        <SectionHeading
          eyebrow="Legal & Financial Framework"
          title="State Bank Roshan Digital Account (RDA) & Legal Title Transfer Guide"
          subtitle="How non-resident Pakistanis acquire 100% verified real estate and turnkey villas without flying to Pakistan."
          align="left"
        />

        {/* Legal Guide Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar font-mono text-xs border-b border-[#E5E5E5]">
          {[
            { key: 'RDA', label: '1. SBP Roshan Digital Account (RDA)' },
            { key: 'POA', label: '2. Embassy Power of Attorney (POA)' },
            { key: 'TITLE', label: '3. Cantt Board / RDA Title Registry' },
            { key: 'REPATRIATION', label: '4. Capital Gains Repatriation' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveLegalTab(tab.key as any)}
              className={`px-4 py-2.5 uppercase font-bold text-[11px] whitespace-nowrap transition-all border ${
                activeLegalTab === tab.key
                  ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                  : 'bg-[#F4F4F4] text-[#666666] border-[#E5E5E5] hover:border-[#000000] hover:text-[#000000]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: SBP RDA */}
        {activeLegalTab === 'RDA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
            <div className="lg:col-span-7 space-y-4 text-xs font-sans text-[#444444] leading-relaxed">
              <h3 className="text-lg font-bold uppercase font-mono text-[#000000]">
                White-Channel Banking & State Bank SBP RDA Protocol
              </h3>
              <p>
                Purchasing real estate through your **Roshan Digital Account (RDA)** or official foreign currency banking wires guarantees 100% clean title provenance. Under State Bank of Pakistan regulations, funds transmitted through RDA for property acquisition qualify for legal repatriation of capital gains and rental yields.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero undocumented cash exposure:</strong> Every payment is documented via State Bank swift transaction slips (FTNs).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>FBR Active Taxpayer Exemption:</strong> Non-resident Pakistanis holding NICOP obtain preferential withholding tax rates under Section 236K/236C.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Direct Developer/Seller Escrow:</strong> Funds are disbursed only upon verified title verification at the Cantonment Board or RDA registry.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8F8F8] border border-[#E5E5E5] p-6 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-[#888888] block mb-3">
                Approved Partner Banks in Wah / Islamabad:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-[#000000] mb-4">
                <div className="p-2.5 bg-[#FEFEFE] border border-[#E5E5E5]">Meezan Bank RDA</div>
                <div className="p-2.5 bg-[#FEFEFE] border border-[#E5E5E5]">Habib Bank Limited (HBL)</div>
                <div className="p-2.5 bg-[#FEFEFE] border border-[#E5E5E5]">Standard Chartered</div>
                <div className="p-2.5 bg-[#FEFEFE] border border-[#E5E5E5]">Bank Alfalah Roshan</div>
              </div>
              <p className="text-[10px] text-[#666666] leading-relaxed">
                Asad Land Holdings provides formal IBAN verification and milestone invoice billing so your foreign bank releases wires smoothly without compliance delays.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Embassy POA */}
        {activeLegalTab === 'POA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
            <div className="lg:col-span-7 space-y-4 text-xs font-sans text-[#444444] leading-relaxed">
              <h3 className="text-lg font-bold uppercase font-mono text-[#000000]">
                Digital Nadra Overseas POA & Embassy Attestation
              </h3>
              <p>
                If you cannot physically travel to Wah Cantt or Islamabad for property transfer, you can execute a legal **Special Power of Attorney (POA)** in favor of a trusted relative or ALH legal counsel.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Nadra Digital e-POA Portal:</strong> Apply online from anywhere in the world using your biometric smartphone verification.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Embassy Physical Attestation:</strong> Book an appointment at your local Pakistan Embassy / Consulate (e.g. London, Manchester, Dubai, Riyadh, New York).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>MOFA Islamabad Legalization:</strong> Once the POA arrives in Pakistan, ALH handles Ministry of Foreign Affairs (MOFA) attestation within 48 hours.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8F8F8] border border-[#E5E5E5] p-6 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-[#888888] block mb-2">
                Required POA Checklist:
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#444444] mb-4 list-disc pl-4 font-sans">
                <li>Valid Original NICOP / CNIC of Buyer</li>
                <li>Valid Foreign Passport (UK / US / Canadian / UAE Resident)</li>
                <li>Specific Plot / Villa demarcation details in Wah Cantt</li>
                <li>2 Pakistani Witnesses (CNIC copies + Signatures)</li>
              </ul>
              <div className="p-3 bg-amber-400/10 border border-amber-400 text-[11px] text-[#000000] font-sans">
                💡 ALH legal team drafts the exact bilingual POA deed text free of charge for overseas clients.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cantt Board / RDA Title Registry */}
        {activeLegalTab === 'TITLE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
            <div className="lg:col-span-7 space-y-4 text-xs font-sans text-[#444444] leading-relaxed">
              <h3 className="text-lg font-bold uppercase font-mono text-[#000000]">
                Wah Cantt Board & RDA Rawalpindi Title Registry Execution
              </h3>
              <p>
                Every plot, commercial shop, and villa listed through Asad Land Holdings undergo a 3-tier title audit before transaction:
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Title Deed & Allotment Search:</strong> Physical inspection of record files at Kohistan Enclave developer registry, Cantt Board, and RDA Rawalpindi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>On-Ground Plot Peg Marking:</strong> Physical surveyor visit with laser markers to confirm plot dimensions and avoid encroached land files.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Direct Transfer Allotment Letter:</strong> Registered directly in the buyer&apos;s NICOP name with zero intermediate proxies.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8F8F8] border border-[#E5E5E5] p-6 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-[#888888] block mb-2">
                Transfer Timeline:
              </span>
              <div className="space-y-2 text-[11px] text-[#444444] font-sans mb-4">
                <div className="flex justify-between border-b pb-1">
                  <span>Token & Title Search:</span>
                  <span className="font-bold font-mono">1 to 2 Days</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Embassy POA Verification:</span>
                  <span className="font-bold font-mono">3 to 5 Days</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Final Registry Transfer:</span>
                  <span className="font-bold font-mono">1 Day</span>
                </div>
                <div className="flex justify-between">
                  <span>DHL Diplomatic Courier:</span>
                  <span className="font-bold font-mono">3 to 4 Days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Repatriation */}
        {activeLegalTab === 'REPATRIATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 border border-[#E5E5E5] bg-[#FEFEFE]">
            <div className="lg:col-span-7 space-y-4 text-xs font-sans text-[#444444] leading-relaxed">
              <h3 className="text-lg font-bold uppercase font-mono text-[#000000]">
                Legal Repatriation of Capital Gains & Rental Cash Flows
              </h3>
              <p>
                Overseas investors who channel their purchase via SBP RDA or banking channels retain full legal rights under Foreign Exchange Regulations to repatriate their rental yield and capital gains abroad.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Rental Yield Remittance:</strong> Rental income earned from Wah Cantt & Islamabad residential villas can be credited directly to your foreign currency account.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Full Principal & Profit Remittance on Sale:</strong> Upon property resale, the full transaction value is remitted back to the overseas originating bank account.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8F8F8] border border-[#E5E5E5] p-6 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-[#888888] block mb-2">
                Tax Optimization Advice:
              </span>
              <p className="text-[11px] text-[#666666] font-sans leading-relaxed mb-4">
                Our in-house corporate tax consultants provide capital gain tax calculations (FBR Section 37) to ensure maximum net yields in GBP, USD, or AED.
              </p>
              <a
                href={whatsappConsultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-[#000000] text-[#FEFEFE] font-mono font-bold text-center uppercase block text-[11px]"
              >
                Inquire With Tax Consultant
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. OVERSEAS HOT INVESTMENT OPPORTUNITIES (MULTI-CURRENCY DISPLAY)  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 bg-[#F8F8F8] border border-[#E5E5E5] p-6 sm:p-10 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#666666] mb-2 font-bold">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>PRE-VETTED OVERSEAS INVENTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#000000] font-sans">
              Curated Real-Rate Investment Assets
            </h2>
            <p className="text-xs text-[#666666] font-sans mt-1">
              100% on-ground possessed land and turnkey villas in Wah Cantt and Islamabad with verified CDA/RDA clearance.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0 font-mono text-xs">
            <span className="text-[#888888]">Currency:</span>
            <CurrencySwitcher />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overseasHotPicks.map((prop) => (
            <div key={prop.id} className="border border-[#E5E5E5] bg-[#FEFEFE] p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="relative aspect-video bg-[#000000] overflow-hidden mb-4">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#000000] text-[#FEFEFE] text-[9px] font-mono px-2 py-0.5 uppercase font-bold">
                    {prop.society}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-amber-400 text-[#000000] text-[9px] font-mono px-2 py-0.5 uppercase font-bold">
                    {prop.nocStatus}
                  </span>
                </div>

                <div className="text-[10px] font-mono uppercase text-[#666666] mb-1">
                  {prop.sizeMarla} Marla • {prop.propertyType.replace('_', ' ')}
                </div>

                <h3 className="text-base font-bold text-[#000000] uppercase tracking-tight line-clamp-2 mb-3 font-sans">
                  <Link href={`/properties/${prop.id}`} className="hover:underline">
                    {prop.title}
                  </Link>
                </h3>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-end justify-between">
                <div>
                  <span className="text-[9px] font-mono text-[#888888] uppercase block">Demand Rate</span>
                  <PriceDisplay amount={prop.demandPrice} size="md" />
                </div>

                <Link
                  href={`/properties/${prop.id}`}
                  className="px-3 py-2 bg-[#000000] text-[#FEFEFE] font-mono text-[10px] font-bold uppercase hover:bg-[#222222]"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. OVERSEAS MULTI-CURRENCY RETURN ESTIMATOR                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 bg-[#0E0E0E] text-[#FEFEFE] border border-[#262626] p-6 sm:p-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-2 font-bold">
              FOREIGN CURRENCY YIELD ESTIMATOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans mb-4">
              Calculate Your Investment Potential in {activeCurrencyConfig.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed font-sans mb-6">
              See what your foreign currency allocation converts to in high-margin Wah Cantt & Islamabad land, along with projected 3-year capital gains and rental cash flows.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#888888] mb-1">
                  Enter Allocation ({activeCurrencyConfig.code}):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400">{activeCurrencyConfig.symbol}</span>
                  <input
                    type="number"
                    value={calcForeignAmount}
                    onChange={(e) => setCalcForeignAmount(Number(e.target.value) || 0)}
                    className="flex-1 p-3 bg-[#161616] border border-[#333333] text-[#FEFEFE] font-bold text-base focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#141414] border border-[#2E2E2E] space-y-2">
                <div className="flex justify-between text-[#CCCCCC]">
                  <span>Local PKR Value:</span>
                  <span className="font-bold text-[#FEFEFE]">PKR {formatPKRPrice(convertedPKR)}</span>
                </div>
                <div className="flex justify-between text-[#CCCCCC]">
                  <span>Estimated Land Purchasing Power:</span>
                  <span className="font-bold text-amber-400">
                    {convertedPKR >= 45000000 ? '1 Kanal Luxury Designer Villa' : convertedPKR >= 25000000 ? '10 Marla Luxury Possessed Plot' : convertedPKR >= 12000000 ? '5 Marla Executive Plot' : 'Commercial Shop Share'}
                  </span>
                </div>
                <div className="flex justify-between text-[#CCCCCC]">
                  <span>Projected 3-Yr Appreciation (18.4% CAGR):</span>
                  <span className="font-bold text-green-400">
                    +{activeCurrencyConfig.symbol} {Math.round(convertFromPKR(convertedPKR * (Math.pow(1.184, 3) - 1))).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#161616] border border-[#2E2E2E] p-6 sm:p-8 font-sans">
            <h3 className="text-base font-bold uppercase text-[#FEFEFE] font-mono mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Why Wah Cantt & Islamabad Outperform
            </h3>
            <div className="space-y-3 text-xs text-[#B0B0B0] leading-relaxed">
              <p>
                • <strong>Educational Rental Anchor:</strong> Wah Medical College and UET Wah generate year-round student & faculty rental demand, yielding 7.5%–8.2% annual net returns.
              </p>
              <p>
                • <strong>Security & Cantonment Governance:</strong> Strict zoning laws, underground electricity, and 24/7 cantonment security make Kohistan Enclave the most sought-after address for overseas families.
              </p>
              <p>
                • <strong>M-1 Motorway Connectivity:</strong> Direct 25-minute transit to Islamabad International Airport allows overseas expats easy airport access during family visits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2E2E2E]">
              <a
                href={whatsappConsultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-[#000000] font-mono font-bold uppercase text-xs text-center block"
              >
                Discuss Investment Strategy on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. OVERSEAS PAKISTANI LEGAL FAQS                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 border-t border-[#E5E5E5]">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Overseas Pakistani Legal & Tax FAQ"
          subtitle="Clear answers on NICOP ownership rights, FBR tax exemptions, and remote registration."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 font-sans text-xs">
          <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
            <h4 className="font-bold text-sm uppercase text-[#000000] font-mono mb-2">
              Can I purchase property in Pakistan if I hold foreign citizenship (e.g. British / American)?
            </h4>
            <p className="text-[#666666] leading-relaxed">
              Yes. Holders of a National Identity Card for Overseas Pakistanis (NICOP) or Pakistan Origin Card (POC) have full, unrestricted constitutional rights to buy, sell, and own immovable residential and commercial property anywhere in Pakistan with zero foreign ownership restrictions.
            </p>
          </div>

          <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
            <h4 className="font-bold text-sm uppercase text-[#000000] font-mono mb-2">
              Do I have to physically visit Pakistan to register the title deed?
            </h4>
            <p className="text-[#666666] leading-relaxed">
              No. You can execute a legally verified Power of Attorney (POA) through your nearest Pakistani Embassy/Consulate or the Nadra digital e-POA portal. Our legal team will execute the transfer at the Cantonment Board or RDA registry and courier the original allotment letter to your overseas home address via DHL.
            </p>
          </div>

          <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
            <h4 className="font-bold text-sm uppercase text-[#000000] font-mono mb-2">
              How are overseas construction milestones verified during building?
            </h4>
            <p className="text-[#666666] leading-relaxed">
              Our civil engineering department provides bi-weekly 4K drone videos and detailed structural inspection logs for every stage (excavation, steel footings, slab casting, DPC moisture barrier, and interior finishing). You only release milestone funds after video verification.
            </p>
          </div>

          <div className="p-6 border border-[#E5E5E5] bg-[#FEFEFE]">
            <h4 className="font-bold text-sm uppercase text-[#000000] font-mono mb-2">
              What are the tax rates for overseas Pakistanis on property purchase?
            </h4>
            <p className="text-[#666666] leading-relaxed">
              Non-resident Pakistanis who file an annual income tax return (or declare non-resident overseas status with FBR) pay the lowest 3% advance tax under Section 236K, rather than the punitive 12%+ non-filer penalty rate. ALH corporate tax consultants assist clients with active taxpayer registration.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
