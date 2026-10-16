'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
      } else {
        setErrorMessage(data.error || 'Failed to dispatch password reset request.');
      }
    } catch (err: any) {
      setErrorMessage('Could not connect to authentication server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl space-y-6 relative z-10 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center mx-auto border border-brand-500/20">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Reset Staff Password</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your registered staff email address to receive password reset instructions.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {sent ? (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="font-semibold text-emerald-200 text-sm">Reset Instructions Dispatched!</div>
            <p className="text-slate-300 leading-relaxed">
              We have sent a secure password reset link to <strong>{email}</strong>. The link is valid for 24 hours.
            </p>
            {resetLink && (
              <div className="pt-2">
                <Link href={resetLink}>
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 font-medium">
                    Proceed to Reset Password Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Staff Email Address"
              type="email"
              placeholder="e.g. saif.rehman.buic@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-slate-950 border-slate-700 text-white"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
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
    </div>
  );
}
