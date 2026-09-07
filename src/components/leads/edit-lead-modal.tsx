'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Layers,
  Sparkles,
  Hammer,
  FileText,
  UserCheck,
  Save,
  CheckCircle2,
  X,
  TrendingUp,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatPKR } from '@/lib/utils';
import {
  ServiceCategory,
  ConstructionQuality,
  PLOT_SIZE_PRESETS,
  calculateConstructionEstimate,
} from '@/lib/construction-calculator';

export interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  agents?: any[];
  canAssignLeads?: boolean;
  onLeadUpdated: (updatedLead: any) => void;
}

const STAGES = [
  { id: 'NEW', label: 'New Inquiries' },
  { id: 'CONTACTED', label: 'Contacted' },
  { id: 'QUALIFIED', label: 'Qualified' },
  { id: 'SITE_VISIT', label: 'Site Visit' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'TOKEN', label: 'Token Money' },
  { id: 'CLOSED_WON', label: 'Closed Deal' },
];

const SOCIETIES = [
  'Kohistan Enclave',
  'New City Paradise',
  'DHA Phase 2',
  'Bahria Town Phase 8',
  'Faisal Hills',
  'Gulberg Greens',
  'Top City-1',
  'Eighteen Islamabad',
  'Park View City',
  'Other / Islamabad-Rawalpindi',
];

const PROPERTY_TYPES = [
  { id: 'RESIDENTIAL_PLOT', label: 'Residential Plot' },
  { id: 'COMMERCIAL_PLOT', label: 'Commercial Plot' },
  { id: 'HOUSE', label: 'Built House / Villa' },
  { id: 'APARTMENT', label: 'Apartment / Flat' },
  { id: 'COMMERCIAL_SHOP', label: 'Commercial Shop / Office' },
];

const SOURCES = [
  { id: 'WEBSITE', label: 'Website Inbound' },
  { id: 'WHATSAPP', label: 'WhatsApp Direct' },
  { id: 'FACEBOOK_ADS', label: 'Facebook / Meta Ads' },
  { id: 'GOOGLE_ADS', label: 'Google Ads' },
  { id: 'WALK_IN', label: 'Walk-In Office Visit' },
  { id: 'REFERRAL', label: 'Client Referral' },
  { id: 'DIRECT_INQUIRY', label: 'Direct Phone Call' },
];

