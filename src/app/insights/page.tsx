'use client';

import React from 'react';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { INVESTMENT_REPORTS } from '@/lib/website-data';
import { CheckCircle2 } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Market Insights' }]} />

      <SectionHeading
        eyebrow="Architectural & Market Research"
        title="Real Estate Insights & Technical Guides"
        subtitle="Empirical articles on Wah Cantt property laws, CDA/RDA regulations, steel and cement cost baselines, and investment strategies."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {INVESTMENT_REPORTS.map((report) => (
          <div key={report.id} className="border border-[#E5E5E5] p-8 bg-[#FEFEFE] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#666666] uppercase mb-3">
                <span className="px-2 py-0.5 bg-[#000000] text-[#FEFEFE] font-bold">
                  {report.category.replace('_', ' ')}
                </span>
                <span>{report.publishedDate}</span>
                <span>•</span>
                <span>{report.readTime}</span>
              </div>

              <h2 className="text-xl font-bold uppercase text-[#000000] font-sans mb-3">
                {report.title}
              </h2>

              <p className="text-xs text-[#666666] leading-relaxed font-sans mb-6">
                {report.summary}
              </p>

              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] font-bold block mb-2">
                  Executive Summary Takeaways:
                </span>
                <ul className="space-y-1.5 font-sans text-xs text-[#444444]">
                  {report.keyTakeaways.map((take, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#000000] shrink-0 mt-0.5" />
                      <span>{take}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-mono">
              <span className="text-[#666666]">{report.author}</span>
              <span className="text-[#000000] font-bold uppercase">Asad Land Holdings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
