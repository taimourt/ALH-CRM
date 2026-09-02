'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, Eye, Lock, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function fetchAuditLogs() {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error('Fetch audit logs error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.targetType.toLowerCase().includes(search.toLowerCase()) ||
      l.actor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PermissionGuard permission="settings.manage" moduleName="Security Audit Logs">
      <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> Immutable Administrative Audit Trail Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log recording administrative actions, role modifications, user status changes, and record transfers.
          </p>
        </div>
      </div>

      {/* Sub Nav Links */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        <Link href="/settings/users" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
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
        <Link href="/settings/audit-logs" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
          Audit Trail Logs
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Filter audit logs by action, actor, or target..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 text-xs h-9"
        />
      </div>

      {/* Audit Log Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5">Actor / User</th>
              <th className="p-3.5">Action Executed</th>
              <th className="p-3.5">Target Module</th>
              <th className="p-3.5">IP Address & Device</th>
              <th className="p-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">Loading audit trail...</td>
              </tr>
            )}

            {!loading &&
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-brand-600" /> {log.actor?.name || 'Super Admin (Asad Khan)'}
                    </div>
                    <div className="text-[10px] text-slate-400 pl-5.5">{log.actor?.email || 'asad@asadlandholdings.com'}</div>
                  </td>
                  <td className="p-3.5 font-bold text-purple-600 dark:text-purple-400">
                    <Badge variant="purple" className="text-[10px]">{log.action}</Badge>
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {log.targetType} {log.targetId ? `(ID: ${log.targetId.substring(0, 8)}...)` : ''}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">
                    {log.ipAddress || '127.0.0.1'} • {log.deviceInfo || 'macOS / Antigravity'}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {formatDate(log.createdAt)}
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
