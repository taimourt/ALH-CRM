'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  DollarSign,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  Kanban,
  Table as TableIcon,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Zap,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  FileText,
  CreditCard,
  Briefcase,
  Layers,
  ChevronRight,
  UserPlus,
  Check,
  X,
  ExternalLink,
  Coins,
  BadgePercent,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { SideDrawer } from '@/components/ui/side-drawer';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { useRBAC } from '@/contexts/rbac-context';

const STAGES = [
  { id: 'NEW', label: 'New Inquiries', color: 'bg-blue-500', border: 'border-blue-500/40', bgLight: 'bg-blue-500/10' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-amber-500', border: 'border-amber-500/40', bgLight: 'bg-amber-500/10' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-500', border: 'border-purple-500/40', bgLight: 'bg-purple-500/10' },
  { id: 'SITE_VISIT', label: 'Site Visit', color: 'bg-indigo-500', border: 'border-indigo-500/40', bgLight: 'bg-indigo-500/10' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-500', border: 'border-orange-500/40', bgLight: 'bg-orange-500/10' },
  { id: 'TOKEN', label: 'Token Money', color: 'bg-teal-500', border: 'border-teal-500/40', bgLight: 'bg-teal-500/10' },
  { id: 'CLOSED_WON', label: 'Closed Deal', color: 'bg-emerald-600', border: 'border-emerald-500/40', bgLight: 'bg-emerald-500/10' },
];

function LeadsPageContent() {
  const { toast } = useToast();
  const { user } = useRBAC();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab')?.toUpperCase();
  const defaultTab = tabParam === 'BUYERS' ? 'BUYERS' : tabParam === 'INVESTORS' ? 'INVESTORS' : 'LEADS';
  const [activeTab, setActiveTab] = useState<'LEADS' | 'BUYERS' | 'INVESTORS'>(defaultTab);
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Drag and Drop States for Kanban
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // SLA & Round-Robin Modals
  const [slaModalOpen, setSlaModalOpen] = useState(false);
  const [slaStats, setSlaStats] = useState<any>(null);
  const [runningSlaCheck, setRunningSlaCheck] = useState(false);

  // Create Lead Modal
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    preferredSociety: 'Kohistan Enclave',
    preferredSize: '10 MARLA',
    preferredType: 'RESIDENTIAL_PLOT',
    budgetMax: '15000000',
    notes: '',
    assignedAgentId: '',
  });

  // Create Buyer / Customer Modal
  const [createBuyerModalOpen, setCreateBuyerModalOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState({
    name: '',
    phone: '',
    email: '',
    cnic: '',
    city: 'Islamabad',
    address: '',
    assignedAgentId: '',
  });

  // Drawer Reassign State
  const [targetAgentId, setTargetAgentId] = useState('');
  const [reassignReason, setReassignReason] = useState('Manager Allocation');
  const [reassigning, setReassigning] = useState(false);

  // Google Sheets Sync State
  const [syncingGoogleSheets, setSyncingGoogleSheets] = useState(false);

  const canAssignLeads =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ADMIN' ||
    user?.role === 'MANAGER' ||
    user?.permissions?.includes('leads.assign') ||
    user?.permissions?.includes('leads.manage');

  const handleSyncGoogleSheets = async () => {
    setSyncingGoogleSheets(true);
    try {
      const res = await fetch('/api/integrations/google-sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast(
          'Google Sheets Synced!',
          `Imported ${data.importedCount || 0} new leads. Skipped ${data.skippedDuplicates || 0} duplicates.`,
          'success'
        );
        fetchAllContactsData();
      } else {
        toast(
          'Google Sheets Sync Notice',
          data.error || 'Ensure Google Sheet sharing is set to "Anyone with the link can view".',
          'warning'
        );
      }
    } catch (err: any) {
      toast('Sync Failed', err.message || 'Network error syncing Google Sheets', 'error');
    } finally {
      setSyncingGoogleSheets(false);
    }
  };

  async function fetchAllContactsData() {
    try {
      const [leadsRes, custRes, usersRes, slaRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/customers'),
        fetch('/api/users'),
        fetch('/api/automation/sla-check'),
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (usersRes.ok) setAgents(await usersRes.json());
      if (slaRes.ok) setSlaStats(await slaRes.json());
    } catch (err) {
      console.error('Fetch contacts error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllContactsData();
  }, []);

  const handleStageChange = async (leadId: string, newStage: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev: any) => ({ ...prev, stage: newStage }));
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, stage: newStage }),
      });

      if (res.ok) {
        const stageObj = STAGES.find((s) => s.id === newStage);
        toast('Lead Stage Updated', `Moved lead to "${stageObj?.label || newStage}". Contact logged & SLA cleared.`, 'success');
        fetchAllContactsData();
      } else {
        toast('Update Failed', 'Could not update lead stage on server.', 'error');
        fetchAllContactsData();
      }
    } catch (err) {
      toast('Update Failed', 'Network error moving lead.', 'error');
      fetchAllContactsData();
    }
  };

  const handleManualReassign = async () => {
    if (!selectedLead || !targetAgentId) {
      toast('Selection Required', 'Please select a sales agent to assign this lead.', 'warning');
      return;
    }

    setReassigning(true);
    try {
      const res = await fetch('/api/leads/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          agentId: targetAgentId,
          reason: reassignReason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Lead Assigned Successfully', data.message || 'Assigned to sales agent and email dispatched.', 'success');
        setSelectedLead(data.lead);
        fetchAllContactsData();
      } else {
        toast('Assignment Failed', data.error || 'Could not assign lead.', 'error');
      }
    } catch (err) {
      toast('Error', 'Network error assigning lead.', 'error');
    } finally {
      setReassigning(false);
    }
  };

  const handleRunSlaCheck = async () => {
    setRunningSlaCheck(true);
    try {
      const res = await fetch('/api/automation/sla-check', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast('24h SLA Check Complete', data.message || 'Evaluated lead inactivity SLA and sent email alerts.', 'success');
        fetchAllContactsData();
      } else {
        toast('SLA Check Failed', data.error || 'Could not run SLA check.', 'error');
      }
    } catch (err) {
      toast('Error', 'Network error running SLA check.', 'error');
    } finally {
      setRunningSlaCheck(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        toast('Lead Created', `Added ${newLead.name} to the pipeline. Assigned via Round-Robin.`, 'success');
        setCreateLeadModalOpen(false);
        setNewLead({
          name: '',
          phone: '',
          email: '',
          preferredSociety: 'Kohistan Enclave',
          preferredSize: '10 MARLA',
          preferredType: 'RESIDENTIAL_PLOT',
          budgetMax: '15000000',
          notes: '',
          assignedAgentId: '',
        });
        fetchAllContactsData();
      } else {
        const err = await res.json();
        toast('Error', err.error || 'Failed to create lead', 'error');
      }
    } catch (e) {
      toast('Error', 'Network error creating lead', 'error');
    }
  };

  const handleCreateBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuyer),
      });
      if (res.ok) {
        toast('Verified Buyer Registered', `Added ${newBuyer.name} to the verified buyer asset ledger.`, 'success');
        setCreateBuyerModalOpen(false);
        setNewBuyer({
          name: '',
          phone: '',
          email: '',
          cnic: '',
          city: 'Islamabad',
          address: '',
          assignedAgentId: '',
        });
        fetchAllContactsData();
      } else {
        const err = await res.json();
        toast('Error', err.error || 'Failed to register buyer', 'error');
      }
    } catch (e) {
      toast('Error', 'Network error creating customer', 'error');
    }
  };

  // Drag and Drop handlers for Kanban
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (dragOverStageId !== stageId) setDragOverStageId(stageId);
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    setDraggedLeadId(null);
    setDragOverStageId(null);

    if (leadId) {
      handleStageChange(leadId, targetStageId);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.preferredSociety?.toLowerCase().includes(search.toLowerCase()) ||
      l.assignedAgent?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Fallback demo buyers if database is fresh
  const displayCustomers =
    customers.length > 0
      ? customers
      : [
          {
            id: 'c1',
            name: 'Hassan Raza',
            phone: '03027776655',
            email: 'hassan.raza@techfirm.io',
            cnic: '37405-1234567-1',
            city: 'Islamabad',
            address: 'House 42, Street 8, Sector F-11/1, Islamabad',
            assignedAgent: { name: 'Hamza Malik' },
            deals: [{ id: 'd1', title: 'Kohistan Enclave Sector B Plot 104', amount: 18000000, stage: 'CLOSED_WON' }],
            totalInvested: 18000000,
            kycStatus: 'VERIFIED',
          },
          {
            id: 'c2',
            name: 'Chaudhry Nisar',
            phone: '03215556677',
            email: 'nisar.chaudhry@rawalpindi.pk',
            cnic: '37405-9988776-5',
            city: 'Rawalpindi',
            address: 'Chaudhry House, Main GT Road, Wah Cantt',
            assignedAgent: { name: 'Taimour Shah' },
            deals: [
              { id: 'd2', title: 'New City Paradise Block A Commercial 5 Marla', amount: 25000000, stage: 'CLOSED_WON' },
              { id: 'd3', title: 'Kohistan Enclave Executive Block 1 Kanal', amount: 32000000, stage: 'TOKEN' },
            ],
            totalInvested: 57000000,
            kycStatus: 'VERIFIED',
          },
          {
            id: 'c3',
            name: 'Major (R) Tariq Mehmood',
            phone: '03004443322',
            email: 'tariq.mehmood@defence.gov.pk',
            cnic: '61101-4455667-3',
            city: 'Islamabad',
            address: 'House 19, DHA Phase 2, Islamabad',
            assignedAgent: { name: 'Ayesha Malik' },
            deals: [{ id: 'd4', title: 'DHA Phase 2 Sector J Plot 55', amount: 28000000, stage: 'CLOSED_WON' }],
            totalInvested: 28000000,
            kycStatus: 'PENDING_DOCS',
          },
        ];

  const filteredCustomers = displayCustomers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.cnic?.includes(search) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
  );

  const societyInvestors = displayCustomers.filter((c) => (c.deals?.length || 1) >= 2 || (c.totalInvested || 0) >= 25000000);

  const staleLeadsCount = leads.filter((l) => {
    if (l.stage !== 'NEW' && l.stage !== 'UNTOUCHED') return false;
    const assignedTime = new Date(l.assignedAt || l.createdAt).getTime();
    return (Date.now() - assignedTime) / (1000 * 60 * 60) >= 24;
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Contacts Hub Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-600" /> Contacts & Relationship Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 border border-brand-500/20">
              Pre-Sale & Post-Sale
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized ecosystem for inbound sales pipeline inquiries, verified property buyers, and High-Net-Worth investors.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncGoogleSheets}
            disabled={syncingGoogleSheets}
            className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            title="Fetch and sync leads from Google Sheets"
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 text-emerald-600 ${syncingGoogleSheets ? 'animate-spin' : ''}`} />
            {syncingGoogleSheets ? 'Syncing...' : 'Sync Google Sheet'}
          </Button>

          {canAssignLeads && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunSlaCheck}
              disabled={runningSlaCheck}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-200 hover:border-brand-500"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-500 ${runningSlaCheck ? 'animate-spin' : ''}`} />
              {runningSlaCheck ? 'Running SLA...' : '⚡ Run 24h SLA Check'}
            </Button>
          )}

          {activeTab === 'LEADS' ? (
            <Button
              size="sm"
              onClick={() => setCreateLeadModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> + Add Inbound Lead
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setCreateBuyerModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              <Landmark className="w-4 h-4" /> + Register Verified Buyer
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 SEGMENTED NAVIGATION TABS (UNIFIED CONTACTS ARCHITECTURE) */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Tab 1: Inbound Leads Pipeline */}
          <button
            onClick={() => setActiveTab('LEADS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'LEADS'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Inbound Leads Pipeline</span>
            <Badge variant={staleLeadsCount > 0 ? 'danger' : 'info'} className="text-[10px] px-1.5 py-0 h-4">
              {leads.length} Active
            </Badge>
          </button>

          {/* Tab 2: Verified Buyers & KYC */}
          <button
            onClick={() => setActiveTab('BUYERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'BUYERS'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Verified Buyers & KYC Ledger</span>
            <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
              {displayCustomers.length} Buyers
            </Badge>
          </button>

          {/* Tab 3: Society Investors */}
          <button
            onClick={() => setActiveTab('INVESTORS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'INVESTORS'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>High-Net-Worth Investors</span>
            <Badge variant="purple" className="text-[10px] px-1.5 py-0 h-4">
              {societyInvestors.length} HNWI
            </Badge>
          </button>
        </div>

        {/* Search Bar & View Toggles */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto px-1">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'LEADS'
                  ? 'Search leads, phone, society...'
                  : 'Search buyer name, CNIC, address...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          {activeTab === 'LEADS' && (
            <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setView('kanban')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'kanban' ? 'bg-brand-500/10 text-brand-600' : 'text-slate-400'
                }`}
                title="Kanban Board"
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('table')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'table' ? 'bg-brand-500/10 text-brand-600' : 'text-slate-400'
                }`}
                title="List View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎯 TAB 1: INBOUND LEADS PIPELINE (PRE-SALE VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'LEADS' && (
        <>
          {view === 'kanban' ? (
            <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[calc(100vh-280px)]">
              {STAGES.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
                const isOver = dragOverStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDrop={(e) => handleDrop(e, stage.id)}
                    className={`w-72 shrink-0 flex flex-col rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border transition-all duration-200 ${
                      isOver
                        ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="p-3.5 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {stage.label}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Stage Leads Cards */}
                    <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-360px)]">
                      {stageLeads.length === 0 ? (
                        <div className="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                          Drag leads here
                        </div>
                      ) : (
                        stageLeads.map((lead) => {
                          const assignedTime = new Date(lead.assignedAt || lead.createdAt).getTime();
                          const hoursElapsed = Math.round((Date.now() - assignedTime) / (1000 * 60 * 60));
                          const isStale = (lead.stage === 'NEW' || lead.stage === 'UNTOUCHED') && hoursElapsed >= 24;

                          return (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead.id)}
                              onClick={() => {
                                setSelectedLead(lead);
                                setTargetAgentId(lead.assignedAgentId || '');
                              }}
                              className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5 ${
                                isStale
                                  ? 'border-rose-500/80 ring-1 ring-rose-500/20'
                                  : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-500/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    {lead.name}
                                  </h4>
                                  <span className="text-[11px] font-mono text-emerald-600">{lead.phone}</span>
                                </div>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                    (lead.score || 50) >= 80
                                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                      : (lead.score || 50) >= 50
                                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  🔥 Score {lead.score || 50}
                                </span>
                              </div>

                              <div className="space-y-1 text-[11px] text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                                    {lead.preferredSociety || 'Kohistan Enclave'} • {lead.preferredSize || '10 Marla'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3 text-slate-400" />
                                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                    {formatPKR(lead.budgetMax || 15000000)}
                                  </span>
                                </div>
                              </div>

                              {/* Footer: Agent & Stale Alarm */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 font-medium truncate max-w-[120px]">
                                  👤 {lead.assignedAgent?.name || 'Unassigned'}
                                </span>

                                {isStale ? (
                                  <span className="text-rose-600 font-bold font-mono">
                                    ⚠️ {hoursElapsed}h Stale
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-mono">
                                    {lead.source || 'WhatsApp'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Lead Name</th>
                    <th className="p-3.5">Contact Number</th>
                    <th className="p-3.5">Society & Size</th>
                    <th className="p-3.5">Budget</th>
                    <th className="p-3.5">Stage</th>
                    <th className="p-3.5">Assigned Agent</th>
                    <th className="p-3.5 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setTargetAgentId(lead.assignedAgentId || '');
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{lead.name}</td>
                      <td className="p-3.5 font-mono text-emerald-600">{lead.phone}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {lead.preferredSociety || 'Kohistan Enclave'} • {lead.preferredSize || '10 Marla'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatPKR(lead.budgetMax || 15000000)}
                      </td>
                      <td className="p-3.5">
                        <Badge variant="purple">{lead.stage}</Badge>
                      </td>
                      <td className="p-3.5 text-slate-500">{lead.assignedAgent?.name || 'Round-Robin Pool'}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`https://wa.me/92${lead.phone?.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 🏛️ TAB 2: VERIFIED BUYERS & KYC ASSET LEDGER (POST-SALE VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'BUYERS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-emerald-600 bg-emerald-50/10">
              <span className="text-[11px] font-bold uppercase text-slate-500">Total Verified Buyers</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {displayCustomers.length} Property Owners
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">100% CNIC & KYC Verified</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-brand-600 bg-brand-50/10">
              <span className="text-[11px] font-bold uppercase text-slate-500">Cumulative Assets Portfolio</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {formatPKR(displayCustomers.reduce((sum, c) => sum + (c.totalInvested || 18000000), 0))}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Kohistan Enclave & New City</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-600 bg-purple-50/10">
              <span className="text-[11px] font-bold uppercase text-slate-500">Repeat Investors</span>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                {societyInvestors.length} Multi-Unit Holders
              </h3>
              <p className="text-[11px] text-purple-600 font-medium mt-1">High-ticket investment network</p>
            </Card>
          </div>

          {/* Buyers Directory Table */}
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Verified Buyer Profile</th>
                  <th className="p-3.5">NADRA CNIC</th>
                  <th className="p-3.5">Owned Society Files / Plots</th>
                  <th className="p-3.5">Total Invested Value</th>
                  <th className="p-3.5">KYC Status</th>
                  <th className="p-3.5">Relationship Agent</th>
                  <th className="p-3.5 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomers.map((buyer) => (
                  <tr
                    key={buyer.id}
                    onClick={() => setSelectedCustomer(buyer)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-brand-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          {buyer.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {buyer.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{buyer.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      {buyer.cnic || '37405-XXXXXXX-X'}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        {buyer.deals && buyer.deals.length > 0 ? (
                          buyer.deals.map((d: any, i: number) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium mr-1"
                            >
                              🏡 {d.title || d.property?.title || 'Kohistan Enclave Plot'}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">1 Allotted File</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-extrabold text-emerald-600">
                      {formatPKR(buyer.totalInvested || 18000000)}
                    </td>

                    <td className="p-3.5">
                      <Badge variant={buyer.kycStatus === 'PENDING_DOCS' ? 'warning' : 'success'}>
                        {buyer.kycStatus === 'PENDING_DOCS' ? '⏳ Pending Docs' : '✅ Verified CNIC'}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-slate-500">
                      {buyer.assignedAgent?.name || 'Senior Consultant'}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/92${buyer.phone?.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${buyer.phone}`}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💼 TAB 3: SOCIETY INVESTORS PORTFOLIO (HNWI VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'INVESTORS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white border border-purple-800/40 shadow-lg">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm">High-Net-Worth Real Estate Investors Directory</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Clients holding multiple plot files across Kohistan Enclave, New City Paradise, and DHA. Ideal for VIP pre-launch allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {societyInvestors.map((inv) => (
              <Card key={inv.id} className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 font-black flex items-center justify-center text-sm">
                      {inv.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{inv.name}</h4>
                      <span className="text-xs text-emerald-600 font-mono font-semibold">{inv.phone}</span>
                    </div>
                  </div>
                  <Badge variant="purple" className="font-mono">
                    {inv.deals?.length || 2} Active Assets
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Portfolio Valuation:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-mono text-sm">
                      {formatPKR(inv.totalInvested || 45000000)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Primary Location:</span>
                    <strong className="text-slate-700 dark:text-slate-300">{inv.city || 'Islamabad'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>NADRA CNIC:</span>
                    <strong className="font-mono text-slate-700 dark:text-slate-300">{inv.cnic || '37405-XXXXXXX-X'}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">Manager: {inv.assignedAgent?.name || 'Hamza Malik'}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/92${inv.phone?.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Pitch
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📋 LEAD DETAIL & REASSIGNMENT DRAWER */}
      {/* ========================================================================= */}
      <SideDrawer
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `Lead: ${selectedLead.name}` : ''}
        width="md"
      >
        {selectedLead && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-bold font-mono text-emerald-600 text-sm">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Society</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedLead.preferredSociety || 'Kohistan Enclave'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Budget Max</span>
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
                  {formatPKR(selectedLead.budgetMax || 15000000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Pipeline Stage</span>
                <Badge variant="purple">{selectedLead.stage}</Badge>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/92${selectedLead.phone?.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Open WhatsApp
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Call Client
              </a>
            </div>

            {/* Stage Quick Movement */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Move Pipeline Stage</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStageChange(selectedLead.id, s.id)}
                    className={`p-2 rounded-lg text-left font-semibold text-[11px] border transition-all ${
                      selectedLead.stage === s.id
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Assignment Section (Admin / Manager) */}
            {canAssignLeads && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-brand-600" /> Reassign Sales Agent
                </h4>
                <Select
                  label="Select Target Agent"
                  value={targetAgentId}
                  onChange={(e) => setTargetAgentId(e.target.value)}
                >
                  <option value="">Select an agent...</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={handleManualReassign}
                  disabled={reassigning || !targetAgentId}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                >
                  {reassigning ? 'Reassigning...' : 'Confirm Reassignment & Send Alert'}
                </Button>
              </div>
            )}
          </div>
        )}
      </SideDrawer>

      {/* ========================================================================= */}
      {/* 🏛️ BUYER KYC & ASSET DOSSIER DRAWER */}
      {/* ========================================================================= */}
      <SideDrawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `Buyer Dossier: ${selectedCustomer.name}` : ''}
        width="md"
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CNIC Number</span>
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-sm">
                  {selectedCustomer.cnic || '37405-XXXXXXX-X'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-bold font-mono text-emerald-600">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Residential Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.address || 'Islamabad, Pakistan'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Property Investment</span>
                <span className="font-extrabold font-mono text-emerald-600 text-sm">
                  {formatPKR(selectedCustomer.totalInvested || 18000000)}
                </span>
              </div>
            </div>

            {/* Owned Property Files List */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" /> Allotted Society Files & Plots
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Kohistan Enclave Sector B Plot 104</span>
                  <Badge variant="success">Allotted</Badge>
                </div>
                <p className="text-[11px] text-slate-500">10 Marla Residential • Token & Down Payment Paid</p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Allotment Certificate: #ALH-2026-084</span>
                  <span className="text-brand-600 font-semibold cursor-pointer hover:underline">
                    View SOA Ledger →
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/92${selectedCustomer.phone?.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Buyer
              </a>
              <Link
                href="/payments"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> Payment Receipts
              </Link>
            </div>
          </div>
        )}
      </SideDrawer>

      {/* ========================================================================= */}
      {/* ➕ CREATE LEAD MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createLeadModalOpen}
        onClose={() => setCreateLeadModalOpen(false)}
        title="Add Inbound Lead"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
          <Input
            label="Client Full Name *"
            required
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            placeholder="e.g. Farhan Zaidi"
          />
          <Input
            label="Phone Number (WhatsApp) *"
            required
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            placeholder="03001234567"
          />
          <Select
            label="Preferred Society"
            value={newLead.preferredSociety}
            onChange={(e) => setNewLead({ ...newLead, preferredSociety: e.target.value })}
          >
            <option value="Kohistan Enclave">Kohistan Enclave</option>
            <option value="New City Paradise">New City Paradise</option>
            <option value="DHA Phase 2">DHA Phase 2</option>
            <option value="Bahria Town Phase 8">Bahria Town Phase 8</option>
          </Select>
          <Input
            label="Max Budget (PKR)"
            type="number"
            value={newLead.budgetMax}
            onChange={(e) => setNewLead({ ...newLead, budgetMax: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setCreateLeadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white">
              Save Lead & Dispatch Round-Robin
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ➕ REGISTER VERIFIED BUYER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createBuyerModalOpen}
        onClose={() => setCreateBuyerModalOpen(false)}
        title="Register Verified Property Buyer"
      >
        <form onSubmit={handleCreateBuyer} className="space-y-4 text-xs">
          <Input
            label="Buyer Full Name *"
            required
            value={newBuyer.name}
            onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
            placeholder="e.g. Hassan Raza"
          />
          <Input
            label="Phone Number *"
            required
            value={newBuyer.phone}
            onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
            placeholder="03027776655"
          />
          <Input
            label="NADRA CNIC Number *"
            required
            value={newBuyer.cnic}
            onChange={(e) => setNewBuyer({ ...newBuyer, cnic: e.target.value })}
            placeholder="37405-1234567-1"
          />
          <Input
            label="Residential Address"
            value={newBuyer.address}
            onChange={(e) => setNewBuyer({ ...newBuyer, address: e.target.value })}
            placeholder="House 42, Sector F-11/1, Islamabad"
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setCreateBuyerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              Register Verified Buyer & KYC
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Contacts & Pipeline Hub...</div>}>
      <LeadsPageContent />
    </Suspense>
  );
}
