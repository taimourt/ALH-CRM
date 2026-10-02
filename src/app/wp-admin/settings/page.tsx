'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  Settings,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export default function WPAdminSettingsPage() {
  const { settings, updateSettings, exportDatabase, importDatabase, resetToDefaults } = useCMS();

  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [officeHours, setOfficeHours] = useState(settings.officeHours);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [enableAnnouncementBanner, setEnableAnnouncementBanner] = useState(settings.enableAnnouncementBanner);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [seoMetaTitle, setSeoMetaTitle] = useState(settings.seoMetaTitle);
  const [seoMetaDescription, setSeoMetaDescription] = useState(settings.seoMetaDescription);

  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        siteTitle,
        tagline,
        phone,
        whatsapp,
        email,
        address,
        officeHours,
        facebookUrl,
        youtubeUrl,
        instagramUrl,
        enableAnnouncementBanner,
        announcementText,
        seoMetaTitle,
        seoMetaDescription,
      });

      setNotice('Settings saved successfully!');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = () => {
    const data = exportDatabase();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alh-website-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.posts && parsed.properties) {
          await importDatabase(parsed);
          alert('Database restored successfully!');
          window.location.reload();
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all website CMS data to the default template? Any unsaved edits will be replaced.')) {
      await resetToDefaults();
      alert('Website CMS reset to default factory data.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">General Settings</h1>
          <p className="text-xs text-[#646970]">
            Configure site metadata, global phone numbers, social accounts and database backups.
          </p>
        </div>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Site Identity */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2">
            Site Identity & Branding
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Site Title</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs outline-none"
              />
              <p className="text-[11px] text-[#646970] mt-1">In a few words, explain what this site is about.</p>
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2">
            Official Contact Channels & Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Direct Phone Call Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official WhatsApp Number (With Country Code)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+923005123456"
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Public Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Physical Office Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Working & Office Hours</label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2">
            Top Announcement Banner
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAnnouncementBanner}
                onChange={(e) => setEnableAnnouncementBanner(e.target.checked)}
                className="rounded"
              />
              <span className="font-semibold">Display announcement bar on website header</span>
            </label>

            <div>
              <label className="block font-semibold mb-1">Banner Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2">
            Social Media Handles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#2271b1] text-white font-semibold text-xs rounded hover:bg-[#135e96] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Database Backup & Disaster Recovery Tools */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5 space-y-4">
        <h2 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider border-b border-[#f0f0f1] pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00a32a]" />
          Isolated Website CMS Database & Backup Manager
        </h2>
        <p className="text-xs text-[#646970]">
          This Website CMS uses its own standalone database, completely independent of the CRM lead tables. You can export, restore or reset all posts, listings, and rates at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-[#f6f7f7] border border-[#dcdcde] text-[#2c3338] font-semibold text-xs rounded hover:bg-[#f0f0f1] transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#2271b1]" /> Export Full Backup (.json)
          </button>

          <label className="px-3.5 py-2 bg-[#f6f7f7] border border-[#dcdcde] text-[#2c3338] font-semibold text-xs rounded hover:bg-[#f0f0f1] transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#2271b1]" /> Restore from Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-[#fbeaea] border border-[#d63638]/30 text-[#d63638] font-semibold text-xs rounded hover:bg-[#fbeaea]/80 transition-colors flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Factory Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
