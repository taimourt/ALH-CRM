'use client';

import React, { useState, useEffect } from 'react';
import {
  Hammer,
  Building,
  Calculator,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Save,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { formatPKR } from '@/lib/utils';
import {
  ServiceCategory,
  ConstructionQuality,
  PLOT_SIZE_PRESETS,
  SERVICE_CATEGORY_LABELS,
  CONSTRUCTION_RATES,
  calculateConstructionEstimate,
  generateConstructionWhatsAppQuote,
} from '@/lib/construction-calculator';

interface ConstructionEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
  onSaved?: (updatedLead: any) => void;
}

export function ConstructionEstimatorModal({
  isOpen,
  onClose,
  lead,
  onSaved,
}: ConstructionEstimatorModalProps) {
  const { toast } = useToast();

  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('CONSTRUCTION_TURNKEY');
  const [qualityTier, setQualityTier] = useState<ConstructionQuality>('PREMIUM_A');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState('2200');
  const [selectedPlotPreset, setSelectedPlotPreset] = useState('5 Marla (Double Story)');
  const [society, setSociety] = useState('Kohistan Enclave');
  const [saving, setSaving] = useState(false);

  // Initialize from lead when opened
  useEffect(() => {
    if (lead) {
      if (lead.serviceCategory && lead.serviceCategory in SERVICE_CATEGORY_LABELS) {
        setServiceCategory(lead.serviceCategory as ServiceCategory);
      }
      if (lead.constructionQuality) {
        setQualityTier(lead.constructionQuality as ConstructionQuality);
      }
      if (lead.coveredAreaSqFt) {
        setCoveredAreaSqFt(String(lead.coveredAreaSqFt));
      } else if (lead.preferredSize) {
        const sizeStr = lead.preferredSize.toLowerCase();
        if (sizeStr.includes('5')) setCoveredAreaSqFt('2200');
        else if (sizeStr.includes('7')) setCoveredAreaSqFt('2800');
        else if (sizeStr.includes('10')) setCoveredAreaSqFt('3300');
        else if (sizeStr.includes('kanal') || sizeStr.includes('1 kanal')) setCoveredAreaSqFt('5500');
      }
      if (lead.preferredSociety) {
        setSociety(lead.preferredSociety);
      }
    }
  }, [lead, isOpen]);

  const estimate = calculateConstructionEstimate(
    serviceCategory,
    parseFloat(coveredAreaSqFt) || 2200,
    qualityTier
  );

  const handlePresetSelect = (preset: typeof PLOT_SIZE_PRESETS[0]) => {
    setSelectedPlotPreset(preset.label);
    setCoveredAreaSqFt(String(preset.typicalCoveredAreaSqFt));
  };

  const handleWhatsAppQuote = () => {
    if (!lead?.phone) {
      toast('No Phone Number', 'This lead does not have a contact number for WhatsApp.', 'error');
      return;
    }

    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('92') ? cleanPhone : cleanPhone.replace(/^0/, '92');

    const quoteText = generateConstructionWhatsAppQuote({
      clientName: lead.name || 'Valued Client',
      serviceCategory,
      society: society || lead.preferredSociety || 'Islamabad',
      plotSize: selectedPlotPreset,
      coveredAreaSqFt: parseFloat(coveredAreaSqFt) || 2200,
      qualityTier,
      advisorName: lead.assignedAgent?.name || 'Asad Land Holdings Project Advisor',
      advisorPhone: lead.assignedAgent?.phone || '0300-1234567',
    });

    const encoded = encodeURIComponent(quoteText);
    window.open(`https://wa.me/${intlPhone}?text=${encoded}`, '_blank');
    toast('WhatsApp Quote Formatted', 'Opened WhatsApp Web with the comprehensive construction quote.', 'success');
  };

  const handleSaveToLead = async () => {
    if (!lead?.id) return;
    setSaving(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lead.id,
          serviceCategory,
          coveredAreaSqFt: parseFloat(coveredAreaSqFt) || 2200,
          constructionQuality: qualityTier,
          estimatedConstructionCost: estimate.totalEstimatedCost,
          budgetMax: estimate.totalEstimatedCost,
          preferredSociety: society,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update lead');
      }

      const updated = await res.json();
      toast(
        'Construction Estimate Saved',
        `Linked ${formatPKR(estimate.totalEstimatedCost)} estimate to lead "${lead.name}".`,
        'success'
      );
      if (onSaved) onSaved(updated);
      onClose();
    } catch (err: any) {
      toast('Save Error', err.message || 'Failed to save estimate to lead', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? `🏗️ Construction Cost Estimator — ${lead.name}` : '🏗️ Construction Cost Estimator'}
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Service Category Selector */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-900 dark:text-slate-100">
            Select Construction Service Required *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(SERVICE_CATEGORY_LABELS) as ServiceCategory[]).map((cat) => {
              if (cat === 'PROPERTY_PURCHASE') return null;
              const info = SERVICE_CATEGORY_LABELS[cat];
              const isSelected = serviceCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setServiceCategory(cat)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 ring-1 ring-brand-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{info.icon}</span>
                  <div>
                    <strong className={`block text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {info.label}
                    </strong>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      {info.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Row: Plot Presets, Area & Quality */}
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-brand-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Covered Area & Quality Tier Configurator
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Benchmark: <strong>PKR {estimate.ratePerSqFt.toLocaleString()}</strong> / sq.ft
            </span>
          </div>

          {/* Quick Plot Presets */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
              Standard Plot Preset Sizes (Islamabad / Rawalpindi Bye-Laws):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PLOT_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                    coveredAreaSqFt === String(preset.typicalCoveredAreaSqFt)
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset.label} ({preset.typicalCoveredAreaSqFt.toLocaleString()} sqft)
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
                Covered Area (Sq. Ft.) *
              </label>
              <Input
                type="number"
                step="50"
                value={coveredAreaSqFt}
                onChange={(e) => setCoveredAreaSqFt(e.target.value)}
                className="bg-slate-950 text-white border-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
                Finishing Quality Level *
              </label>
              <Select
                value={qualityTier}
                onChange={(e) => setQualityTier(e.target.value as ConstructionQuality)}
                className="bg-slate-950 text-white border-slate-700 text-xs"
              >
                <option value="STANDARD">Standard Grade-A Execution</option>
                <option value="PREMIUM_A">Executive A-Quality (Imported Fixtures)</option>
                <option value="LUXURY_A_PLUS">Ultra-Luxury A+ Signature Finish</option>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
                Project Society / Location
              </label>
              <Input
                value={society}
                onChange={(e) => setSociety(e.target.value)}
                placeholder="e.g. Kohistan Enclave"
                className="bg-slate-950 text-white border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Live Estimation Output Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-900/50">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Estimated Budget</span>
            <div className="text-lg font-black text-brand-600 dark:text-brand-400 mt-0.5">
              {formatPKR(estimate.totalEstimatedCost)}
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              @ {formatPKR(estimate.ratePerSqFt)}/sqft
            </span>
          </Card>

          <Card className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Grey Structure Cost</span>
            <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatPKR(estimate.greyStructureShare)}
            </div>
            <span className="text-[10px] text-slate-400 block">Foundation, RCC & Masonry</span>
          </Card>

          <Card className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Finishing & Millwork</span>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatPKR(estimate.finishingShare)}
            </div>
            <span className="text-[10px] text-slate-400 block">Tiles, Doors, Bathrooms</span>
          </Card>

          <Card className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Timeline</span>
            <div className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-4 h-4" /> ~{estimate.estimatedTimelineMonths} Months
            </div>
            <span className="text-[10px] text-slate-400 block">Ground to Key Handover</span>
          </Card>
        </div>

        {/* Milestone Payment Plan Preview */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Standard Construction Milestone Schedule
            </span>
            <Badge variant="success" className="text-[10px]">
              Stage-Linked Disbursements
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {estimate.paymentMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">{m.milestone}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0 ml-2">
                  {m.percentage}% ({formatPKR(m.amount)})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-500">
            {lead ? `Ready to send quotation to ${lead.name} (${lead.phone || 'No phone'}).` : 'Custom estimate ready.'}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>

            {lead?.phone && (
              <Button
                type="button"
                onClick={handleWhatsAppQuote}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Send WhatsApp Quote
              </Button>
            )}

            {lead && (
              <Button
                type="button"
                onClick={handleSaveToLead}
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Estimate to Lead'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
