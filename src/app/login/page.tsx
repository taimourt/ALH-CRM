'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const inviteToken = searchParams.get('invite');

  // Standard Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Invite Flow State
  const [inviteLoading, setInviteLoading] = useState(!!inviteToken);
  const [invitedUser, setInvitedUser] = useState<any | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  // Verify invitation token on load if ?invite= is present
  useEffect(() => {
    if (inviteToken) {
      async function verifyToken() {
        setInviteLoading(true);
        setInviteError(null);
        try {
          const res = await fetch(`/api/auth/accept-invite?token=${encodeURIComponent(inviteToken || '')}`);
          const data = await res.json();

          if (res.ok && data.valid) {
            setInvitedUser(data.user);
          } else {
            setInviteError(data.error || 'This invitation link is invalid or has expired.');
          }
        } catch (err) {
          setInviteError('Could not verify invitation token. Please check your network connection.');
        } finally {
          setInviteLoading(false);
        }
      }
      verifyToken();
    }
  }, [inviteToken]);

  // Handle Standard Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_email', data.user.email);
      if (data.user.avatar) localStorage.setItem('user_avatar', data.user.avatar);

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage('Unable to connect to the authentication server. Please try again.');
      setLoading(false);
    }
  };

  // Handle Accept Invitation & Set Password
  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: inviteToken,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to activate account.');
        setLoading(false);
        return;
      }

      setAcceptSuccess(true);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_email', data.user.email);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMessage('Failed to activate account. Please try again.');
      setLoading(false);
    }
  };

  // 1. INVITATION FLOW: Verify Loading Screen
  if (inviteToken && inviteLoading) {
    return (
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-4 backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-100">Verifying Invitation Link...</h2>
        <p className="text-xs text-slate-400">Please wait while we validate your staff account credentials.</p>
      </Card>
    );
  }

  // 2. INVITATION FLOW: Invalid / Expired Token Error Screen
  if (inviteToken && inviteError) {
    return (
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-5 backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-100">Invitation Expired or Invalid</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{inviteError}</p>
        <div className="pt-2">
          <Link href="/login">
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
              Return to Standard Login
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // 3. INVITATION FLOW: Set Password & Activate Screen
  if (inviteToken && invitedUser) {
    return (
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-5 backdrop-blur-xl">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
            ALH
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-100">
            Welcome to Asad Land Holdings!
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <UserCheck className="w-3.5 h-3.5" /> Staff Account Activation
          </div>
        </div>

        {/* Invited User Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
          <div className="text-slate-400 text-[11px]">Account invited for:</div>
          <div className="font-bold text-slate-100 text-sm">{invitedUser.name}</div>
          <div className="text-emerald-400 font-mono text-[11px]">{invitedUser.email}</div>
          <div className="pt-1 flex items-center gap-2">
            <Badge variant="purple" className="text-[10px] uppercase font-bold">
              {invitedUser.role?.replace('_', ' ')}
            </Badge>
            <span className="text-[11px] text-slate-400">{invitedUser.jobTitle || 'Team Member'}</span>
          </div>
        </div>

        {/* Success message */}
        {acceptSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs text-center space-y-2 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-sm">Account Activated Successfully!</div>
            <p className="text-[11px] text-emerald-400">Logging you in and redirecting to your Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Set New Password *</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                  className="bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 text-xs pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Confirm Password *</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                className="bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <span>Activate Account &amp; Access CRM</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </Card>
    );
  }

  // 4. STANDARD LOGIN SCREEN
  return (
    <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-6 backdrop-blur-xl">
      {/* Logo & Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
          ALH
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          ASAD LAND HOLDINGS
        </h1>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Staff &amp; Admin Portal
        </div>
        <p className="text-xs text-slate-400 pt-1">
          Real Estate Operating System • Sign in with your registered account
        </p>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <Input
            type="email"
            placeholder="name@asadlandholdings.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            className="bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 text-xs"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              className="bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 text-xs pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Remember device</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 gap-2 shadow-lg shadow-emerald-950 transition-all"
        >
          <span>Sign In to CRM</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-white text-xs">Loading Secure Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
