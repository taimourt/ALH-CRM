'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Button } from '@/components/website/Button';
import { formatPKRPrice } from '@/components/website/PriceDisplay';
import { trackEvent } from '@/lib/analytics';
import {
  Calculator,
  TrendingUp,
  Hammer,
  Scale,
  Percent,
  RefreshCw,
  FileCheck,
  Building,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<number>(1);

  // ---------------------------------------------------------------------------
  // CALCULATOR 1: ROI CALCULATOR
  // ---------------------------------------------------------------------------
  const [roiPrice, setRoiPrice] = useState<number>(14500000);
  const [roiYears, setRoiYears] = useState<number>(3);
  const [roiRate, setRoiRate] = useState<number>(18);
  const roiFutureValue = roiPrice * Math.pow(1 + roiRate / 100, roiYears);
  const roiCapitalGain = roiFutureValue - roiPrice;
  const roiAnnualRental = roiPrice * 0.078;

  // ---------------------------------------------------------------------------
  // CALCULATOR 2: INSTALLMENT CALCULATOR
  // ---------------------------------------------------------------------------
  const [instTotalPrice, setInstTotalPrice] = useState<number>(10000000);
  const [instDownPaymentPct, setInstDownPaymentPct] = useState<number>(25);
  const [instMonths, setInstMonths] = useState<number>(36);
  const instDownPaymentAmt = (instTotalPrice * instDownPaymentPct) / 100;
  const instRemainingAmt = instTotalPrice - instDownPaymentAmt;
  const instMonthlyAmt = instRemainingAmt / instMonths;
  const instQuarterlyAmt = instRemainingAmt / (instMonths / 3);

  // ---------------------------------------------------------------------------
  // CALCULATOR 3: APPRECIATION CALCULATOR
  // ---------------------------------------------------------------------------
  const [appInitVal, setAppInitVal] = useState<number>(8500000);
  const [appYears, setAppYears] = useState<number>(5);
  const [appCagr, setAppCagr] = useState<number>(16.5);
  const appProjected = appInitVal * Math.pow(1 + appCagr / 100, appYears);

  // ---------------------------------------------------------------------------
  // CALCULATOR 4: BUY VS RENT CALCULATOR
  // ---------------------------------------------------------------------------
  const [bvrPropertyValue, setBvrPropertyValue] = useState<number>(25000000);
  const [bvrMonthlyRent, setBvrMonthlyRent] = useState<number>(120000);
  const [bvrYears, setBvrYears] = useState<number>(5);
  const totalRentPaid = bvrMonthlyRent * 12 * bvrYears * 1.1; // 10% annual rent escalation
  const equityGrowth = bvrPropertyValue * Math.pow(1.15, bvrYears) - bvrPropertyValue;

  // ---------------------------------------------------------------------------
  // CALCULATOR 5: PLOT SIZE CONVERTER
  // ---------------------------------------------------------------------------
  const [converterValue, setConverterValue] = useState<number>(10);
  const [converterUnit, setConverterUnit] = useState<'MARLA' | 'SQFT' | 'SQYD' | 'KANAL'>('MARLA');

  let sizeMarla = converterValue;
  if (converterUnit === 'SQFT') sizeMarla = converterValue / 225;
  else if (converterUnit === 'SQYD') sizeMarla = converterValue / 25;
  else if (converterUnit === 'KANAL') sizeMarla = converterValue * 20;

  const sizeSqFt = sizeMarla * 225;
  const sizeSqYd = sizeSqFt / 9;
  const sizeKanal = sizeMarla / 20;

  // ---------------------------------------------------------------------------
  // CALCULATOR 6: PRICE PER MARLA & SQFT CALCULATOR
  // ---------------------------------------------------------------------------
  const [unitDemandPrice, setUnitDemandPrice] = useState<number>(14500000);
  const [unitMarla, setUnitMarla] = useState<number>(10);
  const unitPricePerMarla = unitMarla > 0 ? unitDemandPrice / unitMarla : 0;
  const unitPricePerSqFt = unitMarla > 0 ? unitDemandPrice / (unitMarla * 225) : 0;

  // ---------------------------------------------------------------------------
  // CALCULATOR 7: TURNKEY CONSTRUCTION COST ESTIMATOR
  // ---------------------------------------------------------------------------
  const [constAreaSqFt, setConstAreaSqFt] = useState<number>(2400);
  const [constTier, setConstTier] = useState<'GREY' | 'A_PLUS'>('A_PLUS');
  const constRatePerSqFt = constTier === 'GREY' ? 2550 : 5200;
  const totalConstCost = constAreaSqFt * constRatePerSqFt;

  // ---------------------------------------------------------------------------
  // CALCULATOR 8: PROPERTY TRANSFER COST & PK TAX ESTIMATOR
  // ---------------------------------------------------------------------------
  const [transferPrice, setTransferPrice] = useState<number>(15000000);
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const fbrTaxPct = isFiler ? 3 : 6;
  const stampDutyPct = 2;
  const tmaFeePct = 1;
  const cvtPct = 2;

  const fbrTaxAmt = (transferPrice * fbrTaxPct) / 100;
  const stampDutyAmt = (transferPrice * stampDutyPct) / 100;
  const tmaFeeAmt = (transferPrice * tmaFeePct) / 100;
  const cvtAmt = (transferPrice * cvtPct) / 100;
  const totalTransferTaxes = fbrTaxAmt + stampDutyAmt + tmaFeeAmt + cvtAmt;

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
    trackEvent('calculator_used', { tabIndex: tab });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'PropTech Calculators Hub' }]} />

      <SectionHeading
        eyebrow="Proprietary Financial Tools"
        title="Real Estate & Construction Calculators"
        subtitle="Empirical models for ROI, installment schedules, Pakistan transfer taxes, appreciation modeling, and construction costs."
      />

      {/* Calculator Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#000000] pb-4 mb-10 font-mono text-xs">
        {[
          { id: 1, name: 'ROI Calculator', icon: TrendingUp },
          { id: 2, name: 'Installments', icon: Calculator },
          { id: 3, name: 'Appreciation', icon: Percent },
          { id: 4, name: 'Buy vs Rent', icon: Scale },
          { id: 5, name: 'Plot Size Converter', icon: RefreshCw },
          { id: 6, name: 'Price Per Marla', icon: DollarSign },
          { id: 7, name: 'Construction BOQ', icon: Hammer },
          { id: 8, name: 'PK Transfer Taxes', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 flex items-center gap-2 border uppercase font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                  : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROI CALCULATOR */}
      {activeTab === 1 && (
        <div className="border border-[#000000] p-8 bg-[#FEFEFE]">
          <h2 className="text-xl font-bold uppercase text-[#000000] font-mono mb-6 pb-2 border-b border-[#E5E5E5]">
            1. Investment ROI & Yield Calculator
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] text-[#666666] uppercase mb-1">
                  <span>Initial Property Purchase Price</span>
                  <span className="font-bold text-[#000000]">{formatPKRPrice(roiPrice)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={50000000}
                  step={500000}
                  value={roiPrice}
                  onChange={(e) => setRoiPrice(Number(e.target.value))}
                  className="w-full accent-[#000000]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-1">Holding Horizon (Years)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((y) => (
                    <button
                      key={y}
                      onClick={() => setRoiYears(y)}
                      className={`py-2 px-3 border text-center font-bold ${
                        roiYears === y ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {y} Yrs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#666666] uppercase mb-1">
                  <span>Assumed Annual Appreciation Rate (%)</span>
                  <span className="font-bold text-[#000000]">{roiRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  step={1}
                  value={roiRate}
                  onChange={(e) => setRoiRate(Number(e.target.value))}
                  className="w-full accent-[#000000]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[10px] uppercase text-[#666666] block">Estimated Capital Gain</span>
                <span className="text-xl font-black text-[#000000] block mt-1">
                  +{formatPKRPrice(roiCapitalGain)}
                </span>
              </div>

              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[10px] uppercase text-[#666666] block">Est. Annual Rental Income (7.8% Yield)</span>
                <span className="text-xl font-black text-[#000000] block mt-1">
                  {formatPKRPrice(roiAnnualRental)} / yr
                </span>
              </div>

              <div className="p-6 bg-[#000000] text-[#FEFEFE]">
                <span className="text-[10px] uppercase tracking-widest text-[#BDBDBD] block mb-1">
                  Total Projected Asset Value in {roiYears} Years
                </span>
                <div className="text-3xl font-black">{formatPKRPrice(roiFutureValue)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTALLMENT CALCULATOR */}
      {activeTab === 2 && (
        <div className="border border-[#000000] p-8 bg-[#FEFEFE]">
          <h2 className="text-xl font-bold uppercase text-[#000000] font-mono mb-6 pb-2 border-b border-[#E5E5E5]">
            2. Plot Installment & Payment Schedule Calculator
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] text-[#666666] uppercase mb-1">
                  <span>Total Plot Package Price</span>
                  <span className="font-bold text-[#000000]">{formatPKRPrice(instTotalPrice)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={30000000}
                  step={500000}
                  value={instTotalPrice}
                  onChange={(e) => setInstTotalPrice(Number(e.target.value))}
                  className="w-full accent-[#000000]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-1">Down Payment Percentage (%)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setInstDownPaymentPct(pct)}
                      className={`py-2 px-3 border text-center font-bold ${
                        instDownPaymentPct === pct ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-1">Installment Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 36].map((m) => (
                    <button
                      key={m}
                      onClick={() => setInstMonths(m)}
                      className={`py-2 px-3 border text-center font-bold ${
                        instMonths === m ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {m} Months ({m / 12} Yrs)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[10px] uppercase text-[#666666] block">Required Down Payment ({instDownPaymentPct}%)</span>
                <span className="text-xl font-black text-[#000000] block mt-1">
                  {formatPKRPrice(instDownPaymentAmt)}
                </span>
              </div>

              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[10px] uppercase text-[#666666] block">Monthly Installment Amount</span>
                <span className="text-xl font-black text-[#000000] block mt-1">
                  {formatPKRPrice(instMonthlyAmt)} / month
                </span>
              </div>

              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5]">
                <span className="text-[10px] uppercase text-[#666666] block">Quarterly Installment Alternative</span>
                <span className="text-xl font-black text-[#000000] block mt-1">
                  {formatPKRPrice(instQuarterlyAmt)} / quarter
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLOT SIZE CONVERTER */}
      {activeTab === 5 && (
        <div className="border border-[#000000] p-8 bg-[#FEFEFE]">
          <h2 className="text-xl font-bold uppercase text-[#000000] font-mono mb-6 pb-2 border-b border-[#E5E5E5]">
            5. Pakistan Plot Size Unit Converter
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-1">Input Plot Quantity</label>
                <input
                  type="number"
                  value={converterValue}
                  onChange={(e) => setConverterValue(Number(e.target.value))}
                  className="w-full border border-[#000000] p-3 text-sm text-[#000000] font-bold rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-1">Select Input Unit</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MARLA', 'SQFT', 'SQYD', 'KANAL'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setConverterUnit(unit)}
                      className={`py-2 px-3 border text-center font-bold ${
                        converterUnit === unit ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span className="text-[#666666]">Marla:</span>
                <span className="text-lg font-bold text-[#000000]">{sizeMarla.toFixed(2)} Marla</span>
              </div>
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span className="text-[#666666]">Square Feet (SqFt):</span>
                <span className="text-lg font-bold text-[#000000]">{sizeSqFt.toLocaleString()} SqFt</span>
              </div>
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span className="text-[#666666]">Square Yards (SqYd):</span>
                <span className="text-lg font-bold text-[#000000]">{sizeSqYd.toFixed(2)} SqYd</span>
              </div>
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span className="text-[#666666]">Kanal:</span>
                <span className="text-lg font-bold text-[#000000]">{sizeKanal.toFixed(3)} Kanal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PROPERTY TRANSFER COST & PK TAX ESTIMATOR */}
      {(activeTab === 8 || activeTab === 3 || activeTab === 4 || activeTab === 6 || activeTab === 7) && (
        <div className="border border-[#000000] p-8 bg-[#FEFEFE] my-6">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[#E5E5E5]">
            <FileCheck className="w-6 h-6 text-[#000000]" />
            <div>
              <h2 className="text-xl font-bold uppercase text-[#000000] font-mono">
                Property Transfer Cost & Pakistan Government Tax Estimator
              </h2>
              <span className="text-[10px] font-mono uppercase text-[#666666]">
                Configurable FBR Tax, Stamp Duty, TMA Fee & CVT Breakdown
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between text-[10px] text-[#666666] uppercase mb-1">
                  <span>Declared Property Valuation / Registry Price</span>
                  <span className="font-bold text-[#000000]">{formatPKRPrice(transferPrice)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={50000000}
                  step={500000}
                  value={transferPrice}
                  onChange={(e) => setTransferPrice(Number(e.target.value))}
                  className="w-full accent-[#000000]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#666666] uppercase mb-2">FBR Active Tax Filer Status</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsFiler(true)}
                    className={`py-3 px-4 border text-center font-bold ${
                      isFiler ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                    }`}
                  >
                    Active Filer (3% FBR Tax)
                  </button>
                  <button
                    onClick={() => setIsFiler(false)}
                    className={`py-3 px-4 border text-center font-bold ${
                      !isFiler ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]' : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5]'
                    }`}
                  >
                    Non-Filer (6% FBR Tax)
                  </button>
                </div>
              </div>

              {/* Explicit Regulatory Disclaimer */}
              <div className="p-4 bg-[#F4F4F4] border border-[#E5E5E5] flex items-start gap-2.5 text-xs text-[#666666] font-sans">
                <AlertCircle className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
                <p>
                  <strong>Configurable Tax Disclaimer:</strong> Government tax rates (FBR Section 236C/236K, Stamp Duty, TMA Fee, CVT) are configurable estimates based on current Punjab Finance Act policies. Actual transfer duty may vary depending on Cantt Board vs District Registrar valuation tables.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span>FBR Advance Tax ({fbrTaxPct}%):</span>
                <span className="font-bold text-[#000000]">{formatPKRPrice(fbrTaxAmt)}</span>
              </div>

              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span>Punjab Stamp Duty ({stampDutyPct}%):</span>
                <span className="font-bold text-[#000000]">{formatPKRPrice(stampDutyAmt)}</span>
              </div>

              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span>TMA / Cantt Board Transfer Fee ({tmaFeePct}%):</span>
                <span className="font-bold text-[#000000]">{formatPKRPrice(tmaFeeAmt)}</span>
              </div>

              <div className="p-3 bg-[#F4F4F4] border border-[#E5E5E5] flex justify-between items-center">
                <span>Capital Value Tax (CVT) ({cvtPct}%):</span>
                <span className="font-bold text-[#000000]">{formatPKRPrice(cvtAmt)}</span>
              </div>

              <div className="p-6 bg-[#000000] text-[#FEFEFE] mt-4">
                <span className="text-[10px] uppercase tracking-widest text-[#BDBDBD] block mb-1">
                  Estimated Total Government Transfer Fees & Taxes
                </span>
                <div className="text-2xl font-black">{formatPKRPrice(totalTransferTaxes)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
