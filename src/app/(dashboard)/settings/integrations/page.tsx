'use client';

import React, { useEffect, useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Zap,
  Globe,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Key,
  Play,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { RoundRobinToggle } from '@/components/leads/round-robin-toggle';

export default function ApiIntegrationsManagerPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'google-ads' | 'facebook-ads' | 'google-sheets' | 'api-keys'>('google-ads');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync state
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1jzScCXsAxB4DXCp5-69zh0M002T5xXDupOO9tch7zes/edit?resourcekey=&gid=308492530#gid=308492530'
  );
  const [syncing, setSyncing] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  // Live Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    googleAdsLeads: 0,
    facebookAdsLeads: 0,
    googleSheetsLeads: 0,
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://crm.asadlandholdings.com';

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast('Copied to Clipboard', text, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  async function fetchStats() {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalLeads: data.totalLeadsCount || 0,
          googleAdsLeads: data.connectors?.find((c: any) => c.id === 'google-ads')?.ingestedLeads || 0,
          facebookAdsLeads: data.connectors?.find((c: any) => c.id === 'facebook-lead-ads')?.ingestedLeads || 0,
          googleSheetsLeads: data.connectors?.find((c: any) => c.id === 'google-sheets')?.ingestedLeads || 0,
        });
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  // Simulator test functions
  const handleTestGoogleAds = async () => {
    setTestingWebhook(true);
    try {
      const samplePayload = {
        name: 'Mian Tariq (Google Ads)',
        phone: '0300' + Math.floor(1000000 + Math.random() * 9000000),
        email: 'tariq.prospect@gmail.com',
        preferredSociety: 'Kohistan Enclave',
        preferredSize: '10 MARLA',
        budgetMax: 32000000,
        campaign_id: 'GADS_WAH_CANTT_SEARCH_2026',
        notes: 'Inquiry for 10 Marla Executive House in Kohistan Enclave',
      };

      const res = await fetch('/api/webhooks/google-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Google Ads Webhook Success!', `Created lead "${data.leadName}" in Pipeline.`, 'success');
        fetchStats();
      } else {
        toast('Webhook Error', data.error || 'Failed to simulate Google Ads lead.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not test Google Ads webhook.', 'error');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleTestFacebookAds = async () => {
    setTestingWebhook(true);
    try {
      const samplePayload = {
        name: 'Zubair Chaudhry (Meta Ads)',
        phone: '0321' + Math.floor(1000000 + Math.random() * 9000000),
        email: 'zubair.lead@yahoo.com',
        preferredSociety: 'New City (Phase 2 & Paradise)',
        preferredSize: '5 MARLA',
        budgetMax: 18000000,
        form_id: 'META_NEW_CITY_VILLAS_LEADGEN',
        notes: 'Submitted lead form on Facebook & Instagram for 5 Marla Double Storey House',
      };

      const res = await fetch('/api/webhooks/facebook-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Facebook Ads Webhook Success!', `Created lead "${data.leadName}" in Pipeline.`, 'success');
        fetchStats();
      } else {
        toast('Webhook Error', data.error || 'Failed to simulate Meta lead.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not test Meta Ads webhook.', 'error');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleTestGoogleSheets = async () => {
    setTestingWebhook(true);
    try {
      const samplePayload = {
        name: 'Haji Abdul Rehman (Sheet Sync)',
        phone: '0333' + Math.floor(1000000 + Math.random() * 9000000),
        email: 'rehman.trading@gmail.com',
        preferredSociety: 'Kohistan Enclave',
        preferredSize: '1 KANAL',
        budgetMax: 55000000,
        notes: 'Entered in Google Sheet by sales team. Auto-pushed via Webhook.',
      };

      const res = await fetch('/api/webhooks/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Google Sheets Webhook Success!', `Created lead "${data.leadName}" in Pipeline.`, 'success');
        fetchStats();
      } else {
        toast('Webhook Error', data.error || 'Failed to simulate Google Sheets lead.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not test Google Sheets webhook.', 'error');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSyncGoogleSheets = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSyncing(true);

    try {
      const res = await fetch('/api/integrations/google-sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl }),
      });

      if (res.ok) {
        const result = await res.json();
        toast(
          'Google Sheets Sync Complete!',
          `Imported ${result.importedCount} new leads. Skipped ${result.skippedDuplicates} duplicates.`,
          'success'
        );
        fetchStats();
      } else {
        const errData = await res.json();
        toast('Sync Error', errData.error || 'Failed to sync Google Sheets.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not complete Google Sheets sync.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const googleAppsScriptCode = `function sendNewLeadToCRM(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = sheet.getLastRow();
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Adjust column indexes as per your sheet headers
  var payload = {
    name: data[0] || "Unknown Client",
    phone: String(data[1] || ""),
    email: data[2] || "",
    preferredSociety: data[3] || "Kohistan Enclave",
    preferredSize: data[4] || "10 MARLA",
    budgetMax: data[5] || 20000000,
    notes: data[6] || "Google Sheets Automated Row"
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  UrlFetchApp.fetch("${baseUrl}/api/webhooks/google-sheets", options);
}`;

  return (
    <PermissionGuard permission="settings.manage" moduleName="API & Integrations Hub">
      <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" /> API Manager & Automated Leads Ingestion Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect Google Ads, Facebook/Meta Lead Ads, and Google Sheets to automatically ingest leads into the pipeline in real-time.
          </p>
        </div>

        <Link href="/leads">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-sm">
            View Live Leads Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Sub Nav Links */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        <Link href="/settings/users" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Users & Access
        </Link>
        <Link href="/settings/roles" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Roles & Permissions
        </Link>
        <Link href="/settings/email" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Email Server & Resend
        </Link>
        <Link href="/settings/integrations" className="text-emerald-600 border-b-2 border-emerald-600 pb-2 px-1">
          API & Webhook Integrations
        </Link>
        <Link href="/settings/audit-logs" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
          Audit Trail Logs
        </Link>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3.5 border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-black text-sm">
            GAds
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Google Ads Webhook</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active & Listening
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black text-sm">
            Meta
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Facebook / Instagram Ads</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Webhook Verified
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5 border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Google Sheets Sync</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-Time & Auto-Sync
            </div>
          </div>
        </Card>
      </div>

      {/* Lead Routing Master Switch */}
      <RoundRobinToggle />

      {/* Integration Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('google-ads')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'google-ads'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🔴 Google Ads Lead Extension</span>
        </button>

        <button
          onClick={() => setActiveTab('facebook-ads')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'facebook-ads'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🔵 Facebook / Meta Lead Ads</span>
        </button>

        <button
          onClick={() => setActiveTab('google-sheets')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'google-sheets'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🟢 Google Sheets (Real-Time & Sync)</span>
        </button>

        <button
          onClick={() => setActiveTab('api-keys')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'api-keys'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Custom API Keys & Zapier</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE ADS */}
      {activeTab === 'google-ads' && (
        <Card className="p-6 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Google Ads Lead Form Extensions Webhook Integration
              </h3>
              <p className="text-slate-500 mt-0.5">
                Automatically ingest prospects who submit lead forms on Google Search, YouTube, and Display campaigns.
              </p>
            </div>

            <Button
              onClick={handleTestGoogleAds}
              isLoading={testingWebhook}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Send Sample Test Lead
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Google Ads Webhook URL *</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${baseUrl}/api/webhooks/google-ads`}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/google-ads`, 'gads-url')}
                  className="shrink-0 gap-1"
                >
                  {copiedField === 'gads-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste this Webhook URL in your Google Ads Campaign &gt; Assets &gt; Lead Form &gt; Lead Delivery option.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Google Key / Verification Secret *</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value="alh_gads_secret_2026"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('alh_gads_secret_2026', 'gads-key')}
                  className="shrink-0 gap-1"
                >
                  {copiedField === 'gads-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Enter this Key in the "Key" field of Google Ads Webhook configuration.
              </p>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> How to configure in Google Ads Manager:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              <li>Open your <strong>Google Ads Account</strong> and navigate to <strong>Ads &amp; Assets &gt; Assets &gt; Lead Form</strong>.</li>
              <li>Under <strong>Export leads from Google Ads</strong>, select <strong>Other lead integration options (Webhook)</strong>.</li>
              <li>Paste the <strong>Webhook URL</strong> and <strong>Key</strong> provided above.</li>
              <li>Click <strong>"Send Test Data"</strong> in Google Ads. Your CRM pipeline will instantly create a test lead!</li>
            </ol>
          </div>
        </Card>
      )}

      {/* TAB 2: FACEBOOK ADS */}
      {activeTab === 'facebook-ads' && (
        <Card className="p-6 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Facebook &amp; Instagram Lead Ads Webhook Integration
              </h3>
              <p className="text-slate-500 mt-0.5">
                Instant real-time lead capture from Meta Lead Ads, Instant Forms, and Instagram Sponsored Promotions.
              </p>
            </div>

            <Button
              onClick={handleTestFacebookAds}
              isLoading={testingWebhook}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Send Sample Test Lead
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Callback / Webhook URL *</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${baseUrl}/api/webhooks/facebook-ads`}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/facebook-ads`, 'fb-url')}
                  className="shrink-0 gap-1"
                >
                  {copiedField === 'fb-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste in Meta Developers &gt; Webhooks &gt; Page &gt; Callback URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Verify Token (hub.verify_token) *</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value="alh_meta_verify_2026"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('alh_meta_verify_2026', 'fb-token')}
                  className="shrink-0 gap-1"
                >
                  {copiedField === 'fb-token' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Verification handshake token for Meta Webhooks dashboard.
              </p>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> How to configure in Meta Business Suite / Developers:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              <li>Log in to <strong>developers.facebook.com</strong> and open your App.</li>
              <li>Go to <strong>Webhooks</strong>, select <strong>Page</strong> object, and click <strong>Subscribe to this object</strong>.</li>
              <li>Enter the <strong>Callback URL</strong> and <strong>Verify Token</strong> provided above, then click <strong>Verify and Save</strong>.</li>
              <li>Subscribe to the <strong>leadgen</strong> event field. Leads from all connected Facebook pages will automatically land in the CRM!</li>
            </ol>
          </div>
        </Card>
      )}

      {/* TAB 3: GOOGLE SHEETS */}
      {activeTab === 'google-sheets' && (
        <Card className="p-6 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Google Sheets Automated Real-Time Sync &amp; Webhook
              </h3>
              <p className="text-slate-500 mt-0.5">
                Two easy ways: Use Apps Script to push rows in real-time or perform one-click batch imports with automated deduplication.
              </p>
            </div>

            <Button
              onClick={handleTestGoogleSheets}
              isLoading={testingWebhook}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Send Sample Sheet Lead
            </Button>
          </div>

          {/* METHOD A: Real-Time Apps Script Webhook */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  ⚡ Method 1: Real-Time Google Apps Script Trigger (Recommended)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Whenever anyone adds a row to your Google Sheet, this script automatically sends the lead into the CRM pipeline within seconds.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(googleAppsScriptCode, 'apps-script')}
                className="gap-1 bg-white dark:bg-slate-900 text-emerald-600 font-bold shrink-0"
              >
                {copiedField === 'apps-script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Apps Script Code
              </Button>
            </div>

            <div className="relative">
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto max-h-40">
                {googleAppsScriptCode}
              </pre>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <strong>How to install in 30 seconds:</strong> In your Google Sheet, click <code>Extensions &gt; Apps Script</code>, paste the code above, click <strong>Triggers (Clock icon) &gt; Add Trigger &gt; Select Event type: "On form submit" or "On change"</strong>, and save!
            </div>
          </div>

          {/* METHOD B: Manual / Scheduled Sync */}
          <form onSubmit={handleSyncGoogleSheets} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
              🔄 Method 2: One-Click Batch Import &amp; Deduplication
            </span>
            <p className="text-[11px] text-slate-500">
              Enter your public or shared Google Sheet URL to fetch and deduplicate leads immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1"
              />
              <Button
                type="submit"
                isLoading={syncing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shrink-0 gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                Sync Google Sheet Now
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 4: API KEYS & ZAPIER */}
      {activeTab === 'api-keys' && (
        <Card className="p-6 space-y-5 text-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" /> Custom API Keys, Website Forms &amp; Zapier
            </h3>
            <p className="text-slate-500 mt-0.5">
              Use these API credentials to connect WordPress (Elementor), Webflow, Custom Landing Pages, Zapier, or Make.com.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">Production REST API Key</span>
                <Badge variant="purple">Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  type="password"
                  value="alh_live_sec_99388127361928374619"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('alh_live_sec_99388127361928374619', 'api-key')}
                  className="shrink-0 gap-1"
                >
                  {copiedField === 'api-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Key
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Pass in HTTP header: <code>Authorization: Bearer alh_live_sec_...</code> to <code>POST {baseUrl}/api/leads</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">JSON Payload Schema:</span>
              <pre className="p-3 bg-slate-950 text-purple-400 rounded-lg text-[11px] font-mono overflow-x-auto">
{`POST ${baseUrl}/api/leads
Content-Type: application/json

{
  "name": "Chaudhry Kamran",
  "phone": "03001234567",
  "email": "kamran@gmail.com",
  "preferredSociety": "Kohistan Enclave",
  "preferredSize": "10 MARLA",
  "budgetMax": 32500000,
  "source": "LANDING_PAGE"
}`}
              </pre>
            </div>
          </div>
        </Card>
      )}
      </div>
    </PermissionGuard>
  );
}
