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
  Target,
  MapPin,
  Edit,
  Save,
  Check,
  Building2,
  Sliders,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { SideDrawer } from '@/components/ui/side-drawer';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { useRBAC } from '@/contexts/rbac-context';
import { RoundRobinToggle } from '@/components/leads/round-robin-toggle';

const DEFAULT_SOCIETIES = [
  'Kohistan Enclave',
  'New City Paradise',
  'Faisal Town Phase 2',
  'B-17 Multi Gardens',
  'DHA Phase 2 Islamabad',
  'Bahria Town Rawalpindi',
  'Park View City',
  'Gulberg Greens',
  'Capital Smart City',
  'Mumtaz City',
];

const TARGET_PRESETS = [
  { label: 'PKR 2.5 Cr', value: 25000000 },
  { label: 'PKR 5.0 Cr', value: 50000000 },
  { label: 'PKR 7.5 Cr', value: 75000000 },
  { label: 'PKR 10.0 Cr', value: 100000000 },
  { label: 'PKR 15.0 Cr', value: 150000000 },
];

export default function AgentsPage() {
  const { user, isSuperAdmin, isManager } = useRBAC();
  const { toast } = useToast();
  const [agents, setAgents] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [societies, setSocieties] = useState<string[]>(DEFAULT_SOCIETIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  // Super Admin / Manager Target & Territory Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any | null>(null);
  const [editTerritory, setEditTerritory] = useState('');
  const [customTerritory, setCustomTerritory] = useState('');
  const [editMonthlyTarget, setEditMonthlyTarget] = useState('50000000');
  const [saving, setSaving] = useState(false);

  // Drawer inline edit state
  const [drawerEditing, setDrawerEditing] = useState(false);
  const [drawerTerritory, setDrawerTerritory] = useState('');
  const [drawerCustomTerritory, setDrawerCustomTerritory] = useState('');
  const [drawerMonthlyTarget, setDrawerMonthlyTarget] = useState('50000000');
  const [drawerSaving, setDrawerSaving] = useState(false);

  const normRole = (user?.role || '').toUpperCase().replace(/\s+/g, '_');
  const canManageAgents = isSuperAdmin || isManager || normRole === 'SUPER_ADMIN' || normRole === 'MANAGER' || normRole === 'DIRECTOR';

  async function fetchLeaderboardData() {
    setLoading(true);
    try {
      const [resUsers, resDeals, resLeads, resSocieties] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/deals'),
        fetch('/api/leads'),
        fetch('/api/societies'),
      ]);

      if (resUsers.ok) setAgents(await resUsers.json());
      if (resDeals.ok) setDeals(await resDeals.json());
      if (resLeads.ok) setLeads(await resLeads.json());
      if (resSocieties.ok) {
        const socList = await resSocieties.json();
        if (Array.isArray(socList) && socList.length > 0) {
          const names = socList.map((s: any) => s.name).filter(Boolean);
          const merged = Array.from(new Set([...names, ...DEFAULT_SOCIETIES]));
          setSocieties(merged);
        }
      }
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

  // Compute live performance metrics per agent using dynamic territory & monthlyTarget from database
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

    const quotaTarget = agent.monthlyTarget !== undefined && agent.monthlyTarget !== null ? Number(agent.monthlyTarget) : 50000000;
    const quotaPct = Math.min(100, Math.round((closedVolume / (quotaTarget || 1)) * 100));
    const commissionEarned = Math.round(closedVolume * 0.01 * 0.7); // 1% deal comm * 70% agent share
    const territory = agent.territory || (index % 2 === 0 ? 'Kohistan Enclave' : 'New City Paradise');

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
      territory,
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

  // Open Edit Modal
  const handleOpenEditModal = (agent: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingAgent(agent);
    const currentTerritory = agent.territory || 'Kohistan Enclave';
    if (societies.includes(currentTerritory)) {
      setEditTerritory(currentTerritory);
      setCustomTerritory('');
    } else {
      setEditTerritory('CUSTOM');
      setCustomTerritory(currentTerritory);
    }
    setEditMonthlyTarget(String(agent.quotaTarget || agent.monthlyTarget || 50000000));
    setEditModalOpen(true);
  };

  // Save Target and Territory via Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    setSaving(true);

    const finalTerritory = editTerritory === 'CUSTOM' ? (customTerritory.trim() || 'Kohistan Enclave') : editTerritory;
    const finalTarget = parseFloat(editMonthlyTarget) || 50000000;

    try {
      const res = await fetch(`/api/users/${editingAgent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          territory: finalTerritory,
          monthlyTarget: finalTarget,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update agent settings');
      }

      // Update local state immediately
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? { ...a, territory: finalTerritory, monthlyTarget: finalTarget }
            : a
        )
      );

      if (selectedAgent && selectedAgent.id === editingAgent.id) {
        setSelectedAgent((prev: any) => ({
          ...prev,
          territory: finalTerritory,
          quotaTarget: finalTarget,
          monthlyTarget: finalTarget,
        }));
      }

      toast(
        'Agent Settings Updated',
        `Successfully updated territory to "${finalTerritory}" and quota to ${formatPKR(finalTarget)} for ${editingAgent.name}.`,
        'success'
      );
      setEditModalOpen(false);
    } catch (err: any) {
      toast('Update Failed', err.message || 'Error updating agent details', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Drawer Inline Editing
  const startDrawerEditing = () => {
    if (!selectedAgent) return;
    const currentTerritory = selectedAgent.territory || 'Kohistan Enclave';
    if (societies.includes(currentTerritory)) {
      setDrawerTerritory(currentTerritory);
      setDrawerCustomTerritory('');
    } else {
      setDrawerTerritory('CUSTOM');
      setDrawerCustomTerritory(currentTerritory);
    }
    setDrawerMonthlyTarget(String(selectedAgent.quotaTarget || selectedAgent.monthlyTarget || 50000000));
    setDrawerEditing(true);
  };

  // Save Target and Territory via Drawer
  const handleSaveDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setDrawerSaving(true);

    const finalTerritory = drawerTerritory === 'CUSTOM' ? (drawerCustomTerritory.trim() || 'Kohistan Enclave') : drawerTerritory;
    const finalTarget = parseFloat(drawerMonthlyTarget) || 50000000;

    try {
      const res = await fetch(`/api/users/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          territory: finalTerritory,
          monthlyTarget: finalTarget,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update agent settings');
      }

      // Update local state immediately
      setAgents((prev) =>
        prev.map((a) =>
          a.id === selectedAgent.id
            ? { ...a, territory: finalTerritory, monthlyTarget: finalTarget }
            : a
        )
      );

      setSelectedAgent((prev: any) => ({
        ...prev,
        territory: finalTerritory,
        quotaTarget: finalTarget,
        monthlyTarget: finalTarget,
        quotaPct: Math.min(100, Math.round(((prev?.closedVolume || 0) / (finalTarget || 1)) * 100)),
      }));

      toast(
        'Agent Settings Saved',
        `Assigned territory and monthly quota updated for ${selectedAgent.name}.`,
        'success'
      );
      setDrawerEditing(false);
    } catch (err: any) {
      toast('Update Failed', err.message || 'Error updating agent details', 'error');
    } finally {
      setDrawerSaving(false);
    }
  };

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
              Sales quota tracking, territory assignments, 24h SLA speed-to-lead compliance, and 70% commission splits.
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
              {canManageAgents ? (
                <span>
                  <strong>Manager / Admin Mode Active:</strong> You have authorization to adjust <strong>assigned territories</strong> and <strong>monthly quota targets</strong> for all sales agents.
                </span>
              ) : (
                <span>
                  Staff account creation, invitations, role permissions, and password resets are managed in <strong>Settings ➔ Users</strong>.
                </span>
              )}
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
              {topProducer?.closedVolume > 0 ? topProducer?.name : (salesAgents[0]?.name || 'Saif Ur Rehman')}
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
            <p className="text-[11px] text-slate-500 mt-1">Across Islamabad & Rawalpindi Projects</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600 bg-emerald-50/10">
            <span className="text-[11px] font-bold uppercase text-slate-500">💰 70% Agent Commissions</span>
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
                placeholder="Search agent name, territory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Rank & Agent Profile</th>
                  <th className="p-3.5">Assigned Territory</th>
                  <th className="p-3.5">24h SLA Compliance</th>
                  <th className="p-3.5">Monthly Quota Progress</th>
                  <th className="p-3.5">Closed Deals & Win Rate</th>
                  <th className="p-3.5">Sales Revenue (PKR)</th>
                  <th className="p-3.5">Commission (70%)</th>
                  <th className="p-3.5 text-right">Actions</th>
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
                      onClick={() => {
                        setSelectedAgent(agent);
                        setDrawerEditing(false);
                      }}
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
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span>{agent.territory}</span>
                        </div>
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
                        <div className="w-40 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{agent.quotaPct}%</span>
                            <span>Target: {formatPKR(agent.quotaTarget)}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
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

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canManageAgents && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleOpenEditModal(agent, e)}
                              className="h-7 text-[11px] gap-1 px-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 border-brand-200 dark:border-brand-900/40"
                              title="Edit Target & Territory"
                            >
                              <Edit className="w-3 h-3" /> Target
                            </Button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAgent(agent);
                              setDrawerEditing(false);
                            }}
                            className="text-brand-600 font-semibold hover:underline text-[11px]"
                          >
                            Dossier →
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Agent Performance Dossier Drawer */}
        <SideDrawer
          isOpen={!!selectedAgent}
          onClose={() => {
            setSelectedAgent(null);
            setDrawerEditing(false);
          }}
          title={selectedAgent ? `Performance Dossier: ${selectedAgent.name}` : ''}
          width="md"
        >
          {selectedAgent && (
            <div className="space-y-5 text-xs">
              {/* Profile Card */}
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
                  <span className="text-slate-500">Closed Sales Revenue</span>
                  <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100 text-sm">
                    {formatPKR(selectedAgent.closedVolume)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">70% Commission Earned</span>
                  <span className="font-extrabold font-mono text-emerald-600 text-sm">
                    {formatPKR(selectedAgent.commissionEarned)}
                  </span>
                </div>
              </div>

              {/* Target & Territory Card */}
              <div className="p-4 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                    <Target className="w-4 h-4 text-brand-600" />
                    <span>Territory & Monthly Target</span>
                  </div>
                  {canManageAgents && !drawerEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startDrawerEditing}
                      className="h-6 text-[10px] gap-1 px-2 bg-white dark:bg-slate-900 text-brand-600 border-brand-300 dark:border-brand-800"
                    >
                      <Edit className="w-2.5 h-2.5" /> Edit Target
                    </Button>
                  )}
                </div>

                {drawerEditing ? (
                  <form onSubmit={handleSaveDrawer} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Assigned Society / Territory
                      </label>
                      <Select
                        value={drawerTerritory}
                        onChange={(e) => setDrawerTerritory(e.target.value)}
                        className="text-xs"
                      >
                        {societies.map((soc) => (
                          <option key={soc} value={soc}>{soc}</option>
                        ))}
                        <option value="CUSTOM">➕ Custom Territory...</option>
                      </Select>
                    </div>

                    {drawerTerritory === 'CUSTOM' && (
                      <Input
                        label="Custom Territory Name"
                        placeholder="e.g. Blue World City, Top City..."
                        value={drawerCustomTerritory}
                        onChange={(e) => setDrawerCustomTerritory(e.target.value)}
                        required
                      />
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Monthly Sales Quota (PKR)
                        </label>
                        <span className="font-mono text-emerald-600 font-bold">
                          {formatPKR(parseFloat(drawerMonthlyTarget) || 0)}
                        </span>
                      </div>
                      <Input
                        type="number"
                        step="1000000"
                        value={drawerMonthlyTarget}
                        onChange={(e) => setDrawerMonthlyTarget(e.target.value)}
                        required
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {TARGET_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => setDrawerMonthlyTarget(String(preset.value))}
                            className={`px-2 py-0.5 text-[10px] rounded-md font-medium transition-all ${
                              drawerMonthlyTarget === String(preset.value)
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-200/50">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDrawerEditing(false)}
                        disabled={drawerSaving}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={drawerSaving}
                        className="h-7 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-1"
                      >
                        {drawerSaving ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Territory</span>
                      <div className="flex items-center gap-1 font-bold text-brand-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{selectedAgent.territory}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Monthly Target Quota</span>
                      <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100">
                        {formatPKR(selectedAgent.quotaTarget)}
                      </span>
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Progress: {selectedAgent.quotaPct}%</span>
                        <span>{formatPKR(selectedAgent.closedVolume)} / {formatPKR(selectedAgent.quotaTarget)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                          style={{ width: `${selectedAgent.quotaPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
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

        {/* Dedicated Target & Territory Edit Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={editingAgent ? `Adjust Target & Territory: ${editingAgent.name}` : 'Adjust Agent Target'}
          maxWidth="md"
        >
          {editingAgent && (
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {editingAgent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{editingAgent.name}</h4>
                  <p className="text-[11px] text-slate-500">{editingAgent.email} • {editingAgent.jobTitle || 'Sales Consultant'}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Assigned Real Estate Territory / Society *
                </label>
                <Select
                  value={editTerritory}
                  onChange={(e) => setEditTerritory(e.target.value)}
                  required
                >
                  {societies.map((soc) => (
                    <option key={soc} value={soc}>{soc}</option>
                  ))}
                  <option value="CUSTOM">➕ Custom Society Territory...</option>
                </Select>
              </div>

              {editTerritory === 'CUSTOM' && (
                <Input
                  label="Custom Society / Territory Name *"
                  placeholder="e.g. Eighteen Islamabad, University Town..."
                  value={customTerritory}
                  onChange={(e) => setCustomTerritory(e.target.value)}
                  required
                />
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Monthly Sales Target Quota (PKR) *
                  </label>
                  <span className="font-mono text-emerald-600 font-bold text-sm">
                    {formatPKR(parseFloat(editMonthlyTarget) || 0)}
                  </span>
                </div>
                <Input
                  type="number"
                  step="1000000"
                  value={editMonthlyTarget}
                  onChange={(e) => setEditMonthlyTarget(e.target.value)}
                  required
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TARGET_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setEditMonthlyTarget(String(preset.value))}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                        editMonthlyTarget === String(preset.value)
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </PermissionGuard>
  );
}
