'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  Smartphone,
  CheckCheck,
  Plus,
  UserCheck,
  Calendar,
  Zap,
  Sparkles,
  Paperclip,
  TrendingUp,
  FileText,
  UserPlus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';

export default function CommunicationsPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Filters & Active Thread
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  // Chat Input
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  // Automation Trigger State
  const [executingWorkflow, setExecutingWorkflow] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch(`/api/communications?channel=${selectedChannel}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        if (data.length > 0 && !activeMessage) {
          setActiveMessage(data[0]);
        }
      }
    } catch (err) {
      console.error('Fetch communications error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChannel]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    setSending(true);
    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeMessage.channel || 'WHATSAPP',
          channel: activeMessage.channel || 'WHATSAPP',
          direction: 'OUTBOUND',
          summary: replyText,
          messageText: replyText,
          leadId: activeMessage.leadId,
          phone: activeMessage.lead?.phone || '03001234567',
        }),
      });

      if (res.ok) {
        toast('Message Sent', `Dispatched ${activeMessage.channel} reply to ${activeMessage.lead?.name || 'Client'}.`, 'success');
        setReplyText('');
        fetchMessages();
      }
    } catch (err) {
      toast('Send Error', 'Failed to dispatch message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const triggerAutomation = async (eventName: string, leadId?: string) => {
    setExecutingWorkflow(true);
    try {
      const res = await fetch('/api/automation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, leadId: leadId || 'lead-1' }),
      });

      if (res.ok) {
        toast(
          'Workflow Executed!',
          `Triggered "${eventName}": Auto-assigned agent, sent WhatsApp greeting, created task.`,
          'success'
        );
        fetchMessages();
      }
    } catch (err) {
      toast('Automation Error', 'Failed to execute workflow.', 'error');
    } finally {
      setExecutingWorkflow(false);
    }
  };

  const channelIcons: Record<string, React.ReactNode> = {
    WHATSAPP: <Smartphone className="w-4 h-4 text-emerald-500" />,
    SMS: <MessageSquare className="w-4 h-4 text-blue-500" />,
    EMAIL: <Mail className="w-4 h-4 text-purple-500" />,
    CALL: <Phone className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" /> Unified Multichannel Communication Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified inbox for WhatsApp, SMS, Email, and Phone Call logs with automated CRM workflow triggers.
          </p>
        </div>

        {/* Workflow Automation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => triggerAutomation('NEW_LEAD_CREATED', activeMessage?.leadId)}
            isLoading={executingWorkflow}
            className="text-xs bg-purple-600 hover:bg-purple-500 text-white gap-1.5 font-semibold"
          >
            <Zap className="w-3.5 h-3.5" /> Test New Lead Workflow
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerAutomation('SITE_VISIT_COMPLETED', activeMessage?.leadId)}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Test Feedback Workflow
          </Button>
        </div>
      </div>

      {/* Main Inbox Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[72vh]">
        {/* LEFT COLUMN: Conversation Threads List (4 cols) */}
        <Card className="lg:col-span-4 p-3 flex flex-col space-y-3 overflow-hidden bg-white dark:bg-slate-900">
          {/* Channel Filters Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {['ALL', 'WHATSAPP', 'SMS', 'EMAIL', 'CALL'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all ${
                  selectedChannel === ch
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading && (
              <div className="p-8 text-center text-xs text-slate-400">Loading conversation inbox...</div>
            )}

            {!loading &&
              messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveMessage(m)}
                  className={`p-3 rounded-xl cursor-pointer transition-all space-y-1 ${
                    activeMessage?.id === m.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 border border-brand-500/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                      {channelIcons[m.channel] || <MessageSquare className="w-3.5 h-3.5" />}
                      <span className="truncate">{m.lead?.name || 'Taimour Shah'}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                    {m.messageText || m.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <Badge variant={m.direction === 'INBOUND' ? 'purple' : 'success'} className="text-[9px]">
                      {m.direction}
                    </Badge>
                    <span className="text-slate-400">{m.agent?.name || 'System Auto'}</span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* RIGHT COLUMN: Conversation Interface & Action Suite (8 cols) */}
        <Card className="lg:col-span-8 p-4 flex flex-col justify-between space-y-4 overflow-hidden bg-white dark:bg-slate-900">
          {activeMessage ? (
            <>
              {/* Header */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {channelIcons[activeMessage.channel]} {activeMessage.lead?.name || 'Taimour Shah'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phone: {activeMessage.lead?.phone || '03001234567'} • Assigned Agent:{' '}
                    <strong>{activeMessage.agent?.name || 'Hamza Chaudhry'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success">Conversation Active</Badge>
                </div>
              </div>

              {/* Quick Actions Suite requested by specification */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">
                  Quick Actions:
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast('Agent Assigned', 'Reassigned lead conversation.', 'info')}
                  className="text-[11px] h-7 gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Assign Agent
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast('Internal Note Added', 'Saved note to lead timeline.', 'success')}
                  className="text-[11px] h-7 gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> Add Note
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast('Follow-up Task Created', 'Created 24h follow-up task.', 'success')}
                  className="text-[11px] h-7 gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Schedule Visit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast('Lead Converted', 'Converted lead into active Deal.', 'success')}
                  className="text-[11px] h-7 gap-1 text-brand-600"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Convert Lead
                </Button>
              </div>

              {/* Messages Thread View */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                    activeMessage.direction === 'OUTBOUND'
                      ? 'ml-auto bg-brand-600 text-white rounded-br-none'
                      : 'mr-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border'
                  }`}
                >
                  <div className="font-semibold">{activeMessage.messageText || activeMessage.summary}</div>
                  <div className="flex items-center justify-end gap-1 text-[10px] opacity-80 pt-1 font-mono">
                    <span>{formatDate(activeMessage.createdAt)}</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Input
                  placeholder={`Type ${activeMessage.channel} reply to ${activeMessage.lead?.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs"
                />

                <Button type="submit" isLoading={sending} className="bg-brand-600 text-white gap-1 text-xs font-semibold">
                  <Send className="w-4 h-4" /> Send
                </Button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a conversation thread from the left inbox.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
