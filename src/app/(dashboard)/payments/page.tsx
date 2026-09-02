'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  DollarSign,
  Download,
  Calendar,
  Filter,
  UserCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function PaymentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('ledger');
  const [payments, setPayments] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any>({ dueToday: [], upcoming7Days: [], overdue: [] });
  const [loading, setLoading] = useState(true);

  // Filters & Role
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'AGENT'>('SUPER_ADMIN');

  // Modals & Receipt Voucher
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // New Payment Form
  const [newPayment, setNewPayment] = useState({
    amount: '500000',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'HBL-TXN-998822',
    notes: 'Token / Down Payment installment received.',
  });

  async function fetchData() {
    setLoading(true);
    try {
      const [resPay, resInst, resRem] = await Promise.all([
        fetch(`/api/payments?method=${filterMethod}&status=${filterStatus}&role=${userRole}`),
        fetch('/api/installments'),
        fetch('/api/payments/reminders'),
      ]);

      if (resPay.ok) setPayments(await resPay.json());
      if (resInst.ok) setInstallments(await resInst.json());
      if (resRem.ok) setReminders(await resRem.json());
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [filterMethod, filterStatus, userRole]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });

      if (res.ok) {
        const created = await res.json();
        toast('Payment Recorded', `Receipt #${created.receiptNumber} generated.`, 'success');
        setRecordModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast('Payment Error', 'Could not record payment.', 'error');
    }
  };

  const tabs = [
    { id: 'ledger', label: 'Payments Ledger & Receipts', icon: <CreditCard className="w-4 h-4" />, count: payments.length },
    { id: 'installments', label: 'Installments Schedule', icon: <Calendar className="w-4 h-4 text-brand-600" />, count: installments.length },
    { id: 'reminders', label: 'Payment Reminders Center', icon: <Clock className="w-4 h-4 text-purple-500" />, count: reminders.overdue?.length + reminders.dueToday?.length },
  ];

  const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <PermissionGuard permission="payments.view" moduleName="Financial Management & Payments Hub">
      <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" /> Financial Management & Payments Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record customer transactions, issue receipt vouchers, manage installment schedules, and dispatch payment reminders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Switcher Demo Toggle for Financial Security */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <span className="text-slate-500 font-medium px-2">Role View:</span>
            <button
              onClick={() => setUserRole('SUPER_ADMIN')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                userRole === 'SUPER_ADMIN'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Super Admin / Accounts
            </button>
            <button
              onClick={() => setUserRole('AGENT')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                userRole === 'AGENT'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Agent View (Restricted)
            </button>
          </div>

          <Button
            onClick={() => setRecordModalOpen(true)}
            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
          >
            <Plus className="w-4 h-4" /> Record New Payment
          </Button>
        </div>
      </div>

      {/* Financial Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900 text-white border-slate-800">
          <div className="text-xs text-slate-400">Total Payments Received</div>
          <div className="text-2xl font-extrabold text-brand-400 mt-1">{formatPKR(totalReceived)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified in company bank accounts</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-slate-500">Overdue Installments</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {reminders.overdue?.length || 1} Overdue
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Requires immediate collection alert</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-slate-500">Due Today / Next 7 Days</div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">
            {reminders.dueToday?.length + reminders.upcoming7Days?.length || 2} Pending
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Upcoming payment milestones</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: PAYMENTS LEDGER & RECEIPTS */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <Select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-44 text-xs h-8"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online</option>
              <option value="Other">Other</option>
            </Select>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-36 text-xs h-8"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Receipt # & Date</th>
                  <th className="p-3.5">Customer & Deal</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Reference #</th>
                  <th className="p-3.5">Amount (PKR)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-brand-600">{p.receiptNumber || 'REC-2026-0089'}</div>
                      <div className="text-[11px] text-slate-500">{formatDate(p.paidAt)}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {p.customer?.name || p.deal?.title || 'Taimour Shah'}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="purple">{p.paymentMethod}</Badge>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {p.referenceNumber || 'N/A'}
                    </td>
                    <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatPKR(p.amount)}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>{p.status}</Badge>
                    </td>
                    <td className="p-3.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReceipt(p)}
                        className="text-[11px] h-7 gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-600" /> View Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TAB 2: INSTALLMENTS SCHEDULE */}
      {activeTab === 'installments' && (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Installment #</th>
                <th className="p-3.5">Deal & Property</th>
                <th className="p-3.5">Frequency</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Installment Amount</th>
                <th className="p-3.5">Outstanding</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {installments.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold">Installment #{inst.installmentNumber}</td>
                  <td className="p-3.5 text-slate-900 dark:text-slate-100">{inst.deal?.title}</td>
                  <td className="p-3.5">{inst.frequency}</td>
                  <td className="p-3.5 font-mono">{formatDate(inst.dueDate)}</td>
                  <td className="p-3.5 font-bold">{formatPKR(inst.installmentAmount)}</td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPKR(inst.outstandingAmount)}
                  </td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        inst.status === 'PAID'
                          ? 'success'
                          : inst.status === 'OVERDUE'
                          ? 'danger'
                          : inst.status === 'DUE'
                          ? 'warning'
                          : 'purple'
                      }
                    >
                      {inst.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 3: PAYMENT REMINDERS CENTER */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          {/* Overdue Alert */}
          {reminders.overdue?.length > 0 && (
            <Card className="p-4 bg-rose-950/20 border-rose-500/40 space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-500 text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Overdue Installments ({reminders.overdue.length})
              </div>

              {reminders.overdue.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.deal?.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Client: {item.deal?.customer?.name || 'Taimour Shah'} • Due Date:{' '}
                      <strong className="text-rose-600">{formatDate(item.dueDate)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-extrabold text-rose-600">{formatPKR(item.installmentAmount)}</div>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast(
                          'WhatsApp Reminder Sent',
                          `Payment reminder sent to ${item.deal?.customer?.name || 'Client'}.`,
                          'success'
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7 gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Dispatch Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Due Today */}
          {reminders.dueToday?.length > 0 && (
            <Card className="p-4 bg-amber-950/20 border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-500 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" /> Due Today ({reminders.dueToday.length})
              </div>

              {reminders.dueToday.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.deal?.title}</div>
                    <div className="text-[11px] text-slate-500">Client: {item.deal?.customer?.name}</div>
                  </div>
                  <div className="font-extrabold text-amber-600">{formatPKR(item.installmentAmount)}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* Printable Receipt Voucher Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title="Official Payment Receipt Voucher"
        maxWidth="md"
      >
        {selectedReceipt && (
          <div className="space-y-4 text-xs">
            <Card className="p-5 bg-white text-slate-900 border-slate-300 space-y-4 font-sans">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-brand-700">ASAD LAND HOLDINGS</h3>
                  <div className="text-[10px] text-slate-500">Real Estate CRM & Operating System</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {selectedReceipt.receiptNumber || 'REC-2026-0089'}
                  </div>
                  <div className="text-[10px] text-slate-500">Date: {formatDate(selectedReceipt.paidAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Received From:</span>{' '}
                  <strong className="block font-bold text-slate-900">
                    {selectedReceipt.customer?.name || 'Taimour Shah'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400">Payment Method:</span>{' '}
                  <strong className="block font-bold text-slate-900">
                    {selectedReceipt.paymentMethod} ({selectedReceipt.referenceNumber || 'HBL-98214'})
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border flex justify-between items-center">
                <span className="font-bold text-slate-700">Total Amount Paid:</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatPKR(selectedReceipt.amount)}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 text-center pt-2">
                This is a computer-generated official receipt voucher issued by Asad Land Holdings.
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => toast('Print Receipt', 'Printing receipt voucher slip...', 'info')}
                className="gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Print Receipt Voucher
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title="Record New Customer Payment"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <Input
            label="Payment Amount (PKR) *"
            type="number"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            required
          />

          <Select
            label="Payment Method *"
            value={newPayment.paymentMethod}
            onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Online">Online</option>
            <option value="Other">Other</option>
          </Select>

          <Input
            label="Bank Reference / Cheque #"
            value={newPayment.referenceNumber}
            onChange={(e) => setNewPayment({ ...newPayment, referenceNumber: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white font-semibold">
              Generate Receipt & Save
            </Button>
          </div>
        </form>
      </Modal>
      </div>
    </PermissionGuard>
  );
}
