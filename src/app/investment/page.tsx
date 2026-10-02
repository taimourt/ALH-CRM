'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { StatBlock } from '@/components/website/StatBlock';
import { CTASection } from '@/components/website/CTASection';
import { RealRateTicker } from '@/components/website/RealRateTicker';
import { HistoricalRateChart } from '@/components/website/HistoricalRateChart';
import { PriceAlertSubscription } from '@/components/website/PriceAlertSubscription';
import { INVESTMENT_REPORTS } from '@/lib/website-data';
import { TrendingUp, ShieldCheck, CheckCircle2, FileText, ArrowRight, Scale, BellRing } from 'lucide-react';

export default function InvestmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Investment Intelligence' }]} />

      <SectionHeading
        eyebrow="Empirical Real Estate Economics"
        title="Investment Intelligence Hub"
        subtitle="Data-driven capital growth projections, rental yield comparisons, and regulatory title verification for Wah Cantt, Taxila, and Islamabad."
      />

      {/* 1. REAL TRANSACTION TICKER */}
      <div className="mb-12 border border-[#262626]">
        <RealRateTicker />
      </div>

      {/* 2. METRICS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBlock value="18.4%" label="Kohistan Enclave CAGR" sublabel="5-Year compound annual growth rate for Block A." />
        <StatBlock value="8.2%" label="Peak Rental Yield" sublabel="Achieved on turnkey modern villas in Wah Cantt." />
        <StatBlock value="100%" label="Title Verification" sublabel="CDA / RDA & Cantt Board verified titles." />
        <StatBlock value="PKR 2,450" label="Grey Structure Baseline" sublabel="Current 2026 engineering cost per SqFt." />
      </div>

      {/* 3. HISTORICAL RATE CHART SECTION */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest font-bold block">
              Market Intelligence Feature 5
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-mono text-[#000000] uppercase">
              5-Year Real vs. Speculative Rate Index
            </h3>
          </div>
          <Link
            href="/investment/rate-index"
            className="text-xs font-mono font-bold uppercase text-[#000000] hover:underline flex items-center gap-1"
          >
            <span>Full Rate Index Page</span> &rarr;
          </Link>
        </div>

        <HistoricalRateChart />
      </div>

      {/* 4. PRICE ALERT SUBSCRIPTION WIDGET */}
      <div className="mb-16">
        <PriceAlertSubscription />
      </div>

      {/* 5. CORE PHILOSOPHY COMPARISON TABLE */}
      <div className="border border-[#000000] p-8 bg-[#FEFEFE] mb-16">
        <h3 className="text-xl font-bold uppercase text-[#000000] font-mono mb-6">
          Real Rates vs. Speculative Files Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#000000] bg-[#F4F4F4]">
                <th className="p-4 text-[#000000]">Evaluation Parameter</th>
                <th className="p-4 text-[#000000]">Asad Land Holdings Real Rates</th>
                <th className="p-4 text-[#666666]">Speculative Paper Files</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              <tr>
                <td className="p-4 font-bold text-[#000000]">Plot Possession</td>
                <td className="p-4 text-[#000000]">On-ground plot number with physical boundaries.</td>
                <td className="p-4 text-[#666666]">Unallocated paper file with no physical location.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#000000]">Regulatory Approval</td>
                <td className="p-4 text-[#000000]">RDA / CDA or Cantt Board NOC clear.</td>
                <td className="p-4 text-[#666666]">Unapproved layout plans subject to cancellation.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#000000]">Capital Liquidity</td>
                <td className="p-4 text-[#000000]">High end-user buyer demand for immediate house construction.</td>
                <td className="p-4 text-[#666666]">Dependent on market speculation and broker hype.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#000000]">Rental Returns</td>
                <td className="p-4 text-[#000000]">Active 7% – 8.2% annual rental yields upon building completion.</td>
                <td className="p-4 text-[#666666]">Zero rental income potential.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Reports List */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold uppercase text-[#000000] font-mono mb-8">
          Featured Investment Reports & Benchmarks
        </h2>

        <div className="space-y-8">
          {INVESTMENT_REPORTS.map((report) => (
            <div key={report.id} className="border border-[#E5E5E5] p-8 bg-[#F4F4F4]">
              <div className="flex items-center gap-3 text-xs font-mono text-[#666666] mb-3">
                <span className="px-2 py-0.5 bg-[#000000] text-[#FEFEFE] text-[9px] uppercase font-bold">
                  {report.category.replace('_', ' ')}
                </span>
                <span>{report.publishedDate}</span>
                <span>•</span>
                <span>{report.readTime}</span>
              </div>

              <h3 className="text-xl font-bold uppercase text-[#000000] font-sans mb-3">
                {report.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-sans mb-6">
                {report.summary}
              </p>

              <div className="p-4 bg-[#FEFEFE] border border-[#E5E5E5] mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] font-bold block mb-2">
                  Key Investment Findings:
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

              <span className="text-xs font-mono text-[#666666]">
                Author: <strong className="text-[#000000]">{report.author}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <CTASection
        title="REQUEST A CUSTOM INVESTMENT PORTFOLIO"
        subtitle="Get personalized plot recommendations matching your exact 3-year return timeline."
      />
    </div>
  );
}
