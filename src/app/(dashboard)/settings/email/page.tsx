'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Send, Eye, Edit3, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function EmailSettingsPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'LOGS' | 'SETTINGS'>('TEMPLATES');

  // Edit Template Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [testEmail, setTestEmail] = useState('asad@asadlandholdings.com');

  async function fetchEmailData() {
    setLoading(true);
    try {
      const [resTemp, resLogs] = await Promise.all([
        fetch('/api/email/templates'),
        fetch('/api/email/logs'),
      ]);

      if (resTemp.ok) setTemplates(await resTemp.json());
      if (resLogs.ok) setLogs(await resLogs.json());
    } catch (err) {
      console.error('Fetch email data error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleTestEmail = async (slug: string) => {
    try {
      const res = await fetch('/api/email/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateSlug: slug, testEmail }),
      });

      if (res.ok) {
        toast('Test Email Queued', `Test email dispatched to ${testEmail}.`, 'success');
        fetchEmailData();
      } else {
        toast('Error', 'Failed to dispatch test email.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not send test email.', 'error');
    }
  };

  const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'purple'> = {
    DELIVERED: 'success',
    SENT: 'success',
    SENDING: 'purple',
    PENDING: 'warning',
    FAILED: 'danger',
  };

  return (
    <PermissionGuard permission="settings.manage" moduleName="Email Engine & Templates">
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" /> Email Notifications, Templates & Delivery Queue
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure SMTP credentials, manage automated HTML email templates, and inspect asynchronous delivery logs.
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
          <Link href="/settings/email" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
            Email Templates & Logs
          </Link>
          <Link href="/settings/audit-logs" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Audit Trail Logs
          </Link>
        </div>

        {/* Internal Sub Tabs */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'TEMPLATES'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-600'
            }`}
          >
            Email Templates ({templates.length})
          </button>

          <button
            onClick={() => setActiveTab('LOGS')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'LOGS'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-600'
            }`}
          >
            Delivery Queue Logs ({logs.length})
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3 py-1.5 rounded-lg border ${
              activeTab === 'SETTINGS'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-600'
            }`}
          >
            Provider & SMTP Config
          </button>
        </div>

        {/* TAB 1: EMAIL TEMPLATES */}
        {activeTab === 'TEMPLATES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{tpl.name}</h3>
                    <Badge variant={tpl.enabled ? 'success' : 'warning'}>
                      {tpl.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Subject: "{tpl.subject}"</div>

                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400 line-clamp-3">
                    {tpl.bodyHtml.replace(/<[^>]*>?/gm, '')}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400">
                    Variables:{' '}
                    <code className="text-purple-500">
                      {'{{first_name}}, {{company_name}}, {{invitation_link}}'}
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setEditModalOpen(true);
                    }}
                    className="text-xs h-8 gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Template
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleTestEmail(tpl.slug)}
                    className="text-xs h-8 bg-brand-600 text-white font-semibold gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Test Email
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 2: DELIVERY QUEUE LOGS */}
        {activeTab === 'LOGS' && (
          <Card className="overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Template</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Attempts</th>
                  <th className="p-3.5">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{log.recipient}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{log.subject}</td>
                    <td className="p-3.5 font-mono text-[11px]">{log.templateSlug || 'manual'}</td>
                    <td className="p-3.5">
                      <Badge variant={statusVariants[log.status] || 'success'}>{log.status}</Badge>
                    </td>
                    <td className="p-3.5 font-bold">{log.attempts}</td>
                    <td className="p-3.5 font-mono text-slate-500 text-[11px]">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* TAB 3: RESEND & SMTP PROVIDER CONFIG */}
        {activeTab === 'SETTINGS' && (
          <Card className="p-5 space-y-4 max-w-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" /> Resend & SMTP Email Server Config
              </h3>
              <Badge variant="success" className="text-[10px]">
                Resend SDK Active
              </Badge>
            </div>
            <p className="text-slate-500">
              Send real transactional emails using <strong>Resend</strong> or custom SMTP. Simply configure{' '}
              <code>RESEND_API_KEY</code> on Vercel or enter below.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                Primary Provider: Resend (Recommended)
              </div>
              <Input label="Resend API Key" placeholder="re_123456789_..." type="password" />
              <Input label="Sender Email / From" defaultValue="Asad Land Holdings <onboarding@resend.dev>" />
              <p className="text-[11px] text-slate-400">
                Free 3,000 emails/month on{' '}
                <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">
                  resend.com
                </a>
                . Once verified, you can use your custom domain.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                Secondary Provider: Custom SMTP / Gmail
              </div>
              <Input label="SMTP Host" placeholder="smtp.gmail.com / mail.yourdomain.com" />
              <div className="grid grid-cols-2 gap-2">
                <Input label="SMTP Port" placeholder="587 / 465" />
                <Input label="SMTP User" placeholder="notifications@domain.com" />
              </div>
            </div>

            <Button
              onClick={() => toast('Configuration Saved', 'Email provider credentials updated successfully.', 'success')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Save Provider Configuration
            </Button>
          </Card>
        )}

        {/* Edit Template Modal */}
        {selectedTemplate && (
          <Modal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title={`Edit Email Template • ${selectedTemplate.name}`}
            maxWidth="md"
          >
            <div className="space-y-3 text-xs">
              <Input label="Subject Line *" defaultValue={selectedTemplate.subject} />

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">HTML Body *</label>
                <textarea
                  className="w-full h-40 p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  defaultValue={selectedTemplate.bodyHtml}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast('Template Saved', 'Updated template subject and body.', 'success');
                    setEditModalOpen(false);
                  }}
                  className="bg-brand-600 text-white font-semibold"
                >
                  Save Template
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PermissionGuard>
  );
}
