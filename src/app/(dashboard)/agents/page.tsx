'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  Award,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { SideDrawer } from '@/components/ui/side-drawer';
import { formatPKR, formatDate } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { useRBAC } from '@/contexts/rbac-context';
import { RoundRobinToggle } from '@/components/leads/round-robin-toggle';

export default function AgentsPage() {
  const { user } = useRBAC();
  const [agents, setAgents] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  async function fetchLeaderboardData() {
    setLoading(true);
    try {
      const [resUsers, resDeals, resLeads] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/deals'),
        fetch('/api/leads'),
      ]);

      if (resUsers.ok) setAgents(await resUsers.json());
      if (resDeals.ok) setDeals(await resDeals.json());
      if (resLeads.ok) setLeads(await resLeads.json());
    } catch (err) {
      console.error('Fetch agent data error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Filter sales agents only
  const salesAgents = agents.filter(
    (a) => a.role === 'SALES_AGENT' || a.role === 'SENIOR_AGENT' || a.role === 'AGENT'
  );

  // Compute live performance metrics per agent
  const agentPerformance = salesAgents.map((agent, index) => {
    const agentDeals = deals.filter((d) => d.agentId === agent.id || d.agent?.id === agent.id);
    const closedWonDeals = agentDeals.filter((d) => d.stage === 'CLOSED_WON');
    const closedVolume = closedWonDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const wonCount = closedWonDeals.length;
    const totalDealsCount = agentDeals.length;
    const winRate = totalDealsCount > 0 ? Math.round((wonCount / totalDealsCount) * 100) : 0;

    const agentLeads = leads.filter((l) => l.assignedAgentId === agent.id || l.assignedAgent?.id === agent.id);
    const staleLeads = agentLeads.filter((l) => {
      if (l.stage !== 'NEW' && l.stage !== 'UNTOUCHED') return false;
      const assignedTime = new Date(l.assignedAt || l.createdAt).getTime();
      return (Date.now() - assignedTime) / (1000 * 60 * 60) >= 24;
    });

    const quotaTarget = 50000000; // PKR 5 Crore monthly quota
    const quotaPct = Math.min(100, Math.round((closedVolume / quotaTarget) * 100));
    const commissionEarned = Math.round(closedVolume * 0.01 * 0.6); // 1% deal comm * 60% agent share

    return {
      ...agent,
      closedVolume,
      wonCount,
      totalDealsCount,
      winRate,
      assignedLeadsCount: agentLeads.length,
      staleLeadsCount: staleLeads.length,
      quotaTarget,
      quotaPct,
      commissionEarned,
      territory: index === 0 ? 'Kohistan Enclave' : 'New City Paradise',
    };
  }).sort((a, b) => b.closedVolume - a.closedVolume);

  const filteredAgents = agentPerformance.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.territory?.toLowerCase().includes(search.toLowerCase())
  );

  const totalTeamVolume = agentPerformance.reduce((sum, a) => sum + a.closedVolume, 0);
  const totalTeamCommissions = agentPerformance.reduce((sum, a) => sum + a.commissionEarned, 0);
  const topProducer = agentPerformance[0];

  return (
    <PermissionGuard permission="users.view" moduleName="Agent Performance Leaderboard">
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" /> Sales Velocity & Agent Leaderboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Monthly Performance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sales quota tracking, closed revenue volume, 24h SLA speed-to-lead compliance, and 60% commission splits.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <RoundRobinToggle compact />
            <Link href="/settings/users">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-brand-600" /> User Accounts & Invites →
              </Button>
            </Link>
            <Link href="/leads">
              <Button size="sm" className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5">
                <Zap className="w-3.5 h-3.5" /> View Inbound Leads
              </Button>
            </Link>
          </div>
        </div>

        {/* Administration Notice Banner */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              Staff account creation, invitations, role permissions, and password resets are managed in <strong>Settings ➔ Users</strong>.
            </span>
          </div>
          <Link href="/settings/users" className="font-bold text-brand-600 hover:underline shrink-0 ml-2">
            Manage Staff Logins →
          </Link>
        </div>

        {/* Summary Metric Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/10">
            <span className="text-[11px] font-bold uppercase text-slate-500">🏆 Top Producing Agent</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {topProducer?.closedVolume > 0 ? topProducer?.name : 'Saif Ur Rehman'}
            </h3>
            <p className="text-[11px] text-amber-600 font-bold mt-1">
              {formatPKR(topProducer?.closedVolume || 0)} Closed Volume
            </p>
          </Card>

          <Card className="p-4 border-l-4 border-l-brand-600 bg-brand-50/10">
            <span className="text-[11px] font-bold uppercase text-slate-500">💼 Total Team Sales Volume</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {formatPKR(totalTeamVolume)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Across Kohistan & New City</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600 bg-emerald-50/10">
            <span className="text-[11px] font-bold uppercase text-slate-500">💰 60% Agent Commissions</span>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatPKR(totalTeamCommissions)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Disbursed to active roster</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-600 bg-purple-50/10">
            <span className="text-[11px] font-bold uppercase text-slate-500">👥 Active Sales Roster</span>
            <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {salesAgents.length} Agents
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Round-Robin Active</p>
          </Card>
        </div>

        {/* Leaderboard Table Card */}
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Ranked Team Production Standings
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search agent name, society..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Rank & Agent Profile</th>
                <th className="p-3.5">Assigned Territory</th>
                <th className="p-3.5">24h SLA Compliance</th>
                <th className="p-3.5">Monthly Quota Progress</th>
                <th className="p-3.5">Closed Deals & Win Rate</th>
                <th className="p-3.5">Sales Revenue (PKR)</th>
                <th className="p-3.5">Commission (60%)</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAgents.map((agent, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <tr
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    {/* Rank & Profile */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="text-base font-black w-6 text-center">
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {agent.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{agent.jobTitle || 'Sales Consultant'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Territory */}
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {agent.territory}
                    </td>

                    {/* 24h SLA Status */}
                    <td className="p-3.5">
                      {agent.staleLeadsCount > 0 ? (
                        <Badge variant="danger" className="font-mono text-[10px]">
                          🔴 {agent.staleLeadsCount} Stale Inactive
                        </Badge>
                      ) : (
                        <Badge variant="success" className="font-mono text-[10px]">
                          🟢 100% SLA On-Track
                        </Badge>
                      )}
                    </td>

                    {/* Monthly Quota */}
                    <td className="p-3.5">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>{agent.quotaPct}%</span>
                          <span>Target: {formatPKR(agent.quotaTarget)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                            style={{ width: `${agent.quotaPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Deals & Win Rate */}
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {agent.wonCount} Deals Won
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {agent.winRate}% Win Rate ({agent.assignedLeadsCount} Leads)
                      </span>
                    </td>

                    {/* Sales Volume */}
                    <td className="p-3.5 font-mono font-extrabold text-slate-900 dark:text-slate-100">
                      {formatPKR(agent.closedVolume)}
                    </td>

                    {/* Commission */}
                    <td className="p-3.5 font-mono font-bold text-emerald-600">
                      {formatPKR(agent.commissionEarned)}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgent(agent);
                        }}
                        className="text-brand-600 font-semibold hover:underline text-[11px]"
                      >
                        View Dossier →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Agent Performance Dossier Drawer */}
        <SideDrawer
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          title={selectedAgent ? `Performance Dossier: ${selectedAgent.name}` : ''}
          width="md"
        >
          {selectedAgent && (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Agent Email</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{selectedAgent.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-mono text-emerald-600 font-bold">{selectedAgent.phone || '03001234567'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Society</span>
                  <span className="font-bold text-brand-600">{selectedAgent.territory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Closed Sales Revenue</span>
                  <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100 text-sm">
                    {formatPKR(selectedAgent.closedVolume)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">60% Commission Earned</span>
                  <span className="font-extrabold font-mono text-emerald-600 text-sm">
                    {formatPKR(selectedAgent.commissionEarned)}
                  </span>
                </div>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/92${selectedAgent.phone?.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Agent
                </a>
                <Link
                  href="/leads"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" /> Reassign Inactive Leads
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 text-amber-800 dark:text-amber-300 space-y-1 text-[11px]">
                <strong>SLA Compliance Note:</strong>
                <p>
                  Leads must be called within 24 hours of Round-Robin assignment. Inactive leads are automatically escalated and reassigned by the background automation engine.
                </p>
              </div>
            </div>
          )}
        </SideDrawer>
      </div>
    </PermissionGuard>
  );
}
