'use client';

import React, { useState } from 'react';
import { Modal } from './ui/modal';
import { Input, Select } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/toast';
import { User, Calendar } from 'lucide-react';

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_SOCIETIES = [
  'Kohistan Enclave',
  'New City (Phase 2 & Paradise)',
  'DHA Islamabad-Rawalpindi',
  'Bahria Town Islamabad / Rawalpindi',
  'Gulberg Greens Islamabad',
  'Park View City',
  'Eighteen Islamabad',
  'Faisal Hills',
  'Faisal Town',
  'Top City-1',
];

export function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const { toast } = useToast();
  const [tab, setTab] = useState<'lead' | 'visit'>('lead');
  const [loading, setLoading] = useState(false);

  // Form states
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    source: 'WHATSAPP',
    preferredType: 'HOUSE',
    preferredSize: '10 MARLA',
    preferredSociety: 'Kohistan Enclave',
    budgetMax: '32000000',
  });

  const [visitData, setVisitData] = useState({
    clientName: '',
    clientPhone: '',
    societyName: 'Kohistan Enclave',
    blockSector: 'Executive Block',
    plotOrHouseNumber: '',
    visitDate: '',
    notes: '',
  });

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.phone) {
      toast('Required Fields Missing', 'Please enter client name and phone number.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          budgetMax: parseFloat(leadData.budgetMax) || null,
        }),
      });

      if (res.ok) {
        toast('Lead Created Successfully', `Added ${leadData.name} (${leadData.phone}) to pipeline.`, 'success');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast('Failed to create lead', 'An error occurred while saving.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not save lead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitData.clientName || !visitData.visitDate) {
      toast('Required Fields Missing', 'Please enter client name and visit date/time.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: visitData.clientName,
          clientPhone: visitData.clientPhone,
          society: visitData.societyName,
          propertyTitle: `${visitData.blockSector} ${visitData.plotOrHouseNumber}`.trim(),
          scheduledFor: new Date(visitData.visitDate).toISOString(),
          notes: visitData.notes,
        }),
      });

      if (res.ok) {
        toast('Site Visit Scheduled', `Visit scheduled for ${visitData.clientName}.`, 'success');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast('Error', 'Failed to schedule visit.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not schedule visit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Action Center" maxWidth="lg">
      {/* Type selector: Only 2 options (Quick Lead & Site Visit) */}
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setTab('lead')}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-md transition-all ${
            tab === 'lead'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs ring-1 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Quick Lead</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('visit')}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-md transition-all ${
            tab === 'visit'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs ring-1 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Site Visit</span>
        </button>
      </div>

      {/* Quick Lead Form */}
      {tab === 'lead' && (
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Client Name *"
              placeholder="e.g. Chaudhry Kamran"
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
              required
            />
            <Input
              label="Phone Number *"
              placeholder="03001234567"
              value={leadData.phone}
              onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Looking For"
              value={leadData.preferredType}
              onChange={(e) => setLeadData({ ...leadData, preferredType: e.target.value })}
            >
              <option value="HOUSE">House / Villa</option>
              <option value="RESIDENTIAL_PLOT">Residential Plot</option>
              <option value="COMMERCIAL">Commercial Shop/Plaza</option>
              <option value="FARMHOUSE">Farmhouse</option>
              <option value="APARTMENT">Apartment / Flat</option>
              <option value="FILE">Plot File</option>
            </Select>

            <Select
              label="Preferred Size"
              value={leadData.preferredSize}
              onChange={(e) => setLeadData({ ...leadData, preferredSize: e.target.value })}
            >
              <option value="5 MARLA">5 Marla</option>
              <option value="7 MARLA">7 Marla</option>
              <option value="8 MARLA">8 Marla</option>
              <option value="10 MARLA">10 Marla</option>
              <option value="1 KANAL">1 Kanal</option>
              <option value="2 KANAL">2 Kanal</option>
            </Select>

            <Select
              label="Preferred Society"
              value={leadData.preferredSociety}
              onChange={(e) => setLeadData({ ...leadData, preferredSociety: e.target.value })}
            >
              {DEFAULT_SOCIETIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Client Maximum Budget (PKR)"
              placeholder="e.g. 32000000"
              value={leadData.budgetMax}
              onChange={(e) => setLeadData({ ...leadData, budgetMax: e.target.value })}
            />
            <Select
              label="Lead Inflow Source"
              value={leadData.source}
              onChange={(e) => setLeadData({ ...leadData, source: e.target.value })}
            >
              <option value="WHATSAPP">WhatsApp Direct</option>
              <option value="PHONE_INQUIRY">Direct Phone Call</option>
              <option value="WALK_IN">Site / Office Walk-in</option>
              <option value="FACEBOOK_ADS">Facebook Ads</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="REFERRAL">Client Referral</option>
              <option value="ZAMEEN">Zameen.com</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              Save Lead to Pipeline
            </Button>
          </div>
        </form>
      )}

      {/* Site Visit Form */}
      {tab === 'visit' && (
        <form onSubmit={handleCreateVisit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Client Name *"
              placeholder="e.g. Dr. Salman Qureshi"
              value={visitData.clientName}
              onChange={(e) => setVisitData({ ...visitData, clientName: e.target.value })}
              required
            />
            <Input
              label="Client Phone"
              placeholder="03001234567"
              value={visitData.clientPhone}
              onChange={(e) => setVisitData({ ...visitData, clientPhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Housing Society"
              value={visitData.societyName}
              onChange={(e) => setVisitData({ ...visitData, societyName: e.target.value })}
            >
              {DEFAULT_SOCIETIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <Input
              label="Block / Sector"
              placeholder="e.g. Executive Block"
              value={visitData.blockSector}
              onChange={(e) => setVisitData({ ...visitData, blockSector: e.target.value })}
            />

            <Input
              label="Plot / House #"
              placeholder="e.g. House 14"
              value={visitData.plotOrHouseNumber}
              onChange={(e) => setVisitData({ ...visitData, plotOrHouseNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Visit Date & Time *"
              type="datetime-local"
              value={visitData.visitDate}
              onChange={(e) => setVisitData({ ...visitData, visitDate: e.target.value })}
              required
            />
            <Input
              label="Notes / Special Requirements"
              placeholder="Client interested in corner plot / 5 marla built house"
              value={visitData.notes}
              onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              Schedule Site Visit
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
