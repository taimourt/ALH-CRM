'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  User,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  History,
  Plus,
  CheckCircle2,
  MessageSquare,
  Phone,
  Upload,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { SideDrawer } from '../ui/side-drawer';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs } from '../ui/tabs';
import { Input, Select } from '../ui/input';
import { Modal } from '../ui/modal';
import { useToast } from '../ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';

export interface DealDetailDrawerProps {
  dealId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function DealDetailDrawer({
  dealId,
  isOpen,
  onClose,
  onRefresh,
}: DealDetailDrawerProps) {
  const { toast } = useToast();
  const [deal, setDeal] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Quick Action Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('500000');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (HBL)');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (isOpen && dealId) {
      fetchDealDetails();
    }
  }, [isOpen, dealId]);

  const fetchDealDetails = async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}`);
      if (res.ok) setDeal(await res.json());
    } catch (err) {
      console.error('Fetch deal details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealId) return;
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAmount: (deal.tokenAmount || 0) + parseFloat(paymentAmount),
          stage: 'TOKEN',
        }),
      });

      if (res.ok) {
        toast('Payment Recorded', `Received PKR ${parseFloat(paymentAmount).toLocaleString()} payment.`, 'success');
        setPaymentModalOpen(false);
        fetchDealDetails();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      toast('Payment Error', 'Could not record payment.', 'error');
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview & Parties', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'timeline', label: 'Activity Timeline', icon: <History className="w-4 h-4 text-purple-500" />, count: deal?.activityLogs?.length || 0 },
    { id: 'payments', label: 'Payments & Token', icon: <CreditCard className="w-4 h-4 text-emerald-500" />, count: deal?.payments?.length || 0 },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4 text-blue-500" /> },
  ];

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={deal?.title || 'Deal Record'}
      description={`Deal ID: ${deal?.id?.substring(0, 8)} • Stage: ${deal?.stage}`}
      width="2xl"
    >
      {loading && (
        <div className="p-8 text-center text-xs text-slate-400">Loading deal record details...</div>
      )}

      {!loading && deal && (
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-4 bg-slate-900 text-white border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="text-xs">
                Stage: {deal.stage}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Closing: {formatDate(deal.expectedClosingDate || new Date())}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <div className="text-xs text-slate-400">Total Agreed Deal Value</div>
                <div className="text-2xl font-extrabold text-brand-400">
                  {formatPKR(deal.amount)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Token Amount Received</div>
                <div className="text-sm font-bold text-emerald-400">
                  {formatPKR(deal.tokenAmount)}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Action Buttons Bar */}
          <Card className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Deal Quick Actions:
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <Button
                size="sm"
                onClick={() => setPaymentModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" /> Record Payment
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toast('Task Created', 'Follow-up task added for deal.', 'success')}
                className="text-[11px] h-7 gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Task
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toast('Document Attached', 'Document uploaded to deal folder.', 'info')}
                className="text-[11px] h-7 gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Document
              </Button>
            </div>
          </Card>

          {/* Tab Navigation */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* TAB 1: OVERVIEW & PARTIES */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Buyer, Seller, Property Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <Card className="p-4 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-500" /> Buyer Information
                  </h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-400">Buyer Name:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">
                        {deal.customer?.name || deal.lead?.name || 'Hassan Raza'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span>{' '}
                      <strong className="font-mono">{deal.customer?.phone || deal.lead?.phone}</strong>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-500" /> Seller Information
                  </h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-400">Seller Name:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">
                        {deal.sellerName || deal.property?.ownerName || 'Kashif Raza'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span>{' '}
                      <strong className="font-mono">{deal.sellerPhone || '03335554411'}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Property Details */}
              <Card className="p-4 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-600" /> Target Property Specs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Property Title:</span>{' '}
                    <strong className="block text-slate-900 dark:text-slate-100">
                      {deal.property?.title}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Plot / Shop #:</span>{' '}
                    <strong className="block font-bold">
                      {deal.property?.plotNumber || 'G-12'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Society:</span>{' '}
                    <strong className="block">
                      {deal.property?.society?.name || deal.property?.city}
                    </strong>
                  </div>
                </div>
              </Card>

              {/* Agent & Manager */}
              <Card className="p-4 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Sales Team & Manager
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Assigned Agent:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100 block">
                      {deal.agent?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Supervising Manager:</span>{' '}
                    <strong className="text-slate-900 dark:text-slate-100 block">
                      {deal.manager?.name || 'Tariq Mahmood'}
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: CHRONOLOGICAL ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider">
                Deal Activity History Log
              </h4>

              <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-4">
                {deal.activityLogs?.map((log: any) => (
                  <div key={log.id} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-brand-500" />
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {log.action.replace('_', ' ')}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{log.description}</p>
                    <div className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS & TOKEN */}
          {activeTab === 'payments' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider">
                  Payment History & Token Money
                </h4>
                <Button size="sm" onClick={() => setPaymentModalOpen(true)} className="h-7 text-xs">
                  + Record Payment
                </Button>
              </div>

              {deal.payments?.map((p: any) => (
                <Card key={p.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-brand-600">{p.receiptNumber || 'REC-2026-0089'}</div>
                    <div className="text-[11px] text-slate-500">{p.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900 dark:text-slate-100">
                      {formatPKR(p.amount)}
                    </div>
                    <Badge variant="success">{p.status}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Payment / Token Money"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Input
            label="Payment Amount (PKR) *"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Bank Transfer (HBL)">Bank Transfer (HBL)</option>
            <option value="Cash Deposit">Cash Deposit</option>
            <option value="Pay Order / Cheque">Pay Order / Cheque</option>
          </Select>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white font-semibold">
              Save Payment Record
            </Button>
          </div>
        </form>
      </Modal>
    </SideDrawer>
  );
}
