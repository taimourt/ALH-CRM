'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(!!token);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setVerifyError('No reset token was provided in the link. Please request a new password reset link.');
      return;
    }

    async function checkToken() {
      setVerifying(true);
      setVerifyError(null);
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token || '')}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setTokenValid(true);
          setUserInfo(data.user);
        } else {
          setTokenValid(false);
          setVerifyError(data.error || 'This reset link has expired or already been consumed.');
        }
      } catch (err) {
        setTokenValid(false);
        setVerifyError('Failed to verify reset token. Please check your network connection.');
      } finally {
        setVerifying(false);
      }
    }

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (newPassword.length < 6) {
      setSubmitError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setSubmitError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setSubmitError('Network error. Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  // State 1: Verifying token
  if (verifying) {
    return (
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-4 backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-100">Validating Password Reset Link...</h2>
        <p className="text-xs text-slate-400">Please hold on while we verify your security token.</p>
      </Card>
    );
  }

  // State 2: Invalid or expired token
  if (verifyError || !tokenValid) {
    return (
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl relative z-10 space-y-5 backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-100">Reset Link Invalid or Expired</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {verifyError || 'This password reset link is invalid or has expired.'}
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <Link href="/forgot-password">
            <Button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium">
              Request New Password Reset Link
            </Button>
          </Link>
          <Link href="/login" className="block text-xs text-slate-400 hover:text-white pt-2 transition-colors">
            Return to Login
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl space-y-6 relative z-10 backdrop-blur-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center mx-auto border border-brand-500/20">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Create New Password</h1>
        <p className="text-xs text-slate-400">
          {userInfo?.name ? `Setting new password for ${userInfo.name} (${userInfo.email})` : 'Set a strong password for your staff CRM account.'}
        </p>
      </div>

      {submitError && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {done ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="font-semibold text-emerald-200 text-sm">Password Successfully Reset!</div>
          <p className="text-slate-300">Your account is active. Redirecting you to the login screen now...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="New Password (min 6 characters)"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              className="bg-slate-950 border-slate-700 text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              className="bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
              </>
            ) : (
              'Set New Password & Activate Account'
            )}
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={
        <div className="text-slate-400 text-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> Loading...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
