'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4 relative">
      <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900/90 text-white shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold">Reset Your Password</h1>
          <p className="text-xs text-slate-400">
            Enter your registered staff email address to receive password reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-semibold text-emerald-200">Reset Link Sent!</div>
            <p className="text-slate-300">
              We have dispatched a password reset link to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link href="/reset-password">
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-2">
                Proceed to Reset Password →
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Staff Email Address"
              type="email"
              placeholder="e.g. hamza@asadlandholdings.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white">
              Send Reset Link
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
