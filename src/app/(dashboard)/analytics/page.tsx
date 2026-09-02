'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Building2,
  Sparkles,
  PieChart,
  Target,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { RevenueChart, LeadFunnelChart } from '@/components/ui/chart';
import { formatPKR } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function AnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('executive');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error('Fetch analytics error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const tabs = [
    { id: 'executive', label: 'Executive Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leads', label: 'Lead Analytics', icon: <Target className="w-4 h-4 text-purple-500" /> },
    { id: 'agents', label: 'Agent Performance', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { id: 'societies', label: 'Society Comparison', icon: <Building2 className="w-4 h-4 text-brand-600" /> },
    { id: 'financials', label: 'Financial Analytics', icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
  ];

  const exec = data?.executiveMetrics || {
    totalRevenue: 2000000,
    salesVolume: 31000000,
    totalDeals: 2,
    conversionRate: 28.4,
    leadGrowth: 18.5,
    pipelineValue: 31000000,
    avgDealValue: 15500000,
    commissionEarned: 245000,
    outstandingPayments: 1999999,
  };

  const insights = data?.insights || [];
  const leadData = data?.leadAnalytics || { sources: [], leadToVisitRate: 45, visitToDealRate: 60, lostReasons: [] };
  const agents = data?.agentPerformance || [];
  const societies = data?.societyAnalytics || [];

  return (
    <PermissionGuard permission="reports.view" moduleName="Reports & Executive Analytics">
      <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" /> Executive Analytics & Management Intelligence Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical CRM analytics, lead acquisition efficiency, agent leaderboards, and society comparison matrix.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* Data-Driven AI Insights Callout Banner */}
          <Card className="p-4 bg-gradient-to-r from-purple-950/90 via-slate-900 to-slate-950 text-white border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" /> Data-Driven CRM Intelligence Insights (Calculated)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {insights.map((ins: any) => (
                <div
                  key={ins.id}
                  className="p-3 rounded-lg bg-slate-900/80 border border-purple-500/20 space-y-1"
                >
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {ins.title}
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{ins.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 9 Executive KPI Metrics Cards Requested by Spec */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 text-xs">
            <Card className="p-4 bg-slate-900 text-white border-slate-800">
              <div className="text-slate-400">Total Revenue Collected</div>
              <div className="text-2xl font-extrabold text-brand-400 mt-1">
                {formatPKR(exec.totalRevenue)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Net cash received</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Gross Sales Volume</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {formatPKR(exec.salesVolume)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Gross property transactions</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Active Deals Count</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {exec.totalDeals} Deals
              </div>
              <div className="text-[10px] text-slate-500 mt-1">In 11-stage pipeline</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Overall Conversion Rate</div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {exec.conversionRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Lead to deal closure</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Lead Growth Rate</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                +{exec.leadGrowth}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Month-over-month increase</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Total Pipeline Value</div>
              <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
                {formatPKR(exec.pipelineValue)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Valuation of active deals</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Average Deal Value</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {formatPKR(exec.avgDealValue)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Per transaction</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Commission Earned</div>
              <div className="text-2xl font-extrabold text-amber-500 mt-1">
                {formatPKR(exec.commissionEarned)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Agent & company commissions</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Outstanding Payments</div>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {formatPKR(exec.outstandingPayments)}
              </div>
              <div className="text-[10px] text-rose-600 font-semibold mt-1">Pending collection</div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Monthly Revenue Growth Trend
              </h3>
              <RevenueChart />
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pipeline Stage Funnel Breakdown
              </h3>
              <LeadFunnelChart />
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: LEAD ANALYTICS */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Card className="p-4">
              <div className="text-slate-500 font-medium">Lead-to-Site-Visit Rate</div>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">
                {leadData.leadToVisitRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Leads inspecting properties</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500 font-medium">Site-Visit-to-Deal Rate</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {leadData.visitToDealRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Inspections converting to tokens</div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500 font-medium">Avg Lead Response Time</div>
              <div className="text-2xl font-extrabold text-brand-600 mt-1">12 Mins</div>
              <div className="text-[11px] text-slate-500 mt-0.5">From initial inquiry</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources Distribution */}
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Lead Acquisition Sources Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                {leadData.sources?.map((s: any) => (
                  <div key={s.source} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{s.source}</span>
                      <span>
                        {s.count} Leads ({s.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-600 h-[100%]" style={{ width: `${s.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Lost Lead Reasons */}
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Lost Lead Reasons Analysis
              </h3>

              <div className="space-y-3 text-xs">
                {leadData.lostReasons?.map((r: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{r.reason}</span>
                    <Badge variant="danger">{r.count} Leads</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: AGENT ANALYTICS & LEADERBOARD */}
      {activeTab === 'agents' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Agent Sales & Conversion Leaderboard
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Agent Name</th>
                <th className="p-3.5">Assigned / Contacted</th>
                <th className="p-3.5">Site Visits</th>
                <th className="p-3.5">Deals Closed</th>
                <th className="p-3.5">Sales Revenue</th>
                <th className="p-3.5">Conversion %</th>
                <th className="p-3.5">Avg Response</th>
                <th className="p-3.5">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {agents.map((agent: any, idx: number) => (
                <tr key={agent.agentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-brand-600">#{idx + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{agent.name}</td>
                  <td className="p-3.5">{agent.leadsAssigned} Leads</td>
                  <td className="p-3.5 font-semibold">{agent.siteVisits} Visits</td>
                  <td className="p-3.5 font-bold text-emerald-600">{agent.dealsClosed} Deals</td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPKR(agent.revenue)}
                  </td>
                  <td className="p-3.5 font-bold text-purple-600">{agent.conversionRate}%</td>
                  <td className="p-3.5 font-mono">{agent.avgResponseTime}</td>
                  <td className="p-3.5 font-bold text-amber-600">{formatPKR(agent.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 4: SOCIETY ANALYTICS COMPARISON */}
      {activeTab === 'societies' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Society Comparison Matrix
              </h3>
            </div>
            <Badge variant="purple">DHA • Faisal Hills • Bahria • Park View • Gulberg</Badge>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Society Name</th>
                <th className="p-3.5">Leads Count</th>
                <th className="p-3.5">Site Visits</th>
                <th className="p-3.5">Deals Closed</th>
                <th className="p-3.5">Sales Revenue</th>
                <th className="p-3.5">Avg Property Price</th>
                <th className="p-3.5">Conversion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {societies.map((soc: any) => (
                <tr key={soc.societyName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {soc.societyName}
                  </td>
                  <td className="p-3.5">{soc.leadsCount} Leads</td>
                  <td className="p-3.5">{soc.siteVisitsCount} Visits</td>
                  <td className="p-3.5 font-bold text-emerald-600">{soc.dealsCount} Deals</td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPKR(soc.totalRevenue)}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-600">
                    {formatPKR(soc.avgPropertyPrice)}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="purple">{soc.conversionRate}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 5: FINANCIAL ANALYTICS */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <Card className="p-4 bg-slate-900 text-white">
              <div className="text-slate-400">Total Net Revenue</div>
              <div className="text-2xl font-extrabold text-brand-400 mt-1">
                {formatPKR(exec.totalRevenue)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Commission Disbursed</div>
              <div className="text-2xl font-extrabold text-amber-500 mt-1">
                {formatPKR(exec.commissionEarned)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Outstanding Receivables</div>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">
                {formatPKR(exec.outstandingPayments)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-slate-500">Pipeline Value</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {formatPKR(exec.pipelineValue)}
              </div>
            </Card>
          </div>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Revenue vs Receivables Trend
            </h3>
            <RevenueChart />
          </Card>
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
