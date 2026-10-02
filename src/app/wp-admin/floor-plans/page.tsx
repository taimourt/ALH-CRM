'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import { CMSFloorPlan } from '@/lib/cms-types';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Compass,
  BedDouble,
  Building2,
  DollarSign,
  ExternalLink,
  X,
} from 'lucide-react';

export default function WPAdminFloorPlansPage() {
  const { floorPlans, addFloorPlan, updateFloorPlan, deleteFloorPlan } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CMSFloorPlan | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [plotDimensions, setPlotDimensions] = useState("25' × 45'");
  const [plotSizeCategory, setPlotSizeCategory] = useState<CMSFloorPlan['plotSizeCategory']>('5_MARLA');
  const [architecturalStyle, setArchitecturalStyle] = useState<CMSFloorPlan['architecturalStyle']>('MINIMALIST_CUBIC');
  const [totalCoveredAreaSqFt, setTotalCoveredAreaSqFt] = useState(2200);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(4);
  const [estimatedCostPKR, setEstimatedCostPKR] = useState(11800000);
  const [elevation3dRender, setElevation3dRender] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'
  );
  const [description, setDescription] = useState('Optimized residential blueprint with turnkey BOQ.');
  const [highlightsInput, setHighlightsInput] = useState('Open Concept Lounge, Rooftop Pergola, Concealed Ducting');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [notice, setNotice] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingPlan(null);
    setTitle('');
    setPlotDimensions("25' × 45'");
    setPlotSizeCategory('5_MARLA');
    setArchitecturalStyle('MINIMALIST_CUBIC');
    setTotalCoveredAreaSqFt(2200);
    setBedrooms(3);
    setBathrooms(4);
    setEstimatedCostPKR(11800000);
    setElevation3dRender('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop');
    setDescription('Optimized architectural floor plan layout.');
    setHighlightsInput('Open Concept Lounge, Rooftop Pergola, Concealed Ducting');
    setStatus('published');
    setModalOpen(true);
  };

  const openEditModal = (plan: CMSFloorPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setPlotDimensions(plan.plotDimensions);
    setPlotSizeCategory(plan.plotSizeCategory);
    setArchitecturalStyle(plan.architecturalStyle);
    setTotalCoveredAreaSqFt(plan.totalCoveredAreaSqFt);
    setBedrooms(plan.bedrooms);
    setBathrooms(plan.bathrooms);
    setEstimatedCostPKR(plan.boqCostEstimates?.premiumFinishingTotalPKR || 11800000);
    setElevation3dRender(plan.elevation3dRender);
    setDescription(plan.description);
    setHighlightsInput((plan.keyHighlights || []).join(', '));
    setStatus(plan.status || 'published');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const keyHighlights = highlightsInput.split(',').map((f) => f.trim()).filter(Boolean);
    const area = Number(totalCoveredAreaSqFt);

    if (editingPlan) {
      await updateFloorPlan(editingPlan.id, {
        title,
        plotDimensions,
        plotSizeCategory,
        architecturalStyle,
        totalCoveredAreaSqFt: area,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        elevation3dRender,
        description,
        keyHighlights,
        status,
      });
      setNotice('Floor plan updated.');
    } else {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await addFloorPlan({
        title,
        slug,
        plotDimensions,
        plotSizeCategory,
        architecturalStyle,
        totalCoveredAreaSqFt: area,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        elevation3dRender,
        description,
        keyHighlights,
        status,
      });
      setNotice('New floor plan added.');
    }

    setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id: string, planTitle: string) => {
    if (confirm(`Delete floor plan "${planTitle}"?`)) {
      await deleteFloorPlan(id);
      setNotice(`Floor plan "${planTitle}" deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Architectural Floor Plans</h1>
          <button
            onClick={openAddModal}
            className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] bg-white rounded hover:bg-[#2271b1] hover:text-white transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Design
          </button>
        </div>

        <Link
          href="/floor-plans"
          target="_blank"
          className="text-xs text-[#2271b1] hover:underline flex items-center gap-1"
        >
          View Public Catalog <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Grid of Floor Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {floorPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* 3D Render Image */}
              <div className="aspect-video relative bg-slate-100 overflow-hidden border-b border-[#dcdcde]">
                <img
                  src={plan.elevation3dRender}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#1d2327]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {plan.plotDimensions}
                </span>
                <span className="absolute top-2 right-2 bg-[#00a32a] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {plan.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-[#1d2327]">{plan.title}</h3>
                <p className="text-xs text-[#646970] line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#f0f0f1] text-[11px] text-[#2c3338]">
                  <div>
                    <span className="text-[#646970] block">Area:</span>
                    <strong>{plan.totalCoveredAreaSqFt} sq ft</strong>
                  </div>
                  <div>
                    <span className="text-[#646970] block">Beds / Baths:</span>
                    <strong>{plan.bedrooms} Bed · {plan.bathrooms} Bath</strong>
                  </div>
                  <div>
                    <span className="text-[#646970] block">Turnkey Cost:</span>
                    <strong className="text-[#00a32a]">
                      {((plan.boqCostEstimates?.premiumFinishingTotalPKR || 11800000) / 100000).toFixed(1)} Lac
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-[#f6f7f7] border-t border-[#c3c4c7] flex items-center justify-between text-xs">
              <button
                onClick={() => openEditModal(plan)}
                className="text-[#2271b1] hover:underline font-semibold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Design
              </button>

              <button
                onClick={() => handleDelete(plan.id, plan.title)}
                className="text-[#d63638] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded border border-[#c3c4c7] shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
              <h2 className="text-lg font-normal text-[#1d2327]">
                {editingPlan ? 'Edit Floor Plan' : 'Add New Floor Plan Design'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#646970] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Design Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Marla Executive Double-Storey Modern"
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Plot Dimensions</label>
                  <input
                    type="text"
                    value={plotDimensions}
                    onChange={(e) => setPlotDimensions(e.target.value)}
                    placeholder="e.g. 25' × 45'"
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={plotSizeCategory}
                    onChange={(e) => setPlotSizeCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded bg-white text-xs"
                  >
                    <option value="5_MARLA">5 Marla (25×45)</option>
                    <option value="8_MARLA">8 Marla (30×60)</option>
                    <option value="10_MARLA">10 Marla (35×70)</option>
                    <option value="1_KANAL">1 Kanal (50×90)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Architectural Style</label>
                  <select
                    value={architecturalStyle}
                    onChange={(e) => setArchitecturalStyle(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded bg-white text-xs"
                  >
                    <option value="MINIMALIST_CUBIC">Minimalist Cubic Modern</option>
                    <option value="CONTEMPORARY_VILLA">Contemporary Villa</option>
                    <option value="SPANISH_MEDITERRANEAN">Spanish Mediterranean</option>
                    <option value="INDEPENDENT_DUPLEX">Independent Duplex</option>
                    <option value="ROYAL_PRESIDENTIAL">Royal Presidential</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Total Covered Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={totalCoveredAreaSqFt}
                    onChange={(e) => setTotalCoveredAreaSqFt(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">3D Elevation Render Image URL</label>
                <input
                  type="url"
                  value={elevation3dRender}
                  onChange={(e) => setElevation3dRender(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#c3c4c7]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#f6f7f7] border border-[#dcdcde] rounded text-[#2c3338]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] text-white font-semibold rounded hover:bg-[#135e96]"
                >
                  Save Floor Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
