'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Calculator,
  UserCheck,
  Building2,
  ShieldAlert,
  CheckCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { calculateCommissionSplit } from '@/lib/financials';
import { formatPKR } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function CommissionsPage() {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Role Security Simulation
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'AGENT'>('SUPER_ADMIN');

  // Configurable Calculator Inputs
  const [calcDealAmount, setCalcDealAmount] = useState('10000000'); // PKR 10,000,000 specification test
  const [calcCommissionRate, setCalcCommissionRate] = useState('1.0'); // 1%
  const [calcAgentPct, setCalcAgentPct] = useState('60'); // 60%
  const [calcManagerPct, setCalcManagerPct] = useState('15'); // 15%

  async function fetchCommissions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/commissions?role=${userRole}`);
      if (res.ok) setCommissions(await res.json());
    } catch (err) {
      console.error('Fetch commissions error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCommissions();
  }, [userRole]);

  // Live Commission Math
  const breakdown = calculateCommissionSplit(
    parseFloat(calcDealAmount) || 0,
    parseFloat(calcCommissionRate) || 0,
    parseFloat(calcAgentPct) || 0,
    parseFloat(calcManagerPct) || 0
  );

  return (
    <PermissionGuard permission="commissions.view" moduleName="Commissions & Splits">
      <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-600" /> Commission Rules & Disbursement Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurable splits across Company, Agent shares, and Manager overwrites with strict RBAC security.
          </p>
        </div>

        {/* Role Security Simulator */}
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
            Agent View (Masked)
          </button>
        </div>
      </div>

      {/* Interactive Configurable Rule Calculator */}
      <Card className="p-5 bg-slate-900 text-white border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-brand-400">
            <Calculator className="w-4 h-4" /> Configurable Commission Rule Simulator
          </div>
          <Badge variant="purple" className="text-xs">
            1.0% Standard Policy
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Input
            label="Deal Amount (PKR) *"
            type="number"
            value={calcDealAmount}
            onChange={(e) => setCalcDealAmount(e.target.value)}
            className="bg-slate-950 text-white border-slate-800"
          />

          <Input
            label="Deal Commission %"
            type="number"
            value={calcCommissionRate}
            onChange={(e) => setCalcCommissionRate(e.target.value)}
            className="bg-slate-950 text-white border-slate-800"
          />

          <Input
            label="Agent Share %"
            type="number"
            value={calcAgentPct}
            onChange={(e) => setCalcAgentPct(e.target.value)}
            className="bg-slate-950 text-white border-slate-800"
          />

          <Input
            label="Manager Share %"
            type="number"
            value={calcManagerPct}
            onChange={(e) => setCalcManagerPct(e.target.value)}
            className="bg-slate-950 text-white border-slate-800"
          />
        </div>

        {/* Live Calculation Output */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400">Total Company Commission:</span>
            <div className="text-lg font-extrabold text-brand-400">
              {formatPKR(breakdown.totalCompanyCommission)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400">Agent Share ({breakdown.agentSplitPct}%):</span>
            <div className="text-lg font-extrabold text-emerald-400">
              {formatPKR(breakdown.agentShare)}
            </div>
          </div>

          {userRole === 'SUPER_ADMIN' ? (
            <>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Manager Share ({breakdown.managerSplitPct}%):</span>
                <div className="text-lg font-extrabold text-purple-400">
                  {formatPKR(breakdown.managerShare)}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Company Net Retained:</span>
                <div className="text-lg font-extrabold text-amber-400">
                  {formatPKR(breakdown.companyRetained)}
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 p-3 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-center text-slate-500 italic">
              <ShieldAlert className="w-4 h-4 mr-1 text-amber-500" /> Company net margins masked for agent role security.
            </div>
          )}
        </div>
      </Card>

      {/* Disbursement Ledger */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" /> Commission Disbursement Ledger
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5">Deal Title</th>
              <th className="p-3.5">Agent</th>
              <th className="p-3.5">Agent Share (PKR)</th>
              {userRole === 'SUPER_ADMIN' && (
                <>
                  <th className="p-3.5">Manager Share</th>
                  <th className="p-3.5">Company Retained</th>
                </>
              )}
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                  {c.dealTitle || c.deal?.title || '10 Marla Plot 142 DHA Phase 8'}
                </td>
                <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                  {c.agentName || c.agent?.name || 'Hamza Chaudhry'}
                </td>
                <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPKR(c.agentShare || 60000)}
                </td>
                {userRole === 'SUPER_ADMIN' && (
                  <>
                    <td className="p-3.5 font-bold text-purple-600">
                      {formatPKR(c.managerShare || 15000)}
                    </td>
                    <td className="p-3.5 font-bold text-amber-600">
                      {formatPKR(c.companyRetained || 25000)}
                    </td>
                  </>
                )}
                <td className="p-3.5">
                  <Badge variant="success">{c.status || 'APPROVED'}</Badge>
                </td>
                <td className="p-3.5">
                  <Button
                    size="sm"
                    onClick={() => toast('Disbursed', `Commission paid out to ${c.agentName || 'Agent'}.`, 'success')}
                    className="text-[11px] h-7 bg-emerald-600 text-white font-semibold"
                  >
                    Disburse
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      </div>
    </PermissionGuard>
  );
}
