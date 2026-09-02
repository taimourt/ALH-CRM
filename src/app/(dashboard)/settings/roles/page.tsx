'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Check, Plus, Edit3, Lock, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { ALL_PERMISSIONS, DEFAULT_ROLE_PRESETS } from '@/lib/rbac';
import Link from 'next/link';
import { PermissionGuard } from '@/components/auth/permission-guard';

const PERMISSION_GROUPS = [
  { module: 'leads', label: 'Leads Management', actions: ['view', 'create', 'edit', 'delete', 'assign', 'export'] },
  { module: 'properties', label: 'Property Inventory', actions: ['view', 'create', 'edit', 'delete', 'export'] },
  { module: 'deals', label: 'Deals Pipeline', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'payments', label: 'Payments & Receipts', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'commissions', label: 'Commissions', actions: ['view', 'create', 'edit'] },
  { module: 'users', label: 'User Administration', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'reports', label: 'Reports & Analytics', actions: ['view', 'export'] },
  { module: 'settings', label: 'System Settings', actions: ['manage'] },
  { module: 'ai', label: 'AI Assistant', actions: ['use'] },
];

export default function RolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  async function fetchRoles() {
    setLoading(true);
    try {
      const res = await fetch('/api/roles');
      if (res.ok) {
        const list = await res.json();
        setRoles(list);
        if (list.length > 0) {
          setSelectedRole(list[0]);
          let perms: string[] = [];
          try {
            perms = JSON.parse(list[0].permissions);
          } catch (e) {
            perms = DEFAULT_ROLE_PRESETS[list[0].name] || DEFAULT_ROLE_PRESETS.SALES_AGENT;
          }
          setActivePermissions(perms);
        }
      }
    } catch (err) {
      console.error('Fetch roles error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    let perms: string[] = [];
    try {
      perms = JSON.parse(role.permissions);
    } catch (e) {
      perms = DEFAULT_ROLE_PRESETS[role.name] || DEFAULT_ROLE_PRESETS.SALES_AGENT;
    }
    setActivePermissions(perms);
  };

  const togglePermission = (permStr: string) => {
    if (selectedRole?.name === 'Super Admin') {
      toast('Protected Role', 'Super Admin permissions cannot be modified.', 'error');
      return;
    }

    if (activePermissions.includes(permStr)) {
      setActivePermissions(activePermissions.filter((p) => p !== permStr));
    } else {
      setActivePermissions([...activePermissions, permStr]);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      const res = await fetch('/api/roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRole.id,
          permissions: activePermissions,
        }),
      });

      if (res.ok) {
        toast('Permissions Saved', `Updated permission matrix for ${selectedRole.name}.`, 'success');
        fetchRoles();
      }
    } catch (err) {
      toast('Save Error', 'Could not save permissions.', 'error');
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoleName,
          permissions: DEFAULT_ROLE_PRESETS.SALES_AGENT,
        }),
      });

      if (res.ok) {
        toast('Role Created', `Created custom role "${newRoleName}".`, 'success');
        setNewRoleName('');
        setCreateRoleOpen(false);
        fetchRoles();
      }
    } catch (err) {
      toast('Error', 'Failed to create role.', 'error');
    }
  };

  return (
    <PermissionGuard permission="settings.manage" moduleName="Roles & Permission Matrix">
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" /> Granular Roles & Permission Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure dynamic roles, module action permissions (MODULE.ACTION), and record-level access policies.
            </p>
          </div>

          <Button
            onClick={() => setCreateRoleOpen(true)}
            className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Custom Role
          </Button>
        </div>

        {/* Settings Sub-Nav Links */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
          <Link href="/settings" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            General & Security
          </Link>
          <Link href="/settings/users" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Users & Staff Directory
          </Link>
          <Link href="/settings/roles" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
            Roles & Permissions Matrix
          </Link>
          <Link href="/settings/teams" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Departments & Teams
          </Link>
          <Link href="/settings/email" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Email Engine & Templates
          </Link>
          <Link href="/settings/audit-logs" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Security Audit Trail
          </Link>
        </div>

        {/* Main Grid: Roles List (Left) & Permission Matrix (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Roles List Sidebar (4 cols) */}
          <Card className="lg:col-span-4 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Configured System Roles ({roles.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading roles...</div>
            ) : (
              <div className="space-y-1.5">
                {roles.map((role) => {
                  const isSelected = selectedRole?.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-950 dark:text-brand-100 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold">{role.name}</span>
                        {role.isSystem && (
                          <Badge variant="purple" className="text-[10px]">
                            SYSTEM
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{role.description || 'Standard role permissions preset.'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Permission Matrix Grid (8 cols) */}
          <Card className="lg:col-span-8 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Permission Matrix • {selectedRole?.name}
                </h2>
                <p className="text-xs text-slate-500">Toggle granular MODULE.ACTION permissions for this role.</p>
              </div>

              <Button
                onClick={handleSavePermissions}
                disabled={selectedRole?.name === 'Super Admin'}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Permission Matrix
              </Button>
            </div>

            {/* Matrix Groups */}
            <div className="space-y-5">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.module} className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{group.label}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.actions.map((act) => {
                      const permStr = `${group.module}.${act}`;
                      const isChecked = activePermissions.includes(permStr);
                      const isLocked = selectedRole?.name === 'Super Admin';

                      return (
                        <button
                          key={act}
                          type="button"
                          disabled={isLocked}
                          onClick={() => togglePermission(permStr)}
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all select-none ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-300'
                          } ${isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="capitalize">{act}</span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Create Role Modal */}
        <Modal isOpen={createRoleOpen} onClose={() => setCreateRoleOpen(false)} title="Create Custom Role" maxWidth="sm">
          <form onSubmit={handleCreateRole} className="space-y-4">
            <Input
              label="Role Name *"
              placeholder="e.g. Area Sales Manager"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateRoleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-600 text-white font-semibold">
                Create Role
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
