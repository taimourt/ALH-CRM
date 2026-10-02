'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  Hammer,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Calculator,
  ShieldCheck,
} from 'lucide-react';

export default function WPAdminRatesPage() {
  const { materialRates, updateMaterialRates } = useCMS();

  const [greyRate, setGreyRate] = useState(materialRates.greyStructureRatePerSqFtPKR);
  const [premiumFinishRate, setPremiumFinishRate] = useState(materialRates.premiumFinishRatePerSqFtPKR);
  const [execFinishRate, setExecFinishRate] = useState(materialRates.executiveFinishRatePerSqFtPKR);

  const [cement, setCement] = useState(materialRates.cementBagPKR);
  const [steel, setSteel] = useState(materialRates.steelTonPKR);
  const [bricks, setBricks] = useState(materialRates.bricks1000PKR);
  const [sand, setSand] = useState(materialRates.sandTruckPKR);
  const [crush, setCrush] = useState(materialRates.crushTruckPKR);
  const [cables, setCables] = useState(materialRates.electricCablesBundlePKR);
  const [pipes, setPipes] = useState(materialRates.plumbingPipesPerFtPKR);
  const [paint, setPaint] = useState(materialRates.paintDrumPKR);

  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMaterialRates({
        greyStructureRatePerSqFtPKR: Number(greyRate),
        premiumFinishRatePerSqFtPKR: Number(premiumFinishRate),
        executiveFinishRatePerSqFtPKR: Number(execFinishRate),
        cementBagPKR: Number(cement),
        steelTonPKR: Number(steel),
        bricks1000PKR: Number(bricks),
        sandTruckPKR: Number(sand),
        crushTruckPKR: Number(crush),
        electricCablesBundlePKR: Number(cables),
        plumbingPipesPerFtPKR: Number(pipes),
        paintDrumPKR: Number(paint),
      });

      setNotice('Construction & Material rates successfully updated across the website!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to save rates.');
    } finally {
      setIsSaving(false);
    }
  };

  // Preview Calculations
  const sample5MarlaArea = 2200;
  const sample5MarlaGreyCost = sample5MarlaArea * greyRate;
  const sample5MarlaTurnkeyCost = sample5MarlaArea * (greyRate + premiumFinishRate);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">Construction & Material Rates Benchmark</h1>
          <p className="text-xs text-[#646970]">
            Update verified daily wholesale material benchmarks and per-square-foot turnkey pricing.
          </p>
        </div>

        <Link
          href="/calculators"
          target="_blank"
          className="text-xs text-[#2271b1] hover:underline flex items-center gap-1"
        >
          View Public Construction Calculator <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Per Sq Ft Construction Rates */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2 flex items-center gap-2">
            <Hammer className="w-4 h-4 text-[#2271b1]" />
            Turnkey Construction Packages (Per Sq. Ft Rate in PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#f6f7f7] p-3 rounded border border-[#dcdcde]">
              <label className="block font-bold text-[#1d2327] mb-1">
                Grey Structure Rate / Sq. Ft
              </label>
              <p className="text-[11px] text-[#646970] mb-2">
                Foundation, brick masonry, RCC slabs, underground plumbing & conduits.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={greyRate}
                  onChange={(e) => setGreyRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-sm font-bold text-[#1d2327] outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-[#f6f7f7] p-3 rounded border border-[#dcdcde]">
              <label className="block font-bold text-[#1d2327] mb-1">
                A+ Premium Finishing / Sq. Ft
              </label>
              <p className="text-[11px] text-[#646970] mb-2">
                Spanish/Porcelain tiles, Ashwood woodwork, Grohe fixtures, pure copper wire.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={premiumFinishRate}
                  onChange={(e) => setPremiumFinishRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-sm font-bold text-[#1d2327] outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-[#f6f7f7] p-3 rounded border border-[#dcdcde]">
              <label className="block font-bold text-[#1d2327] mb-1">
                Ultra Luxury Executive Finishing / Sq. Ft
              </label>
              <p className="text-[11px] text-[#646970] mb-2">
                Italian imported marble, Smart automation, bespoke walnut joinery, solar ready.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={execFinishRate}
                  onChange={(e) => setExecFinishRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-sm font-bold text-[#1d2327] outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Itemized Wholesale Raw Materials */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2271b1]" />
            Itemized Wholesale Building Material Prices
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Cement (Fauji / Bestway 50kg Bag)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={cement}
                  onChange={(e) => setCement(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Deformed Steel 60 Grade (Per Ton)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={steel}
                  onChange={(e) => setSteel(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Red Bricks Awwal (Per 1,000 Bricks)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={bricks}
                  onChange={(e) => setBricks(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Ravi / Chenab Sand (Per Dumper)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={sand}
                  onChange={(e) => setSand(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Margalla Crush (Per Dumper)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={crush}
                  onChange={(e) => setCrush(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Electric Cables Pure Copper (Bundle)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={cables}
                  onChange={(e) => setCables(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Plumbing PVC Pipes (Per Foot)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={pipes}
                  onChange={(e) => setPipes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Exterior WeatherShield Paint (Drum)</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[#646970]">PKR</span>
                <input
                  type="number"
                  value={paint}
                  onChange={(e) => setPaint(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Live Cost Calculation Preview */}
        <div className="bg-[#f0f6fc] border border-[#72aee6] rounded p-4 text-xs space-y-2">
          <h3 className="font-bold text-[#1d2327] flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#2271b1]" />
            Live Client Estimate Calculation Preview
          </h3>
          <p className="text-[#646970]">
            Based on these updated values, a standard <strong>5 Marla house (2,200 sq. ft covered area)</strong> will compute as:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded border border-[#c3c4c7]">
              <span className="text-[#646970] block">Estimated Grey Structure Cost:</span>
              <strong className="text-sm text-[#1d2327]">
                PKR {sample5MarlaGreyCost.toLocaleString()} ({(sample5MarlaGreyCost / 100000).toFixed(1)} Lac)
              </strong>
            </div>
            <div className="bg-white p-3 rounded border border-[#c3c4c7]">
              <span className="text-[#646970] block">Estimated Turnkey A+ Executive Cost:</span>
              <strong className="text-sm text-[#00a32a]">
                PKR {sample5MarlaTurnkeyCost.toLocaleString()} ({(sample5MarlaTurnkeyCost / 10000000).toFixed(2)} Crore)
              </strong>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#2271b1] text-white font-semibold text-xs rounded hover:bg-[#135e96] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              'Save & Update Live Website Rates'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
