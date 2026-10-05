'use client';

import React, { useState } from 'react';
import { PRICE_ALERT_PRESETS, PriceAlertPreset } from '@/lib/rate-index-data';
import { PriceDisplay, formatPKRPrice } from '@/components/website/PriceDisplay';
import { useCurrency } from '@/contexts/currency-context';
import { 
  BellRing, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Phone, 
  Mail, 
  User, 
  Building2, 
  ShieldCheck, 
  Globe, 
  MessageSquare,
  Sliders,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface PriceAlertSubscriptionProps {
  initialSocietySlug?: string;
  initialPlotSize?: string;
  className?: string;
}

export function PriceAlertSubscription({
  initialSocietySlug = 'kohistan-enclave-wah',
  initialPlotSize = '10 Marla',
  className = '',
}: PriceAlertSubscriptionProps) {
  const { currency } = useCurrency();

  // Form State
  const [society, setSociety] = useState<string>(initialSocietySlug);
  const [plotSize, setPlotSize] = useState<string>(initialPlotSize);
  const [targetPricePKR, setTargetPricePKR] = useState<number>(14000000); // 1.4 Crore default
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [investorType, setInvestorType] = useState<'OVERSEAS' | 'RESIDENT'>('OVERSEAS');
  const [horizon, setHorizon] = useState<'IMMEDIATE' | '3_MONTHS' | 'WATCHING'>('IMMEDIATE');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Apply Quick Preset
  const applyPreset = (preset: PriceAlertPreset) => {
    setSociety(preset.societySlug);
    setPlotSize(preset.plotSize);
    setTargetPricePKR(preset.suggestedThresholdPKR);
  };

  const getSocietyName = (slug: string) => {
    switch (slug) {
      case 'kohistan-enclave-wah': return 'Kohistan Enclave Wah';
      case 'new-city-phase-2-wah': return 'New City Phase 2 Wah';
      case 'multi-gardens-b17-islamabad': return 'Multi Gardens B-17';
      default: return 'Wah Cantt / Islamabad';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !fullName) return;
    setIsSubmitted(true);
  };

  const whatsappNotificationUrl = `https://wa.me/923218004186?text=${encodeURIComponent(
    `Hi Asad Land Holdings, please register my Real-Rate Price Alert:\n- Target: ${plotSize} in ${getSocietyName(society)}\n- Alert Trigger: Below ${formatPKRPrice(targetPricePKR)}\n- Buyer: ${fullName} (${investorType})\n- Horizon: ${horizon}`
  )}`;

  return (
    <div className={`bg-[#0D0F12] text-[#FEFEFE] border border-[#262A36] p-6 sm:p-8 font-mono select-none ${className}`}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. HEADER & VALUE PROPOSITION                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222634]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 font-bold">
              <BellRing className="w-3 h-3" /> Real-Rate Drop Radar
            </span>
            <span className="text-[10px] text-[#CCCCCC] uppercase">
              • Direct WhatsApp & SMS Instant Notification
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#FEFEFE] uppercase">
            Set Automated Price Alert
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#AAAAAA]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Spam • Notified only on verified distress/urgent seller deeds</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. QUICK PRESET PILLS                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="my-6">
        <span className="text-[10px] uppercase text-[#CCCCCC] block mb-2 font-bold">
          ⚡ Popular Alert Presets (Click to Auto-Configure):
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {PRICE_ALERT_PRESETS.map((p) => {
            const isMatch = society === p.societySlug && plotSize === p.plotSize && targetPricePKR === p.suggestedThresholdPKR;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`px-3 py-1.5 border text-left transition-all ${
                  isMatch
                    ? 'bg-[#F59E0B] text-[#0A0A0A] font-bold border-[#F59E0B]'
                    : 'bg-[#151821] text-[#CCCCCC] border-[#2A2F3D] hover:border-[#F59E0B]/50'
                }`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. INTERACTIVE BUILDER FORM                                        */}
      {/* ------------------------------------------------------------------ */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Society Select */}
            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1.5 font-bold">
                Target Society:
              </label>
              <select
                value={society}
                onChange={(e) => setSociety(e.target.value)}
                className="w-full p-2.5 bg-[#161922] border border-[#2B3040] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="kohistan-enclave-wah">Kohistan Enclave Wah Cantt</option>
                <option value="new-city-phase-2-wah">New City Phase 2 Wah Cantt</option>
                <option value="multi-gardens-b17-islamabad">Multi Gardens B-17 Islamabad</option>
              </select>
            </div>

            {/* Plot Size Select */}
            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1.5 font-bold">
                Plot Cutting:
              </label>
              <select
                value={plotSize}
                onChange={(e) => setPlotSize(e.target.value)}
                className="w-full p-2.5 bg-[#161922] border border-[#2B3040] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
              >
                <option value="5 Marla">5 Marla</option>
                <option value="7 Marla">7 Marla</option>
                <option value="8 Marla">8 Marla</option>
                <option value="10 Marla">10 Marla (Executive)</option>
                <option value="1 Kanal">1 Kanal (Luxury)</option>
                <option value="4 Marla Commercial">4 Marla Commercial Plaza</option>
              </select>
            </div>

            {/* Buyer Profile Select */}
            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1.5 font-bold">
                Investor Profile:
              </label>
              <div className="grid grid-cols-2 gap-1 bg-[#161922] p-1 border border-[#2B3040]">
                <button
                  type="button"
                  onClick={() => setInvestorType('OVERSEAS')}
                  className={`py-1.5 text-[11px] uppercase transition-colors ${
                    investorType === 'OVERSEAS' ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold' : 'text-[#CCCCCC]'
                  }`}
                >
                  Overseas (UK/US/Gulf)
                </button>
                <button
                  type="button"
                  onClick={() => setInvestorType('RESIDENT')}
                  className={`py-1.5 text-[11px] uppercase transition-colors ${
                    investorType === 'RESIDENT' ? 'bg-[#FEFEFE] text-[#0A0A0A] font-bold' : 'text-[#CCCCCC]'
                  }`}
                >
                  Local Resident
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Target Price Trigger Slider */}
          <div className="p-4 bg-[#141720] border border-[#262A38]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-[#AAAAAA]">
                Alert Trigger Threshold:
              </span>
              <div className="text-right">
                <span className="text-[10px] text-[#CCCCCC] uppercase block">Notify me if plot drops below:</span>
                <span className="text-lg font-black text-[#F59E0B]">
                  <PriceDisplay amount={targetPricePKR} />
                </span>
              </div>
            </div>

            <input
              type="range"
              min={3000000}
              max={45000000}
              step={500000}
              value={targetPricePKR}
              onChange={(e) => setTargetPricePKR(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-[#A0AEC0] mt-2">
              <span>PKR 30 Lakh (Starter File)</span>
              <span>PKR 2.0 Crore</span>
              <span>PKR 4.5 Crore (Commercial / 1 Kanal)</span>
            </div>
          </div>

          {/* Buyer Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1 font-bold">
                Your Full Name:
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#161922] border border-[#2B3040] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1 font-bold">
                WhatsApp Phone Number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567 / +44 7..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#161922] border border-[#2B3040] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#AAAAAA] mb-1 font-bold">
                Email Address (Optional):
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#161922] border border-[#2B3040] text-xs text-[#FEFEFE] focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#F59E0B] hover:bg-[#d97706] text-[#0A0A0A] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
          >
            <BellRing className="w-4 h-4" />
            <span>Activate Real-Rate Drop Alert for {plotSize} in {getSocietyName(society)}</span>
          </button>
        </form>
      ) : (
        /* Success State */
        <div className="p-6 bg-[#151C17] border border-emerald-900/60 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-base font-bold uppercase">Price Alert Successfully Registered</h4>
              <p className="text-xs text-[#AAAAAA] font-sans">
                You will receive an instant priority notification the moment a verified seller lists a <strong>{plotSize}</strong> in <strong>{getSocietyName(society)}</strong> below <strong>{formatPKRPrice(targetPricePKR)}</strong>.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-3">
            <a
              href={whatsappNotificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] text-xs font-bold uppercase flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Confirm on WhatsApp with Asad Ali</span>
            </a>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-[#CCCCCC] hover:text-[#FEFEFE] underline"
            >
              Set Another Price Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
