'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Lock, Sparkles, Copy, Check, Eye, EyeOff, ShieldAlert, Loader2 } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  } | null;
  onSuccess?: () => void;
}

export function ResetPasswordModal({ isOpen, onClose, user, onSuccess }: ResetPasswordModalProps) {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successResult, setSuccessResult] = useState<{ password: string } | null>(null);

  // Generate strong initial password when modal opens
  useEffect(() => {
    if (isOpen && user) {
      handleGeneratePassword();
      setSuccessResult(null);
      setCopied(false);
    }
  }, [isOpen, user]);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generated = `Alh@${randomPart}!${Math.floor(10 + Math.random() * 90)}`;
    setNewPassword(generated);
    setCopied(false);
  };

  const handleCopy = () => {
    const textToCopy = successResult?.password || newPassword;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast('Password Copied', 'Copied to clipboard. You can now send this to the agent.', 'info');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newPassword || newPassword.length < 6) {
      toast('Invalid Password', 'Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast('Password Reset Successfully', data.message, 'success');
        setSuccessResult({ password: data.newPassword || newPassword });
        if (onSuccess) onSuccess();
      } else {
        toast('Reset Failed', data.error || 'Failed to update agent password.', 'error');
      }
    } catch (err) {
      toast('Network Error', 'Could not reach authentication server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Agent Password"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* User identification header card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          {user.role && (
            <Badge variant="purple" className="text-[10px] uppercase font-semibold">
              {user.role.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {successResult ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Password Successfully Reset & Account Activated
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                The agent can now immediately log in with this permanent password. Their account status has been set to <strong>ACTIVE</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">New Active Password</div>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 select-all">
                  {successResult.password}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={onClose} className="w-full bg-brand-600 hover:bg-brand-500 text-white">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" /> Generate Strong Password
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter or generate password"
                  required
                  disabled={loading}
                  className="font-mono text-sm pr-16"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy password"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                Resetting will immediately activate this account and remove any expiration locks or previous token restrictions.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-500 text-white gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Set Password & Activate
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
