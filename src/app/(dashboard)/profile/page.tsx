'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  MessageSquare,
  Briefcase,
  Sparkles,
  Save,
  Check,
  X,
  AlertTriangle,
  Upload,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useRBAC } from '@/contexts/rbac-context';
import Link from 'next/link';

// Curated modern business avatars
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
];

export default function ProfilePage() {
  const { toast } = useToast();
  const { isSuperAdmin, refreshPermissions } = useRBAC();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'approvals' | 'security'>('profile');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // User Profile State
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    employeeId: '',
    jobTitle: '',
    phone: '',
    whatsappNumber: '',
    avatar: '',
    notes: '',
    status: 'ACTIVE',
  });

  // Pending Email Change Request (for current user)
  const [pendingEmailRequest, setPendingEmailRequest] = useState<any | null>(null);
  const [userRequestHistory, setUserRequestHistory] = useState<any[]>([]);

  // Request Email Change Form State
  const [newEmail, setNewEmail] = useState('');
  const [emailReason, setEmailReason] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [cancellingRequest, setCancellingRequest] = useState(false);

  // Super Admin Approval Queue State
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<any | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewingAction, setReviewingAction] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch Profile and Email Requests
  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/account/profile');
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setProfile({
          id: u.id,
          name: u.name || '',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          role: u.role || 'SALES_AGENT',
          employeeId: u.employeeId || '',
          jobTitle: u.jobTitle || 'Property Consultant',
          phone: u.phone || '',
          whatsappNumber: u.whatsappNumber || '',
          avatar: u.avatar || AVATAR_PRESETS[0],
          notes: u.notes || '',
          status: u.status || 'ACTIVE',
        });
        setPendingEmailRequest(data.pendingEmailRequest);
        if (u.emailChangeRequests) {
          setUserRequestHistory(u.emailChangeRequests);
        }
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminApprovals = async () => {
    if (!isSuperAdmin) return;
    setLoadingApprovals(true);
    try {
      const res = await fetch('/api/account/email-change-request');
      if (res.ok) {
        const data = await res.json();
        setAllRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load admin approval queue:', err);
    } finally {
      setLoadingApprovals(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (isSuperAdmin) {
      fetchAdminApprovals();
    }
  }, [isSuperAdmin]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          name: profile.name || `${profile.firstName} ${profile.lastName}`.trim(),
          avatar: profile.avatar,
          phone: profile.phone,
          whatsappNumber: profile.whatsappNumber,
          jobTitle: profile.jobTitle,
          notes: profile.notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Profile Updated', 'Your profile settings have been saved.', 'success');
        // Update local storage so Header avatar & name reflect changes instantly
        localStorage.setItem('user_name', data.user.name);
        if (data.user.avatar) localStorage.setItem('user_avatar', data.user.avatar);
        window.dispatchEvent(new Event('storage'));
        refreshPermissions();
      } else {
        toast('Update Failed', data.error || 'Could not save profile settings.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Failed to reach server.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Image File Upload (convert to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast('File Too Large', 'Please select an image smaller than 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
        toast('Avatar Selected', 'Click "Save Profile" to apply your new profile photo.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Request Email Change
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      toast('Invalid Email', 'Please enter a valid new email address.', 'error');
      return;
    }

    setSubmittingEmail(true);
    try {
      const res = await fetch('/api/account/email-change-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail,
          reason: emailReason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.immediate) {
          toast('Email Updated Directly', data.message, 'success');
          setProfile((prev) => ({ ...prev, email: newEmail }));
          localStorage.setItem('user_email', newEmail);
        } else {
          toast('Request Submitted', data.message, 'success');
          setPendingEmailRequest(data.request);
        }
        setNewEmail('');
        setEmailReason('');
        fetchProfileData();
        if (isSuperAdmin) fetchAdminApprovals();
      } else {
        toast('Request Failed', data.error || 'Could not submit email change request.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not submit request.', 'error');
    } finally {
      setSubmittingEmail(false);
    }
  };

  // Handle Cancel Pending Request
  const handleCancelPendingRequest = async () => {
    if (!pendingEmailRequest) return;
    setCancellingRequest(true);

    try {
      const res = await fetch(`/api/account/email-change-request?id=${pendingEmailRequest.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        toast('Request Cancelled', 'Your pending email change request was cancelled.', 'info');
        setPendingEmailRequest(null);
        fetchProfileData();
        if (isSuperAdmin) fetchAdminApprovals();
      } else {
        toast('Error', data.error || 'Could not cancel request.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Failed to cancel request.', 'error');
    } finally {
      setCancellingRequest(false);
    }
  };

  // Super Admin: Review Request (Approve / Reject)
  const handleReviewRequest = async (requestId: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    setReviewingAction(true);
    try {
      const res = await fetch('/api/account/email-change-request/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          rejectionReason: reason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(
          action === 'APPROVE' ? 'Email Change Approved' : 'Email Change Rejected',
          data.message,
          action === 'APPROVE' ? 'success' : 'info'
        );
        setRejectModalOpen(false);
        setSelectedReviewRequest(null);
        setRejectionReason('');
        fetchAdminApprovals();
        fetchProfileData();
      } else {
        toast('Review Failed', data.error || 'Could not review request.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Failed to review request.', 'error');
    } finally {
      setReviewingAction(false);
    }
  };

  // Handle Password Update
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

      const data = await res.json();
      if (res.ok) {
        toast('Password Changed Successfully', data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast('Password Change Failed', data.error || 'Failed to update password.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not change password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const pendingApprovalsCount = allRequests.filter((r) => r.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 animate-pulse space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p>Loading your profile and security settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* 🌟 HERO PROFILE CARD BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 text-white p-6 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with Status Ring */}
          <div className="relative group">
            <img
              src={profile.avatar || AVATAR_PRESETS[0]}
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/10 shadow-2xl transition-transform group-hover:scale-105"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition-all"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
              <Badge variant={isSuperAdmin ? 'purple' : 'success'} className="text-xs px-2.5 py-0.5">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                {profile.role.replace(/_/g, ' ')}
              </Badge>
            </div>

            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                {profile.jobTitle || 'Property Advisor'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
              {profile.employeeId && (
                <>
                  <span>•</span>
                  <span className="text-slate-400 font-mono">ID: {profile.employeeId}</span>
                </>
              )}
            </p>

            {/* Pending Email Alert Banner if present */}
            {pendingEmailRequest && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>
                    Email change to <strong>{pendingEmailRequest.newEmail}</strong> is awaiting Super Admin approval.
                  </span>
                </span>
                <button
                  onClick={handleCancelPendingRequest}
                  disabled={cancellingRequest}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 text-[11px] font-bold transition-all shrink-0"
                >
                  {cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" /> Personal Details & Photo
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all relative ${
            activeTab === 'email'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" /> Email & Approval Status
          {pendingEmailRequest && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'approvals'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Email Change Approvals
            {pendingApprovalsCount > 0 && (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-bold ml-1">
                {pendingApprovalsCount}
              </Badge>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" /> Password & Security
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 👤 TAB 1: PERSONAL DETAILS & AVATAR PICKER */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" /> Personal Identity & Contact Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your profile photo, display name, contact phone, and professional bio.
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* 🖼️ AVATAR SELECTION LIBRARY */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Choose Profile Photo Preset or Upload
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Custom Image
              </Button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATAR_PRESETS.map((presetUrl, idx) => {
                const isSelected = profile.avatar === presetUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfile({ ...profile, avatar: presetUrl })}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                      isSelected
                        ? 'border-brand-600 ring-2 ring-brand-500/40 scale-105 shadow-md'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={presetUrl}
                      alt={`Preset ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Avatar URL input */}
            <div className="pt-2">
              <Input
                label="Or Direct Image URL"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                placeholder="e.g. Saif"
              />
              <Input
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                placeholder="e.g. Ur Rehman"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Display Name *"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Saif Ur Rehman"
              />
              <Input
                label="Job Title"
                value={profile.jobTitle}
                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                placeholder="e.g. Senior Property Consultant"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="03055713959"
              />
              <Input
                label="WhatsApp Number (Client Dispatch)"
                value={profile.whatsappNumber}
                onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                placeholder="03055713959"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                type="submit"
                disabled={savingProfile}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-1.5 px-6"
              >
                <Save className="w-3.5 h-3.5" />
                {savingProfile ? 'Saving Profile...' : 'Save Profile Settings'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 📧 TAB 2: EMAIL ADDRESS & SUPER ADMIN APPROVAL WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* Current Active Email Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-600" /> Active Account Email
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This email is used for system logins, lead assignments, and security alerts.
                </p>
              </div>
              <Badge variant="success">Verified Primary</Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Current Email Address:</span>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">{profile.email}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active Login ID
              </span>
            </div>
          </Card>

          {/* Pending Approval Status Card OR Request Form */}
          {pendingEmailRequest ? (
            <Card className="p-6 border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-md shadow-amber-500/20">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                      Email Change Request Awaiting Super Admin Approval
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                      You requested to change your email from <strong>{pendingEmailRequest.currentEmail}</strong> to{' '}
                      <strong className="underline text-amber-950 dark:text-amber-100">{pendingEmailRequest.newEmail}</strong> on{' '}
                      {new Date(pendingEmailRequest.createdAt).toLocaleDateString()}.
                    </p>
                    {pendingEmailRequest.reason && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                        Reason provided: "{pendingEmailRequest.reason}"
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelPendingRequest}
                  disabled={cancellingRequest}
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 text-xs shrink-0"
                >
                  {cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-600" /> Request Email Address Change
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSuperAdmin
                    ? 'As Super Admin, your email change applies immediately upon confirmation.'
                    : 'Changing your staff account email requires review and approval by Super Admin (Asad Khan).'}
                </p>
              </div>

              <form onSubmit={handleRequestEmailChange} className="space-y-4 text-xs">
                <Input
                  label="New Email Address *"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. new.email@gmail.com"
                />

                <Input
                  label="Reason for Change (Optional)"
                  value={emailReason}
                  onChange={(e) => setEmailReason(e.target.value)}
                  placeholder="e.g. Switched to official business email account"
                />

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Security Notice
                  </div>
                  <p>
                    Once submitted, Super Admin will be notified to authorize the email update. Your current email will
                    remain active until approved.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={submittingEmail || !newEmail}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                  >
                    {submittingEmail
                      ? 'Submitting...'
                      : isSuperAdmin
                      ? 'Update Super Admin Email Directly'
                      : 'Submit Email Change for Approval'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Request History */}
          {userRequestHistory.length > 0 && (
            <Card className="p-6 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                Email Change Request History
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {userRequestHistory.map((req) => (
                  <div key={req.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {req.newEmail}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Requested on {new Date(req.createdAt).toLocaleDateString()}
                        {req.rejectionReason && ` • Reason: ${req.rejectionReason}`}
                      </div>
                    </div>
                    <Badge
                      variant={
                        req.status === 'APPROVED'
                          ? 'success'
                          : req.status === 'PENDING'
                          ? 'warning'
                          : 'danger'
                      }
                      className="text-[10px]"
                    >
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🛡️ TAB 3: SUPER ADMIN EMAIL APPROVAL QUEUE */}
      {/* ========================================================================= */}
      {isSuperAdmin && activeTab === 'approvals' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-600" /> Staff Email Change Approval Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve or reject email change requests submitted by sales agents and staff.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAdminApprovals}
              disabled={loadingApprovals}
              className="text-xs gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingApprovals ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>

          {allRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No email change requests have been submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Requester Staff</th>
                    <th className="p-3">Current Email</th>
                    <th className="p-3">Requested New Email</th>
                    <th className="p-3">Reason & Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Super Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={req.user?.avatar || AVATAR_PRESETS[0]}
                            alt={req.user?.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{req.user?.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{req.user?.role?.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{req.currentEmail}</td>
                      <td className="p-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {req.newEmail}
                      </td>
                      <td className="p-3 text-slate-500">
                        <div className="truncate max-w-[150px]" title={req.reason || 'No reason specified'}>
                          {req.reason || 'Profile update'}
                        </div>
                        <div className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            req.status === 'APPROVED'
                              ? 'success'
                              : req.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                          className="text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {req.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleReviewRequest(req.id, 'APPROVE')}
                              disabled={reviewingAction}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-2.5 font-bold"
                            >
                              <Check className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedReviewRequest(req);
                                setRejectModalOpen(true);
                              }}
                              disabled={reviewingAction}
                              className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 text-[11px] h-7 px-2"
                            >
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {req.status === 'APPROVED' ? `Approved by ${req.reviewedBy?.name || 'Admin'}` : 'Decided'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 🔒 TAB 4: PASSWORD & SECURITY */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" /> Change Account Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure your account uses a strong password with letters, numbers, and symbols.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-lg">
            <Input
              label="Current Password *"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="New Password *"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
            <Input
              label="Confirm New Password *"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={passwordLoading}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
              >
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 🚫 REJECT EMAIL CHANGE MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Email Change Request"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to reject the email change request for{' '}
            <strong>{selectedReviewRequest?.user?.name}</strong> to{' '}
            <strong className="font-mono text-brand-600">{selectedReviewRequest?.newEmail}</strong>?
          </p>

          <Input
            label="Rejection Reason (will be notified to staff)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Please use official @asadlandholdings.com email address"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={reviewingAction}
              onClick={() => handleReviewRequest(selectedReviewRequest?.id, 'REJECT', rejectionReason)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              {reviewingAction ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
