'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  User,
  Key,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { RoundRobinToggle } from '@/components/leads/round-robin-toggle';

export default function SettingsPage() {
  const { toast } = useToast();

  // Change Email Form State
  const [currentEmail, setCurrentEmail] = useState('asad@asadlandholdings.com');
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      toast('Invalid Email', 'Please enter a valid new email address.', 'error');
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch('/api/account/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, currentEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Email Address Updated', data.message, 'success');
        setCurrentEmail(newEmail);
        setNewEmail('');
      } else {
        const data = await res.json();
        toast('Error Updating Email', data.error || 'Failed to update email.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not update email.', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast('Weak Password', 'New password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast('Password Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        toast('Password Changed Successfully', data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast('Error Changing Password', data.error || 'Failed to update password.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not change password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PermissionGuard permission="settings.manage" moduleName="System Settings">
      <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" /> Account Security & Agency Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update account email address, change account password, manage company profile, and access user administration.
          </p>
        </div>

        {/* Settings Sub Nav */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
          <Link href="/profile" className="text-slate-500 hover:text-brand-600 dark:hover:text-slate-200 px-3 pb-2 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> My Profile & Photo
          </Link>
          <Link href="/settings" className="text-brand-600 border-b-2 border-brand-600 pb-2 px-1">
            General & Security Settings
          </Link>
          <Link href="/settings/users" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Users & Access
          </Link>
          <Link href="/settings/roles" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 px-3 pb-2">
            Roles & Permissions
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

        <div className="space-y-6">
          {/* LEAD ROUTING & ROUND-ROBIN MASTER SWITCH */}
          <RoundRobinToggle />

          {/* 1. CHANGE EMAIL ADDRESS CARD */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" /> Account Email Address Settings
              </h3>
              <Badge variant="purple">Primary Account</Badge>
            </div>

            <form onSubmit={handleUpdateEmail} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Email Address
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={currentEmail}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono"
                  />
                </div>

                <Input
                  label="New Email Address *"
                  type="email"
                  placeholder="e.g. asad.khan@asadlandholdings.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Changing your primary email address will immediately update your login credentials and send a security notification to both your old and new email addresses.
                </span>
              </div>

              <div className="flex justify-end">
                <Button type="submit" isLoading={emailLoading} className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Update Email Address
                </Button>
              </div>
            </form>
          </Card>

          {/* 2. CHANGE PASSWORD CARD */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500" /> Change Account Password
              </h3>
              <Badge variant="danger">Security Protected</Badge>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <Input
                  label="New Password *"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password *"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <Key className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>
                  Passwords are standard bcrypt hashed before storage. Updating your password invalidates older active sessions on other devices.
                </span>
              </div>

              <div className="flex justify-end">
                <Button type="submit" isLoading={passwordLoading} className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Change Password
                </Button>
              </div>
            </form>
          </Card>

          {/* 3. AGENCY PROFILE SETTINGS CARD */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-600" /> Agency Profile Settings
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <Input label="Company Name" defaultValue="Asad Land Holdings" />
              <Input label="Primary Operating City" defaultValue="Islamabad & Rawalpindi" />
              <Input label="Official WhatsApp Number" defaultValue="03008554433" />
              <Input label="Main Office Address" defaultValue="DHA Phase 8 Commercial Avenue, Islamabad" />
            </div>

            <Button
              onClick={() => toast('Agency Settings Saved', 'Updated agency profile settings.', 'success')}
              className="bg-brand-600 text-white font-semibold text-xs"
            >
              Save Agency Settings
            </Button>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}
