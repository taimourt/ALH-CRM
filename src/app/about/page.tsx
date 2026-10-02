'use client';

import React from 'react';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { SignatureAccent } from '@/components/website/SignatureAccent';
import { AgentCard } from '@/components/website/AgentCard';
import { StatBlock } from '@/components/website/StatBlock';
import { CTASection } from '@/components/website/CTASection';
import { ArchitecturalLine } from '@/components/website/ArchitecturalLine';
import { AGENTS_DATA } from '@/lib/website-data';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'About Asad Land Holdings' }]} />

      <SectionHeading
        eyebrow="Architectural Integrity"
        title="About Asad Land Holdings"
        subtitle="Wah Cantt and Islamabad&apos;s premier real-estate investment, sales, and turnkey villa construction company."
      />

      {/* Hero Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold uppercase text-[#000000] font-mono mb-4">
            Founded on Empirical Valuation
          </h2>
          <p className="text-sm text-[#444444] leading-relaxed font-sans mb-4">
            Asad Land Holdings was established to eliminate speculative inflation and opaque file trading from the real-estate sector in Wah Cantt, Taxila, and Islamabad. By focusing strictly on verified registry transfers, physical plot boundaries, and civil engineering standards, we ensure our clients acquire high-yielding land at real market rates.
          </p>
          <p className="text-sm text-[#444444] leading-relaxed font-sans mb-8">
            Our dual expertise in land acquisition and turnkey architectural construction allows us to guide investors seamlessly from raw land purchase to complete villa handover with 100% financial clarity.
          </p>

          <SignatureAccent name="Asad Ali" title="Founder & Managing Director" />
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <StatBlock value="14+" label="Years Experience" sublabel="In Wah Cantt & Taxila land records." />
          <StatBlock value="100%" label="Title Clearance" sublabel="CDA, RDA, and Cantt Board verified." />
          <StatBlock value="500+" label="Properties Managed" sublabel="Across residential & commercial sectors." />
          <StatBlock value="0 PKR" label="Hidden Markups" sublabel="Transparent buyer-seller commission model." />
        </div>
      </div>

      <ArchitecturalLine className="my-12" size="md" withLabel="Leadership & Engineering Advisors" />

      {/* Leadership Team */}
      <div className="space-y-8 mb-16">
        {AGENTS_DATA.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <CTASection />
    </div>
  );
}
