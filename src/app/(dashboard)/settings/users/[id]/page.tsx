'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Shield,
  Award,
  History,
  Lock,
  UserX,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [user, setUser] = useState<any | null>(null);
  const [allAgents, setAllAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Deactivation Reassignment Drawer Modal
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState('');

  // Delete Safety Check Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  async function fetchUser() {
    setLoading(true);
    try {
      const [resUser, resAgents] = await Promise.all([
        fetch(`/api/users/${params.id}`),
        fetch('/api/users?role=SALES_AGENT'),
      ]);

      if (resUser.ok) setUser(await resUser.json());
      if (resAgents.ok) {
        const list = await resAgents.json();
        setAllAgents(list.filter((a: any) => a.id !== params.id));
        if (list.length > 0) setTargetAgentId(list[0].id);
      }
    } catch (err) {
      console.error('Fetch user details error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'INACTIVE' && user?.performance?.leadsAssigned > 0) {
      setReassignModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast('Status Updated', `User status changed to ${newStatus}.`, 'success');
        fetchUser();
      }
    } catch (err) {
      toast('Update Error', 'Could not update user status.', 'error');
    }
  };

  const handleReassignAndDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${params.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAgentId }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Reassigned & Deactivated', data.message, 'success');
        setReassignModalOpen(false);
        fetchUser();
      }
    } catch (err) {
      toast('Reassignment Error', 'Failed to reassign records.', 'error');
    }
  };

  const handleDeleteSafetyCheck = async () => {
    try {
      const res = await fetch(`/api/users/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Account Deleted', 'User account permanently deleted.', 'success');
        window.location.href = '/settings/users';
      } else {
        const data = await res.json();
        setDeleteErrorMsg(data.message || 'Safety check failed.');
        setDeleteModalOpen(true);
      }
    } catch (err) {
      toast('Delete Error', 'Server error.', 'error');
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading user profile...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview & Profile', icon: <User className="w-4 h-4" /> },
    { id: 'activity', label: 'CRM Activity Log', icon: <History className="w-4 h-4 text-purple-500" />, count: user.activityLogs?.length || 0 },
    { id: 'performance', label: 'Agent Performance', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { id: 'security', label: 'Security & Sessions', icon: <Lock className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <Card className="p-5 bg-slate-900 text-white border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-500"
            />
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                {user.name} <Badge variant="purple">{user.role?.replace('_', ' ')}</Badge>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.jobTitle || 'Sales Executive'} • Employee ID: <strong>{user.employeeId || 'EMP-001'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={user.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-36 text-xs h-8 bg-slate-950 text-white border-slate-800"
            >
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Invited</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteSafetyCheck}
              className="text-xs border-rose-500/30 text-rose-400 hover:bg-rose-950/40"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Account Profile Info</h4>
            <div className="space-y-2">
              <div><span className="text-slate-400">Email:</span> <strong className="text-slate-900 dark:text-slate-100">{user.email}</strong></div>
              <div><span className="text-slate-400">Phone:</span> <strong className="font-mono">{user.phone || 'N/A'}</strong></div>
              <div><span className="text-slate-400">WhatsApp:</span> <strong className="font-mono">{user.whatsappNumber || user.phone || 'N/A'}</strong></div>
              <div><span className="text-slate-400">Status:</span> <Badge variant="success">{user.status}</Badge></div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Department & Manager</h4>
            <div className="space-y-2">
              <div><span className="text-slate-400">Department:</span> <strong>{user.department?.name || 'Sales Department'}</strong></div>
              <div><span className="text-slate-400">Team:</span> <strong>{user.team?.name || 'Sales Team Alpha'}</strong></div>
              <div><span className="text-slate-400">Manager:</span> <strong>{user.manager?.name || 'Tariq Mahmood'}</strong></div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <Card className="p-4 space-y-3 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-slate-500">CRM Activity Timeline History</h4>
          <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-3">
            {user.activityLogs?.map((log: any) => (
              <div key={log.id} className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500" />
                <div className="font-bold text-slate-900 dark:text-slate-100">{log.action.replace('_', ' ')}</div>
                <p className="text-slate-600 dark:text-slate-400">{log.description}</p>
                <div className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: AGENT PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Card className="p-4">
            <div className="text-slate-500">Assigned Leads</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {user.performance?.leadsAssigned} Leads
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-slate-500">Site Visits Completed</div>
            <div className="text-2xl font-extrabold text-brand-600 mt-1">
              {user.performance?.siteVisits} Visits
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-slate-500">Total Sales Volume</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {formatPKR(user.performance?.totalRevenue)}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <Card className="p-4 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Active Login Sessions & Devices</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast('Sessions Revoked', 'Revoked all active login sessions.', 'success')}
              className="text-xs text-rose-600 border-rose-500/30"
            >
              Revoke All Active Sessions
            </Button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">Antigravity Browser / macOS</div>
            <div className="text-slate-500 font-mono text-[11px]">
              IP: 127.0.0.1 • Last Active: {user.lastLoginAt ? `${formatRelativeTime(user.lastLoginAt)} (${formatDateTime(user.lastLoginAt)})` : 'Never'}
            </div>
          </div>
        </Card>
      )}

      {/* Deactivation Reassignment Modal */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title={`Reassign CRM Records Before Deactivating ${user.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleReassignAndDeactivate} className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {user.name} currently owns active leads and open deals. Select a target agent to safely transfer these records before deactivating the account.
          </p>

          <Select
            label="Reassign Active Records To *"
            value={targetAgentId}
            onChange={(e) => setTargetAgentId(e.target.value)}
          >
            {allAgents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.role?.replace('_', ' ')})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setReassignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white font-semibold">
              Reassign Records & Deactivate Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deletion Safety Check Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Deletion Safety Check Triggered"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-950/20 border border-rose-500/40 text-rose-400 rounded-lg space-y-1">
            <div className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Deletion Blocked by Safety Guard
            </div>
            <p>{deleteErrorMsg}</p>
          </div>

          <p className="text-slate-500">
            To prevent losing historical transaction audits, we strongly recommend deactivating this account instead of hard deletion.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Dismiss
            </Button>
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setReassignModalOpen(true);
              }}
              className="bg-brand-600 text-white font-semibold"
            >
              Deactivate Account Instead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
