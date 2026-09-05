'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  Banknote,
  Clock,
  Home,
  PhoneOff,
  Users,
  FileQuestion,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export interface DisqualificationOption {
  id: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  nurtureBucket: string;
  nurtureLabel: string;
  nurtureStrategy: string;
}

export const DISQUALIFY_REASONS: DisqualificationOption[] = [
  {
    id: 'BUDGET_MISMATCH',
    label: 'Budget Mismatch (< PKR 50 Lakh)',
    description: 'Looking for budget installment files or plots below our minimum ticket size.',
    icon: Banknote,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    nurtureBucket: 'AFFORDABLE_PROJECTS',
    nurtureLabel: 'Affordable Housing & Installment Broadcasts',
    nurtureStrategy: 'Auto-included in New Metro City, Faisal Town & low-ticket launch alerts.',
  },
  {
    id: 'NOT_INTERESTED_COLD',
    label: 'Cold / Just Browsing / Long-term',
    description: 'Not looking to buy within 6-12 months, ghosting, or passive inquiries.',
    icon: Clock,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    nurtureBucket: 'LONG_TERM_90D',
    nurtureLabel: '90-Day Market Pulse & Long-Term Drip',
    nurtureStrategy: 'Monthly 1-page market trend update via WhatsApp; re-engagement ping at 60 days.',
  },
  {
    id: 'LOOKING_FOR_RENT',
    label: 'Looking for Rental / Lease',
    description: 'Inquired for house/apartment rentals or out-of-scope commercial leases.',
    icon: Home,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    nurtureBucket: 'RENTAL_PARTNER',
    nurtureLabel: 'Rental Referral & Partner Desk',
    nurtureStrategy: 'Can be monetized via commission split with affiliate rental agencies.',
  },
  {
    id: 'WRONG_NUMBER_SPAM',
    label: 'Wrong Number / Fake Contact / Spam',
    description: 'Invalid phone number, disconnected, or spam bot.',
    icon: PhoneOff,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
    nurtureBucket: 'JUNK_EXCLUSION',
    nurtureLabel: 'Meta & Google Ads Negative Exclusion List',
    nurtureStrategy: 'Excluded from Meta Ad Custom Audiences to prevent wasting marketing budget.',
  },
  {
    id: 'COMPETITOR_AGENT',
    label: 'External Broker / Agent Inquiry',
    description: 'Third-party property agent or dealer checking inventory/prices.',
    icon: Users,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    nurtureBucket: 'BROKER_NETWORK',
    nurtureLabel: 'B2B Real Estate Broker Network',
    nurtureStrategy: 'Tagged as B2B peer for inventory co-broking and direct deal sharing.',
  },
  {
    id: 'OTHER',
    label: 'Other Reason / Inactive',
    description: 'Personal circumstances, duplicate lead, or client requested no contact.',
    icon: FileQuestion,
    color: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    nurtureBucket: 'GENERAL_ARCHIVE',
    nurtureLabel: 'General Inactive Archive',
    nurtureStrategy: 'Stored safely in historical archive; unassigned from active agent workload.',
  },
];

interface DisqualifyLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  onDisqualified: (leadId: string, updatedLead: any) => void;
}

export function DisqualifyLeadModal({
  isOpen,
  onClose,
  lead,
  onDisqualified,
}: DisqualifyLeadModalProps) {
  const { toast } = useToast();
  const [selectedReasonId, setSelectedReasonId] = useState<string>('BUDGET_MISMATCH');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!lead) return null;

  const activeReason = DISQUALIFY_REASONS.find((r) => r.id === selectedReasonId) || DISQUALIFY_REASONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads/disqualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          reason: activeReason.id,
          notes,
          nurtureBucket: activeReason.nurtureBucket,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast('Disqualification Failed', data.error || 'Failed to archive lead.', 'error');
        setLoading(false);
        return;
      }

      toast(
        'Lead Disqualified & Archived',
        `"${lead.name}" moved to ${activeReason.nurtureLabel}. Unassigned from active pipeline.`,
        'success'
      );

      onDisqualified(lead.id, data.lead);
      onClose();
    } catch (err: any) {
      toast('Error', 'An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Disqualify & Archive Lead"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Lead Context Header */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Archiving Client Inquiry</div>
            <h3 className="text-sm font-bold text-slate-100">{lead.name}</h3>
            <div className="text-emerald-400 font-mono text-[11px]">{lead.phone}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">Current Agent</span>
            <div className="font-semibold text-slate-200">
              {lead.assignedAgent?.name || 'Unassigned'}
            </div>
          </div>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Select Primary Disqualification Reason *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DISQUALIFY_REASONS.map((reason) => {
              const Icon = reason.icon;
              const isSelected = selectedReasonId === reason.id;
              return (
                <button
                  type="button"
                  key={reason.id}
                  onClick={() => setSelectedReasonId(reason.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${reason.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 pr-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                        {reason.label}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600 absolute right-2.5 top-2.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Automated Nurture Bucket Insight */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automated Long-Term Nurture Bucket:</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs pl-5">
            📁 {activeReason.nurtureLabel}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {activeReason.nurtureStrategy}
          </p>
        </div>

        {/* Disqualification Notes */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Agent Disqualification Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Client stated they only have 25 Lakh cash and want installment plot in New Metro City or Taxila."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-1.5 shadow-md shadow-rose-950/20"
          >
            <Archive className="w-3.5 h-3.5" />
            Confirm &amp; Move to Archive
          </Button>
        </div>
      </form>
    </Modal>
  );
}
