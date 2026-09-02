'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import {
  Mail,
  Copy,
  ExternalLink,
  Check,
  RefreshCw,
  Send,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Info,
} from 'lucide-react';

export interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  invitationLink: string;
  roleName?: string;
  onResend?: () => void;
}

export function InvitationModal({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  invitationLink,
  roleName = 'Sales Agent',
  onResend,
}: InvitationModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    toast('Link Copied', 'Invitation link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleResendAction = async () => {
    if (onResend) {
      setResending(true);
      await onResend();
      setResending(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Assalam-o-Alaikum ${recipientName},\n\nAapka Asad Land Holdings CRM staff account (${roleName}) create ho gaya hai. Barah-e-karam is link par click kar ke apna password set karein:\n\n${invitationLink}`
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Account Created & Invitation Link Generated" maxWidth="md">
      <div className="space-y-4 text-xs">
        {/* Success Alert Banner */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Created Successfully
          </div>
          <p className="text-[11px]">
            Staff account for <strong>{recipientName}</strong> ({recipientEmail}) has been set up as a <strong>{roleName}</strong>.
          </p>
        </div>

        {/* Direct Link Section */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Direct Single-Use Invitation Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={invitationLink}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200 select-all"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="bg-brand-600 hover:bg-brand-500 text-white gap-1 shrink-0 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </div>
        </div>

        {/* Instant WhatsApp Share Button */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Share On WhatsApp
          </a>

          <a
            href={invitationLink}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open Setup Page
          </a>
        </div>

        {/* Resend Domain Notice */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-[11px]">
            <Info className="w-3.5 h-3.5 text-brand-600" /> Automated Email Delivery Note
          </div>
          <p className="text-[11px] leading-relaxed">
            Agar automated email deliver na ho rahi ho, to Resend ke free testing sandbox ki wajah se aapka custom domain verify hona zaroori hai. Aap upar diya gaya Direct Link foran agent ko WhatsApp kar sakte hain.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {onResend ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendAction}
              disabled={resending}
              className="gap-1 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} /> Resend Email
            </Button>
          ) : <div />}

          <Button size="sm" onClick={onClose} className="bg-brand-600 hover:bg-brand-500 text-white font-semibold">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
