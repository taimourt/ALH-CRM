'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  MoreHorizontal,
  Mail,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { InvitationModal } from '@/components/invitation-modal';
import { useToast } from '@/components/ui/toast';
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { useRBAC } from '@/contexts/rbac-context';

export default function UsersPage() {
  const { toast } = useToast();
  const { role, isSuperAdmin, isManager } = useRBAC();
  const normRole = (role || '').toUpperCase().replace(/\s+/g, '_');
  const canCreateUser = isSuperAdmin || isManager || normRole === 'SUPER_ADMIN' || normRole === 'MANAGER';

  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');

  // Bulk Selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Add User Drawer Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'SALES_AGENT',
    departmentId: '',
    jobTitle: 'Sales Advisor',
    sendInvite: true,
  });

  // Generated Invitation Modal
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);
  const [createdInvitationData, setCreatedInvitationData] = useState<any | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (filterRole !== 'ALL') params.append('role', filterRole);
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      if (filterDept !== 'ALL') params.append('departmentId', filterDept);

      const [resUsers, resDepts] = await Promise.all([
        fetch(`/api/users?${params.toString()}`),
        fetch('/api/teams'),
      ]);

      if (resUsers.ok) setUsers(await resUsers.json());
      if (resDepts.ok) setDepartments(await resDepts.json());
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [search, filterRole, filterStatus, filterDept]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateUser) {
      toast('Access Denied', 'Only Super Admin and Managers have permission to create staff accounts.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const data = await res.json();
        toast('User Account Created', `Created user account for ${newUser.email}.`, 'success');
        setAddModalOpen(false);
        fetchUsers();

        if (data.invitationLink) {
          setCreatedInvitationData({
            userId: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            link: data.invitationLink,
          });
          setInvitationModalOpen(true);
        }
      } else {
        const data = await res.json();
        toast('Error', data.error || 'Failed to create user.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not create user.', 'error');
    }
  };

  const handleResendInvitation = async (userObj: any) => {
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userObj.id }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Invitation Resent', `Generated fresh invitation link for ${userObj.email}.`, 'success');
        fetchUsers();
        setCreatedInvitationData({
          userId: userObj.id,
          email: userObj.email,
          name: userObj.name,
          role: userObj.role,
          link: data.invitationLink,
        });
        setInvitationModalOpen(true);
      }
    } catch (err) {
      toast('Resend Error', 'Failed to resend invitation.', 'error');
    }
  };

  const handleBulkStatus = async (newStatus: string) => {
    if (selectedUserIds.length === 0) return;
    try {
      await Promise.all(
        selectedUserIds.map((id) =>
          fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      );
      toast('Bulk Action Completed', `Updated ${selectedUserIds.length} user statuses to ${newStatus}.`, 'success');
      setSelectedUserIds([]);
      fetchUsers();
    } catch (err) {
      toast('Bulk Action Error', 'Failed to update users.', 'error');
    }
  };

  const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'purple'> = {
    ACTIVE: 'success',
    INVITED: 'purple',
    INACTIVE: 'warning',
    SUSPENDED: 'danger',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Settings Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" /> User Management & Staff Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage user accounts, roles, departments, invitation links, and security statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreateUser ? (
            <Button
              onClick={() => setAddModalOpen(true)}
              className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Add User
            </Button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Read-Only Directory
            </span>
          )}
        </div>
      </div>

      {/* Settings Sub-Nav Links */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        <Link href="/settings/users" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
          Users
        </Link>
        <Link href="/settings/roles" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Roles & Permissions Matrix
        </Link>
        <Link href="/settings/teams" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Departments & Teams
        </Link>
        <Link href="/settings/email" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Email Templates & Logs
        </Link>
        <Link href="/settings/audit-logs" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Audit Trail Logs
        </Link>
      </div>

      {/* Filter Bar & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by name, email, phone, or EMP ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 text-xs h-9"
          />

          <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-36 text-xs h-9">
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SALES_AGENT">Sales Agent</option>
            <option value="SENIOR_AGENT">Senior Agent</option>
            <option value="ACCOUNTS">Accounts</option>
          </Select>

          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-36 text-xs h-9">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INVITED">Invited</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
        </div>

        {/* Bulk Action Controls */}
        {selectedUserIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">{selectedUserIds.length} Selected:</span>
            <Button size="sm" variant="outline" onClick={() => handleBulkStatus('ACTIVE')} className="h-7 text-[11px]">
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkStatus('INACTIVE')} className="h-7 text-[11px]">
              Deactivate
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkStatus('SUSPENDED')} className="h-7 text-[11px] text-rose-600">
              Suspend
            </Button>
          </div>
        )}
      </div>

      {/* User List Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5 w-8">
                <input
                  type="checkbox"
                  checked={selectedUserIds.length === users.length && users.length > 0}
                  onChange={(e) =>
                    setSelectedUserIds(e.target.checked ? users.map((u) => u.id) : [])
                  }
                />
              </th>
              <th className="p-3.5">User Name & EMP ID</th>
              <th className="p-3.5">Email & Phone</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Login</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">Loading user accounts...</td>
              </tr>
            )}

            {!loading &&
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u.id)}
                      onChange={(e) => {
                        setSelectedUserIds(
                          e.target.checked
                            ? [...selectedUserIds, u.id]
                            : selectedUserIds.filter((id) => id !== u.id)
                        );
                      }}
                    />
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <Link href={`/settings/users/${u.id}`} className="hover:text-brand-600 transition-colors">
                        {u.name}
                      </Link>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-8">{u.employeeId || 'EMP-001'}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{u.email}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{u.phone || 'N/A'}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Badge variant="purple" className="text-[10px]">
                      {u.role?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {u.department?.name || 'Sales Department'}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={statusVariants[u.status] || 'success'}>{u.status}</Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    {u.lastLoginAt ? (
                      <div className="flex flex-col" title={`Exact: ${formatDateTime(u.lastLoginAt)}`}>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 font-sans">
                          {Date.now() - new Date(u.lastLoginAt).getTime() < 10 * 60 * 1000 && (
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Active now" />
                          )}
                          {formatRelativeTime(u.lastLoginAt)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {formatDateTime(u.lastLoginAt)}
                        </span>
                      </div>
                    ) : u.status === 'INVITED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-sans font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Pending Invite
                      </span>
                    ) : (
                      <span className="text-slate-400 font-sans text-xs">Never</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canCreateUser && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendInvitation(u)}
                          className="text-[11px] h-7 gap-1 text-purple-600 hover:bg-purple-50"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Invite Link
                        </Button>
                      )}

                      <Link href={`/settings/users/${u.id}`}>
                        <Button size="sm" variant="outline" className="text-[11px] h-7 gap-1">
                          <Eye className="w-3.5 h-3.5 text-brand-600" /> View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>

      {/* Add User Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New User Account" maxWidth="md">
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="03001234567"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Role *"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="SALES_AGENT">Sales Agent</option>
              <option value="SENIOR_AGENT">Senior Agent</option>
              <option value="ACCOUNTS">Accounts</option>
            </Select>

            <Input
              label="Job Title"
              value={newUser.jobTitle}
              onChange={(e) => setNewUser({ ...newUser, jobTitle: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="sendInvite"
              checked={newUser.sendInvite}
              onChange={(e) => setNewUser({ ...newUser, sendInvite: e.target.checked })}
            />
            <label htmlFor="sendInvite" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
              Issue single-use secure email invitation link
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white font-semibold">
              Create User Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Generated Invitation Modal */}
      {createdInvitationData && (
        <InvitationModal
          isOpen={invitationModalOpen}
          onClose={() => setInvitationModalOpen(false)}
          recipientEmail={createdInvitationData.email}
          recipientName={createdInvitationData.name}
          invitationLink={createdInvitationData.link}
          roleName={createdInvitationData.role?.replace('_', ' ')}
          onResend={() => handleResendInvitation({ id: createdInvitationData.userId, email: createdInvitationData.email, name: createdInvitationData.name, role: createdInvitationData.role })}
        />
      )}
    </div>
  );
}
