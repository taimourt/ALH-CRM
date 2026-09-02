'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, Users, Building, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { formatPKR } from '@/lib/utils';
import Link from 'next/link';

export default function TeamsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Dept / Team Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<'DEPARTMENT' | 'TEAM'>('TEAM');
  const [name, setName] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');

  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const list = await res.json();
        setDepartments(list);
        if (list.length > 0) setSelectedDeptId(list[0].id);
      }
    } catch (err) {
      console.error('Fetch teams error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: addType,
          name,
          departmentId: selectedDeptId,
        }),
      });

      if (res.ok) {
        toast('Created', `Added new ${addType.toLowerCase()} "${name}".`, 'success');
        setName('');
        setAddModalOpen(false);
        fetchDepartments();
      }
    } catch (err) {
      toast('Error', 'Failed to create item.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" /> Super Admin — Team & Department Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete administrative control over organizational teams, team members, manager designations, and record reassignment.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Department / Team
        </Button>
      </div>

      {/* Sub Nav Links */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        <Link href="/settings/users" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Users
        </Link>
        <Link href="/settings/roles" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Roles & Permissions Matrix
        </Link>
        <Link href="/settings/teams" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
          Departments & Teams
        </Link>
        <Link href="/settings/email" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Email Templates & Logs
        </Link>
        <Link href="/settings/audit-logs" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Audit Trail Logs
        </Link>
      </div>

      {/* Departments & Teams Cards Grid */}
      <div className="space-y-6">
        {loading && <div className="p-8 text-center text-xs text-slate-400">Loading departments & teams...</div>}

        {!loading &&
          departments.map((dept) => (
            <Card key={dept.id} className="p-5 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-brand-600" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{dept.name}</h3>
                    <p className="text-xs text-slate-500">{dept.description || 'Organizational department'}</p>
                  </div>
                </div>
                <Badge variant="purple">{dept.teams?.length || 0} Active Teams</Badge>
              </div>

              {/* Team Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dept.teams?.map((team: any) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3 text-xs justify-between flex flex-col"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <span className="text-sm">{team.name}</span>
                        <Badge variant="success">Active</Badge>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div>
                          Team Manager: <strong className="text-slate-800 dark:text-slate-200">{team.leader?.name || 'Tariq Mahmood'}</strong>
                        </div>
                        <div>
                          Members: <strong>{team.users?.length || 0} Assigned Staff</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {team.id.substring(0, 8)}...</span>

                      <Link href={`/settings/teams/${team.id}`}>
                        <Button size="sm" className="bg-brand-600 hover:bg-brand-500 text-white text-[11px] h-7 gap-1 font-semibold">
                          Manage Team <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Department or Team" maxWidth="sm">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Select
            label="Type *"
            value={addType}
            onChange={(e) => setAddType(e.target.value as any)}
          >
            <option value="TEAM">New Team</option>
            <option value="DEPARTMENT">New Department</option>
          </Select>

          <Input
            label="Name *"
            placeholder={addType === 'DEPARTMENT' ? 'e.g. Corporate Affairs' : 'e.g. Sales Team Gamma'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {addType === 'TEAM' && (
            <Select
              label="Parent Department *"
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white font-semibold">
              Save {addType === 'DEPARTMENT' ? 'Department' : 'Team'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
