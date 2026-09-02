'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Kanban,
  Table as TableIcon,
  Filter,
  UserCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { DealDetailDrawer } from '@/components/deals/deal-detail-drawer';
import { ConvertLeadModal } from '@/components/deals/convert-lead-modal';
import { formatPKR, formatDate } from '@/lib/utils';

// Exact 11 Deal Pipeline Stages requested by specification
const DEAL_STAGES = [
  { id: 'LEAD', label: '1. Lead', color: 'bg-blue-500' },
  { id: 'QUALIFIED', label: '2. Qualified', color: 'bg-indigo-500' },
  { id: 'SITE_VISIT', label: '3. Site Visit', color: 'bg-purple-500' },
  { id: 'NEGOTIATION', label: '4. Negotiation', color: 'bg-amber-500' },
  { id: 'TOKEN', label: '5. Token', color: 'bg-teal-500' },
  { id: 'BOOKING', label: '6. Booking', color: 'bg-emerald-500' },
  { id: 'DOCUMENTATION', label: '7. Documentation', color: 'bg-sky-500' },
  { id: 'PAYMENT', label: '8. Payment', color: 'bg-green-500' },
  { id: 'TRANSFER', label: '9. Transfer', color: 'bg-lime-500' },
  { id: 'CLOSED_WON', label: '10. Closed Won', color: 'bg-emerald-700' },
  { id: 'CLOSED_LOST', label: '11. Closed Lost', color: 'bg-rose-600' },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filters
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');

  // Modals & Drawers
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  async function fetchDeals() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStage !== 'ALL') params.append('stage', filterStage);
      if (search) params.append('q', search);

      const res = await fetch(`/api/deals?${params.toString()}`);
      if (res.ok) setDeals(await res.json());
    } catch (err) {
      console.error('Fetch deals error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeals();
  }, [filterStage, search]);

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) fetchDeals();
    } catch (err) {
      console.error('Stage change error:', err);
    }
  };

  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> 11-Stage Deal Pipeline & Sales Workflow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active deal records, token deposits, seller/buyer agreements, and closing transfer milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setConvertModalOpen(true)}
            className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold"
          >
            <Plus className="w-4 h-4" /> Convert Lead to Deal
          </Button>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <Input
          placeholder="Filter by deal title, buyer, or seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs text-xs"
        />

        <Select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="w-44 text-xs h-9"
        >
          <option value="ALL">All 11 Pipeline Stages</option>
          {DEAL_STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>

        <div className="ml-auto text-xs font-semibold text-slate-700 dark:text-slate-300">
          Total Pipeline Value: <strong className="text-brand-600">{formatPKR(totalPipelineValue)}</strong>
        </div>
      </div>

      {/* KANBAN BOARD VIEW (11 STAGES) */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-100/70 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 flex flex-col w-[260px] shrink-0"
              >
                {/* Stage Header */}
                <div className="pb-2 mb-3 border-b border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {stage.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Valuation: {formatPKR(stageValue)}
                  </div>
                </div>

                {/* Deal Cards in Stage */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh] pr-1">
                  {stageDeals.map((deal) => (
                    <Card
                      key={deal.id}
                      onClick={() => setSelectedDealId(deal.id)}
                      className="p-3 cursor-pointer hover:border-brand-500 hover:shadow-md transition-all space-y-2 bg-white dark:bg-slate-900"
                    >
                      <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                        {deal.title}
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div>
                          Buyer: <strong>{deal.customer?.name || deal.lead?.name || 'Hassan Raza'}</strong>
                        </div>
                        <div>
                          Seller: <strong>{deal.sellerName || deal.property?.ownerName || 'Kashif Raza'}</strong>
                        </div>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                          {formatPKR(deal.amount)}
                        </div>
                        {deal.tokenAmount > 0 && (
                          <div className="text-[10px] text-teal-600 font-semibold">
                            Token: {formatPKR(deal.tokenAmount)}
                          </div>
                        )}
                      </div>

                      {/* Quick stage selector */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 uppercase">
                          Agent: {deal.agent?.name?.split(' ')[0]}
                        </span>

                        <Select
                          value={deal.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(deal.id, e.target.value);
                          }}
                          className="text-[10px] py-0 h-6 w-24 bg-transparent border-none font-semibold text-brand-600"
                        >
                          {DEAL_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move: {s.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Deal Title</th>
                <th className="p-3.5">Buyer</th>
                <th className="p-3.5">Seller</th>
                <th className="p-3.5">Deal Value</th>
                <th className="p-3.5">Token Money</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Agent & Manager</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDealId(deal.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {deal.title}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">
                    {deal.customer?.name || deal.lead?.name || 'Hassan Raza'}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {deal.sellerName || 'Kashif Raza'}
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPKR(deal.amount)}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600">
                    {formatPKR(deal.tokenAmount)}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success">{deal.stage}</Badge>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {deal.agent?.name} ({deal.manager?.name || 'Tariq'})
                  </td>
                  <td className="p-3.5">
                    <Button size="sm" variant="outline" className="text-[11px] h-7">
                      Open Record
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Deal Detail Drawer */}
      <DealDetailDrawer
        dealId={selectedDealId}
        isOpen={!!selectedDealId}
        onClose={() => setSelectedDealId(null)}
        onRefresh={fetchDeals}
      />

      {/* Convert Lead to Deal Modal */}
      <ConvertLeadModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        lead={{ id: 'lead-1', name: 'Taimour Shah', phone: '03001234567' }}
        onSuccess={fetchDeals}
      />
    </div>
  );
}