export function EditLeadModal({
  isOpen,
  onClose,
  lead,
  agents = [],
  canAssignLeads = false,
  onLeadUpdated,
}: EditLeadModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'WEBSITE',
    stage: 'NEW',
    score: 50,
    serviceCategory: 'PROPERTY_PURCHASE' as ServiceCategory,
    preferredSociety: 'Kohistan Enclave',
    preferredType: 'RESIDENTIAL_PLOT',
    preferredSize: '10 MARLA',
    coveredAreaSqFt: '2200',
    constructionQuality: 'PREMIUM_A' as ConstructionQuality,
    budgetMin: '',
    budgetMax: '15000000',
    notes: '',
    assignedAgentId: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        source: lead.source || 'WEBSITE',
        stage: lead.stage || 'NEW',
        score: lead.score !== undefined ? lead.score : 50,
        serviceCategory: (lead.serviceCategory as ServiceCategory) || 'PROPERTY_PURCHASE',
        preferredSociety: lead.preferredSociety || 'Kohistan Enclave',
        preferredType: lead.preferredType || 'RESIDENTIAL_PLOT',
        preferredSize: lead.preferredSize || '10 MARLA',
        coveredAreaSqFt: lead.coveredAreaSqFt ? lead.coveredAreaSqFt.toString() : '2200',
        constructionQuality: (lead.constructionQuality as ConstructionQuality) || 'PREMIUM_A',
        budgetMin: lead.budgetMin ? lead.budgetMin.toString() : '',
        budgetMax: lead.budgetMax ? lead.budgetMax.toString() : '15000000',
        notes: lead.notes || '',
        assignedAgentId: lead.assignedAgentId || (lead.assignedAgent?.id || ''),
      });
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const isConstruction = formData.serviceCategory !== 'PROPERTY_PURCHASE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast('Required Fields Missing', 'Please provide client name and phone number.', 'error');
      return;
    }

    setLoading(true);
    try {
      const sqft = isConstruction ? parseFloat(formData.coveredAreaSqFt) || 2200 : null;
      let calculatedEst: number | null = null;

      if (isConstruction && sqft) {
        const est = calculateConstructionEstimate(formData.serviceCategory, sqft, formData.constructionQuality);
        calculatedEst = est.totalEstimatedCost;
      }

      const payload = {
        id: lead.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : null,
        source: formData.source,
        stage: formData.stage,
        score: parseInt(formData.score as any, 10) || 50,
        serviceCategory: formData.serviceCategory,
        preferredSociety: formData.preferredSociety,
        preferredType: formData.preferredType,
        preferredSize: formData.preferredSize,
        coveredAreaSqFt: sqft,
        constructionQuality: isConstruction ? formData.constructionQuality : null,
        estimatedConstructionCost: calculatedEst,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        notes: formData.notes ? formData.notes.trim() : null,
        ...(canAssignLeads ? { assignedAgentId: formData.assignedAgentId || 'UNASSIGNED' } : {}),
      };

      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Lead Updated Successfully', `Changes saved for ${formData.name}.`, 'success');
        onLeadUpdated(data);
        onClose();
      } else {
        toast('Update Failed', data.error || 'Could not update lead.', 'error');
      }
    } catch (err: any) {
      toast('Error', err.message || 'Network error updating lead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`✏️ Edit Lead Profile: ${lead.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Section 1: Client Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
            <User className="w-3.5 h-3.5 text-brand-600" />
            <span>1. Contact & Identity Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Client Full Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Farhan Zaidi"
            />
            <Input
              label="Phone Number (WhatsApp) *"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="03001234567"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@domain.com"
            />

            <Select
              label="Lead Inbound Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              {SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Select
              label="Pipeline Stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Section 2: Requirement & Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Project & Property Specifications</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Service Category *"
              value={formData.serviceCategory}
              onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value as ServiceCategory })}
            >
              <option value="PROPERTY_PURCHASE">🏡 Property Purchase &amp; Resale</option>
              <option value="CONSTRUCTION_TURNKEY">🏗️ Turnkey Construction (A/A+ Finish)</option>
              <option value="CONSTRUCTION_GREY_STRUCTURE">🧱 Grey Structure (Civil Structure Only)</option>
              <option value="RENOVATION_INTERIOR">🎨 Renovation &amp; Interior Remodeling</option>
              <option value="ARCHITECTURAL_DESIGN">📐 Architectural Design &amp; Map Approval</option>
            </Select>

            <Select
              label="Target Society / Location"
              value={formData.preferredSociety}
              onChange={(e) => setFormData({ ...formData, preferredSociety: e.target.value })}
            >
              {SOCIETIES.map((soc) => (
                <option key={soc} value={soc}>
                  {soc}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Property Type"
              value={formData.preferredType}
              onChange={(e) => setFormData({ ...formData, preferredType: e.target.value })}
            >
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.label}
                </option>
              ))}
            </Select>

            <Input
              label="Plot / Property Size"
              value={formData.preferredSize}
              onChange={(e) => setFormData({ ...formData, preferredSize: e.target.value })}
              placeholder="e.g. 5 Marla, 10 Marla, 1 Kanal"
            />
          </div>

          {/* Construction Specific Fields */}
          {isConstruction && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                <Hammer className="w-3.5 h-3.5 text-amber-500" /> Construction Area &amp; Quality
              </span>

              <div>
                <label className="text-slate-500 text-[10px] block mb-1">Standard Plot Presets:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PLOT_SIZE_PRESETS.slice(0, 4).map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          preferredSize: p.label.split(' ')[0] + ' ' + p.label.split(' ')[1],
                          coveredAreaSqFt: p.typicalCoveredAreaSqFt.toString(),
                        })
                      }
                      className={`p-1.5 rounded-lg text-center text-[10px] font-bold border transition-all ${
                        formData.coveredAreaSqFt === p.typicalCoveredAreaSqFt.toString()
                          ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                      }`}
                    >
                      <div>{p.label.split(' ')[0]} {p.label.split(' ')[1]}</div>
                      <div className="text-[9px] opacity-80">{p.typicalCoveredAreaSqFt.toLocaleString()} sqft</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Covered Area (Sq. Ft.) *"
                  type="number"
                  value={formData.coveredAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, coveredAreaSqFt: e.target.value })}
                  placeholder="2200"
                />

                <Select
                  label="Quality Specification Tier"
                  value={formData.constructionQuality}
                  onChange={(e) => setFormData({ ...formData, constructionQuality: e.target.value as ConstructionQuality })}
                >
                  <option value="STANDARD">Standard Finish (B+ Grade)</option>
                  <option value="PREMIUM_A">Premium Finish (A Grade - Recommended)</option>
                  <option value="LUXURY_A_PLUS">Luxury Executive (A+ Super Grade)</option>
                </Select>
              </div>

              {/* Live Cost Estimation Preview */}
              {(() => {
                const sqft = parseFloat(formData.coveredAreaSqFt) || 2200;
                const est = calculateConstructionEstimate(
                  formData.serviceCategory,
                  sqft,
                  formData.constructionQuality
                );
                return (
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Estimated Project Cost:</span>
                      <span className="text-xs font-black text-amber-700 dark:text-amber-300 font-mono">
                        {formatPKR(est.totalEstimatedCost)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      PKR {est.ratePerSqFt.toLocaleString()} / sqft ({est.estimatedTimelineMonths} Months)
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Section 3: Financials & Agent Assignment */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Budget &amp; Management Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Minimum Budget (PKR)"
              type="number"
              value={formData.budgetMin}
              onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
              placeholder="e.g. 10000000"
            />
            <Input
              label="Maximum Target Budget (PKR)"
              type="number"
              value={formData.budgetMax}
              onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
              placeholder="e.g. 15000000"
            />
          </div>

          {canAssignLeads && (
            <Select
              label="Assigned Sales Agent"
              value={formData.assignedAgentId}
              onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
            >
              <option value="UNASSIGNED">📥 Unassigned Pool</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  👤 {a.name} ({a.role || 'Sales Agent'})
                </option>
              ))}
            </Select>
          )}

          <div>
            <label className="text-slate-500 text-[11px] block mb-1 font-semibold">
              Client Requirements &amp; Follow-up Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add specific requirements, plot preferences, payment terms, or client meeting notes..."
              className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {loading ? 'Saving Changes...' : 'Save & Update Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
