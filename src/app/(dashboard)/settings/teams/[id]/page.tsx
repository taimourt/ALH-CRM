'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ArrowRight,
  Shield,
  Layers,
  Award,
  History,
  TrendingUp,
  FileText,
  AlertTriangle,
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function TeamManagementPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [team, setTeam] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');

  // Add Member Modal State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('SALES_AGENT');

  // Change Manager Modal State
  const [changeManagerOpen, setChangeManagerOpen] = useState(false);
  const [newManagerId, setNewManagerId] = useState('');

  // Remove Member Modal State (Reassignment Guard)
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [targetMember, setTargetMember] = useState<any | null>(null);
  const [reassignOption, setReassignOption] = useState<'KEEP' | 'REASSIGN'>('KEEP');
  const [reassignToMemberId, setReassignToMemberId] = useState('');

  // Move Member Modal State
  const [moveMemberOpen, setMoveMemberOpen] = useState(false);
  const [destinationTeamId, setDestinationTeamId] = useState('');

  async function fetchTeamDetails() {
    setLoading(true);
    try {
      const [resTeam, resUsers, resTeams] = await Promise.all([
        fetch(`/api/teams/${params.id}`),
        fetch('/api/users'),
        fetch('/api/teams'),
      ]);

      if (resTeam.ok) setTeam(await resTeam.json());
      if (resUsers.ok) {
        const uList = await resUsers.json();
        setAllUsers(uList);
        if (uList.length > 0) setSelectedUserId(uList[0].id);
      }
      if (resTeams.ok) {
        const dList = await resTeams.json();
        const flatTeams: any[] = [];
        dList.forEach((d: any) => {
          if (d.teams) flatTeams.push(...d.teams);
        });
        setAllTeams(flatTeams.filter((t) => t.id !== params.id));
        if (flatTeams.length > 0) setDestinationTeamId(flatTeams[0].id);
      }
    } catch (err) {
      console.error('Fetch team details error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeamDetails();
  }, [params.id]);

  // Add Existing CRM User to Team
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      const res = await fetch(`/api/teams/${params.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, newRoleId: selectedRoleId }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Member Added', data.message, 'success');
        setAddMemberOpen(false);
        fetchTeamDetails();
      }
    } catch (err) {
      toast('Error', 'Failed to add member to team.', 'error');
    }
  };

  // Change Team Manager
  const handleChangeManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManagerId) return;

    try {
      const res = await fetch(`/api/teams/${params.id}/manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId: newManagerId }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Manager Changed', data.message, 'success');
        setChangeManagerOpen(false);
        fetchTeamDetails();
      }
    } catch (err) {
      toast('Error', 'Failed to update team manager.', 'error');
    }
  };

  // Move Member between Teams
  const handleMoveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMember || !destinationTeamId) return;

    try {
      const res = await fetch(`/api/teams/${destinationTeamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetMember.id }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Member Moved', `Moved ${targetMember.name} to destination team while preserving all CRM history.`, 'success');
        setMoveMemberOpen(false);
        fetchTeamDetails();
      }
    } catch (err) {
      toast('Move Error', 'Failed to move member.', 'error');
    }
  };

  // Remove Member from Team
  const handleRemoveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMember) return;

    try {
      const paramsQuery = new URLSearchParams();
      paramsQuery.append('userId', targetMember.id);
      if (reassignOption === 'REASSIGN' && reassignToMemberId) {
        paramsQuery.append('reassignToUserId', reassignToMemberId);
      }

      const res = await fetch(`/api/teams/${params.id}/members?${paramsQuery.toString()}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const data = await res.json();
        toast('Member Removed', data.message, 'success');
        setRemoveMemberOpen(false);
        fetchTeamDetails();
      }
    } catch (err) {
      toast('Remove Error', 'Failed to remove member.', 'error');
    }
  };

  if (loading || !team) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading team management hub...</div>;
  }

  const tabs = [
    { id: 'members', label: 'Team Members', icon: <Users className="w-4 h-4" />, count: team.members?.length || 0 },
    { id: 'leads', label: 'Active Team Leads', icon: <TrendingUp className="w-4 h-4 text-purple-500" />, count: team.teamLeads?.length || 0 },
    { id: 'deals', label: 'Team Deals Pipeline', icon: <Award className="w-4 h-4 text-emerald-500" />, count: team.teamDeals?.length || 0 },
    { id: 'tasks', label: 'Team Tasks', icon: <FileText className="w-4 h-4 text-brand-600" />, count: team.teamTasks?.length || 0 },
    { id: 'activity', label: 'Team Activity Timeline', icon: <History className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Team Overview Header Card */}
      <Card className="p-5 bg-slate-900 text-white border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold">{team.name}</h2>
              <Badge variant="purple">{team.department?.name || 'Sales Department'}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manager: <strong>{team.leader?.name || 'Tariq Mahmood'}</strong> • Members: <strong>{team.members?.length || 0} Staff</strong>
            </p>
          </div>

          {/* Action Suite */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => setAddMemberOpen(true)}
              className="text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add Member
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setChangeManagerOpen(true)}
              className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800 gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Change Manager
            </Button>
          </div>
        </div>

        {/* Team Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Total Team Sales Volume:</span>
            <div className="font-extrabold text-emerald-400 text-base">{formatPKR(team.totalRevenue)}</div>
          </div>
          <div>
            <span className="text-slate-400">Active Team Leads:</span>
            <div className="font-bold text-slate-200 text-sm">{team.teamLeads?.length || 0} Leads</div>
          </div>
          <div>
            <span className="text-slate-400">Pipeline Deals:</span>
            <div className="font-bold text-brand-400 text-sm">{team.teamDeals?.length || 0} Deals</div>
          </div>
          <div>
            <span className="text-slate-400">Pending Tasks:</span>
            <div className="font-bold text-amber-400 text-sm">{team.teamTasks?.length || 0} Tasks</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: MEMBERS DATA TABLE */}
      {activeTab === 'members' && (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Member Name & Avatar</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Active Leads</th>
                <th className="p-3.5">Open Deals</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {team.members?.map((member: any) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <Link href={`/settings/users/${member.id}`} className="hover:text-brand-600 transition-colors">
                        {member.name}
                      </Link>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-9">{member.email}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Badge variant="purple">{member.role?.replace('_', ' ')}</Badge>
                  </td>
                  <td className="p-3.5 font-bold">{member.activeLeads} Leads</td>
                  <td className="p-3.5 font-bold text-emerald-600">{member.openDeals} Deals</td>
                  <td className="p-3.5">
                    <Badge variant={member.status === 'ACTIVE' ? 'success' : 'warning'}>{member.status}</Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTargetMember(member);
                          setMoveMemberOpen(true);
                        }}
                        className="text-[11px] h-7 gap-1"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Move Team
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTargetMember(member);
                          setRemoveMemberOpen(true);
                        }}
                        className="text-[11px] h-7 gap-1 text-rose-600 hover:bg-rose-50"
                      >
                        <UserX className="w-3.5 h-3.5" /> Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 2: ACTIVE TEAM LEADS */}
      {activeTab === 'leads' && (
        <Card className="p-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Team Leads Overview</h4>
          <div className="space-y-2">
            {team.teamLeads?.map((l: any) => (
              <div key={l.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{l.name}</div>
                  <div className="text-slate-500">{l.phone} • Preferred: {l.preferredSociety || 'DHA Phase 8'}</div>
                </div>
                <Badge variant="purple">Assigned: {l.assignedAgent?.name || 'Agent'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: TEAM DEALS PIPELINE */}
      {activeTab === 'deals' && (
        <Card className="p-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Team Deals Pipeline</h4>
          <div className="space-y-2">
            {team.teamDeals?.map((d: any) => (
              <div key={d.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{d.title}</div>
                  <div className="text-slate-500">Amount: {formatPKR(d.amount)} • Stage: {d.stage}</div>
                </div>
                <Badge variant="success">Agent: {d.agent?.name}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: TEAM TASKS */}
      {activeTab === 'tasks' && (
        <Card className="p-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Pending Team Tasks</h4>
          <div className="space-y-2">
            {team.teamTasks?.map((t: any) => (
              <div key={t.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{t.title}</div>
                  <div className="text-slate-500">{t.description}</div>
                </div>
                <Badge variant="warning">Assigned To: {t.assignedTo?.name}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: TEAM ACTIVITY TIMELINE */}
      {activeTab === 'activity' && (
        <Card className="p-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Team Audit Activity Timeline</h4>
          <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-3">
            {team.teamActivity?.map((act: any) => (
              <div key={act.id} className="relative space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-slate-100">{act.user?.name}: {act.action}</div>
                <p className="text-slate-500">{act.description}</p>
                <div className="text-[10px] text-slate-400">{formatDate(act.createdAt)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ADD MEMBER MODAL */}
      <Modal isOpen={addMemberOpen} onClose={() => setAddMemberOpen(false)} title={`Add Member to ${team.name}`} maxWidth="md">
        <form onSubmit={handleAddMember} className="space-y-4 text-xs">
          <Select
            label="Select Existing CRM User *"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email}) — Current Team: {u.team?.name || 'Unassigned'}
              </option>
            ))}
          </Select>

          <Select
            label="Assign Role within Team *"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            <option value="SALES_AGENT">Sales Agent</option>
            <option value="SENIOR_AGENT">Senior Agent</option>
            <option value="MANAGER">Sales Manager</option>
          </Select>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white font-semibold">
              Add Member to Team
            </Button>
          </div>
        </form>
      </Modal>

      {/* CHANGE MANAGER MODAL */}
      <Modal isOpen={changeManagerOpen} onClose={() => setChangeManagerOpen(false)} title={`Change Team Manager for ${team.name}`} maxWidth="sm">
        <form onSubmit={handleChangeManager} className="space-y-4 text-xs">
          <Select
            label="Select New Team Manager *"
            value={newManagerId}
            onChange={(e) => setNewManagerId(e.target.value)}
          >
            <option value="">Select User...</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role?.replace('_', ' ')})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setChangeManagerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white font-semibold">
              Confirm & Assign Manager
            </Button>
          </div>
        </form>
      </Modal>

      {/* MOVE MEMBER MODAL */}
      {targetMember && (
        <Modal isOpen={moveMemberOpen} onClose={() => setMoveMemberOpen(false)} title={`Move ${targetMember.name} to Another Team`} maxWidth="sm">
          <form onSubmit={handleMoveMember} className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Moving <strong>{targetMember.name}</strong> will transfer their team assignment while preserving all historical ownership, commissions, and activity logs.
            </p>

            <Select
              label="Select Destination Team *"
              value={destinationTeamId}
              onChange={(e) => setDestinationTeamId(e.target.value)}
            >
              {allTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setMoveMemberOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-600 text-white font-semibold">
                Move Member
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* REMOVE MEMBER MODAL (REASSIGNMENT GUARD) */}
      {targetMember && (
        <Modal
          isOpen={removeMemberOpen}
          onClose={() => setRemoveMemberOpen(false)}
          title={`Remove ${targetMember.name} from ${team.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleRemoveMember} className="space-y-4 text-xs">
            <div className="p-3 bg-brand-50/60 dark:bg-brand-950/40 border border-brand-500/30 rounded-lg text-brand-700 dark:text-brand-300">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Account Preservation Guarantee
              </div>
              <p className="mt-1 text-[11px]">
                Removing <strong>{targetMember.name}</strong> from <strong>{team.name}</strong> does <strong>NOT</strong> delete their CRM account or historical transaction records. Only the team relationship is removed.
              </p>
            </div>

            {/* Active Responsibilities Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">Active Responsibilities Summary</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div>• {targetMember.activeLeads} Active Leads</div>
                <div>• {targetMember.openDeals} Open Deals</div>
                <div>• {targetMember.visits} Site Visits</div>
                <div>• {targetMember.tasks} Pending Tasks</div>
              </div>
            </div>

            {/* Reassignment Option Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Active Record Reassignment:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="reassign"
                    checked={reassignOption === 'KEEP'}
                    onChange={() => setReassignOption('KEEP')}
                  />
                  <span>Keep Assigned to {targetMember.name}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="reassign"
                    checked={reassignOption === 'REASSIGN'}
                    onChange={() => setReassignOption('REASSIGN')}
                  />
                  <span>Reassign to another team member</span>
                </label>
              </div>
            </div>

            {reassignOption === 'REASSIGN' && (
              <Select
                label="Reassign Active Records To *"
                value={reassignToMemberId}
                onChange={(e) => setReassignToMemberId(e.target.value)}
              >
                <option value="">Select Team Member...</option>
                {team.members
                  ?.filter((m: any) => m.id !== targetMember.id)
                  .map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role?.replace('_', ' ')})
                    </option>
                  ))}
              </Select>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setRemoveMemberOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-semibold">
                Remove from Team
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
