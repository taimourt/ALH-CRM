'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Button } from '@/components/website/Button';
import { PropertyCard } from '@/components/website/PropertyCard';
import { PROPERTIES_DATA } from '@/lib/website-data';
import { submitWebsiteLead, extractUTMParameters } from '@/lib/lead-service';
import { trackEvent } from '@/lib/analytics';
import { Compass, CheckCircle2, ArrowRight, RotateCcw, MessageSquare } from 'lucide-react';

export default function FindPropertyPage() {
  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('RESIDENTIAL_PLOT');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('BUILD');
  const [selectedBudget, setSelectedBudget] = useState<number>(15000000);
  const [selectedCity, setSelectedCity] = useState<string>('Wah Cantt');
  const [selectedSizeMarla, setSelectedSizeMarla] = useState<number>(10);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('Immediate Construction');

  // Lead Submission Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackEvent('property_finder_started');
  }, []);

  // Matching Logic: Find exact matches or nearest alternatives
  const matchedProperties = PROPERTIES_DATA.filter((p) => {
    if (selectedType && p.propertyType !== selectedType) return false;
    if (selectedBudget && p.demandPrice > selectedBudget * 1.2) return false;
    return true;
  });

  const displayProperties = matchedProperties.length > 0 ? matchedProperties : PROPERTIES_DATA.slice(0, 3);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const utm = extractUTMParameters();

    try {
      await submitWebsiteLead({
        name,
        phone,
        email,
        requirement: `Property Finder: ${selectedType} in ${selectedCity} for ${selectedPurpose}`,
        propertyType: selectedType,
        size: `${selectedSizeMarla} Marla`,
        budget: selectedBudget,
        purpose: selectedPurpose,
        timeline: selectedTimeline,
        notes: `Property Matchmaker Requirement Submitted | Preferred City: ${selectedCity} | Timeline: ${selectedTimeline}`,
        ...utm,
      });

      trackEvent('property_finder_completed', {
        selectedType,
        selectedCity,
        selectedBudget,
      });
      trackEvent('lead_created', { source: 'PROPERTY_FINDER' });

      setIsLeadSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
      alert('Unable to submit lead. Please try again or connect via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedType('RESIDENTIAL_PLOT');
    setSelectedPurpose('BUILD');
    setSelectedBudget(15000000);
    setSelectedCity('Wah Cantt');
    setSelectedSizeMarla(10);
    setSelectedTimeline('Immediate Construction');
    setIsLeadSubmitted(false);
    trackEvent('property_finder_started');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Property Finder Matchmaker' }]} />

      <SectionHeading
        eyebrow="Interactive Intelligence Tool"
        title="Find My Property Matchmaker"
        subtitle="Select your preferred category, purpose, budget, location, size, and timeline parameters to receive real-rate matches."
        align="center"
      />

      {/* Wizard Card Container */}
      <div className="border border-[#000000] p-8 md:p-12 bg-[#FEFEFE] my-8 relative overflow-hidden">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5] font-mono text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#000000]" />
            <span className="font-bold text-[#000000] uppercase">
              Step {step} of 6: {step === 1 && 'Asset Type'} {step === 2 && 'Intended Purpose'} {step === 3 && 'Budget Limit'} {step === 4 && 'Target Location'} {step === 5 && 'Plot Size'} {step === 6 && 'Timeline & Matches'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-6 h-6 flex items-center justify-center text-[10px] border ${
                  step === s ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#666666] border-[#E5E5E5]'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: ASSET TYPE */}
        {step === 1 && (
          <div className="space-y-6 font-sans">
            <h3 className="text-xl font-bold uppercase text-[#000000]">
              Step 1: What type of real estate are you looking for?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              {[
                { cat: 'RESIDENTIAL_PLOT', label: 'Residential Plot', desc: 'On-ground plot for immediate villa construction.' },
                { cat: 'HOUSE_VILLA', label: 'Luxury House / Villa', desc: 'Turnkey brand new designer villa.' },
                { cat: 'COMMERCIAL_PLOT', label: 'Commercial Plot', desc: 'Civic center shop or plaza plot for rental yield.' },
              ].map((item) => (
                <button
                  key={item.cat}
                  type="button"
                  onClick={() => setSelectedType(item.cat)}
                  className={`p-6 border text-left transition-all ${
                    selectedType === item.cat
                      ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                      : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
                  }`}
                >
                  <span className="font-bold text-sm block uppercase mb-1">{item.label}</span>
                  <span className="text-[10px] text-[#BDBDBD] block font-sans">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button onClick={() => setStep(2)} variant="primary" size="md">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PURPOSE */}
        {step === 2 && (
          <div className="space-y-6 font-sans">
            <h3 className="text-xl font-bold uppercase text-[#000000]">
              Step 2: What is your primary investment purpose?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {[
                { p: 'BUILD', label: 'House Construction', desc: 'Planning to build house within 6 months.' },
                { p: 'INVESTMENT', label: 'Capital Appreciation', desc: 'Seeking 3-year land growth.' },
                { p: 'RENTAL', label: 'Rental Income', desc: 'Targeting student & commercial rental returns.' },
                { p: 'COMMERCIAL', label: 'Business Hub', desc: 'Setting up retail plaza or corporate office.' },
              ].map((item) => (
                <button
                  key={item.p}
                  type="button"
                  onClick={() => setSelectedPurpose(item.p)}
                  className={`p-6 border text-left transition-all ${
                    selectedPurpose === item.p
                      ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                      : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
                  }`}
                >
                  <span className="font-bold text-sm block uppercase mb-1">{item.label}</span>
                  <span className="text-[10px] text-[#BDBDBD] block font-sans">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button onClick={() => setStep(1)} variant="secondary" size="md">
                Back
              </Button>
              <Button onClick={() => setStep(3)} variant="primary" size="md">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {step === 3 && (
          <div className="space-y-6 font-sans">
            <h3 className="text-xl font-bold uppercase text-[#000000]">
              Step 3: Set your maximum budget limit:
            </h3>

            <div className="font-mono p-6 bg-[#F4F4F4] border border-[#E5E5E5]">
              <div className="flex justify-between text-xs uppercase text-[#666666] mb-2">
                <span>Maximum Budget Horizon</span>
                <span className="font-bold text-[#000000] text-base">
                  PKR {(selectedBudget / 10000000).toFixed(2)} Crore (PKR {selectedBudget.toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={50000000}
                step={1000000}
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(Number(e.target.value))}
                className="w-full accent-[#000000]"
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button onClick={() => setStep(2)} variant="secondary" size="md">
                Back
              </Button>
              <Button onClick={() => setStep(4)} variant="primary" size="md">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION */}
        {step === 4 && (
          <div className="space-y-6 font-sans">
            <h3 className="text-xl font-bold uppercase text-[#000000]">
              Step 4: Select your preferred society location:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              {[
                { city: 'Wah Cantt', desc: 'Kohistan Enclave & New City Phase 2' },
                { city: 'Islamabad', desc: 'Zone 2, Multi Gardens B-17' },
                { city: 'Taxila / Wah', desc: 'Faisal Hills GT Road Interchange' },
              ].map((item) => (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => setSelectedCity(item.city)}
                  className={`p-6 border text-left transition-all ${
                    selectedCity === item.city
                      ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                      : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
                  }`}
                >
                  <span className="font-bold text-sm block uppercase mb-1">{item.city}</span>
                  <span className="text-[10px] text-[#BDBDBD] block font-sans">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button onClick={() => setStep(3)} variant="secondary" size="md">
                Back
              </Button>
              <Button onClick={() => setStep(5)} variant="primary" size="md">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: SIZE & TIMELINE */}
        {step === 5 && (
          <div className="space-y-6 font-sans">
            <h3 className="text-xl font-bold uppercase text-[#000000]">
              Step 5: Select plot size category & acquisition timeline:
            </h3>

            <div className="font-mono text-xs space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-[#666666] mb-2">Plot Size Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 7, 10, 20].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedSizeMarla(m)}
                      className={`py-3 px-3 border text-center font-bold ${
                        selectedSizeMarla === m ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {m} Marla
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#666666] mb-2">Acquisition Timeline</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Immediate Construction', '3 to 6 Months', '1 Year+ Investment'].map((tl) => (
                    <button
                      key={tl}
                      type="button"
                      onClick={() => setSelectedTimeline(tl)}
                      className={`py-3 px-2 border text-center text-[11px] ${
                        selectedTimeline === tl ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {tl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button onClick={() => setStep(4)} variant="secondary" size="md">
                Back
              </Button>
              <Button onClick={() => setStep(6)} variant="primary" size="md">
                View Matches & Request Details <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: MATCHES & LEAD CAPTURE */}
        {step === 6 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold uppercase text-[#000000] font-sans">
                  {matchedProperties.length > 0 ? 'Matched Real-Rate Properties' : 'Nearest Alternative Properties'}
                </h3>
                <span className="text-xs text-[#666666] font-mono">
                  Criteria: {selectedType.replace('_', ' ')} • {selectedCity} • {selectedSizeMarla} Marla • Max PKR {(selectedBudget / 10000000).toFixed(2)} Crore
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#666666] hover:text-[#000000]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>

            {/* Matched Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {displayProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Lead Capture Form */}
            <div className="mt-10 p-8 border border-[#000000] bg-[#F4F4F4]">
              <h4 className="text-base font-bold uppercase text-[#000000] font-mono mb-2">
                Submit Requirement to Receive Unlisted Off-Market Plots
              </h4>
              <p className="text-xs text-[#666666] font-sans mb-6">
                Receive unlisted plot options matching these exact parameters directly on WhatsApp from Managing Director Asad Ali.
              </p>

              {isLeadSubmitted ? (
                <div className="p-6 bg-[#FEFEFE] border border-[#000000] text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#000000] mx-auto mb-2" />
                  <span className="font-mono uppercase font-bold text-[#000000] block text-sm mb-1">
                    Requirement Registered
                  </span>
                  <p className="text-xs text-[#666666] font-sans">
                    Our Wah Cantt desk will contact you via WhatsApp with verified plot deeds.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-[#666666] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ch. Muhammad Akram"
                        className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#666666] mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 5123456"
                        className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#666666] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="akram@example.com"
                        className="w-full bg-[#FEFEFE] border border-[#000000] p-3 text-[#000000] rounded-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Requirement...' : 'Submit Requirement & Get WhatsApp Deeds'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
