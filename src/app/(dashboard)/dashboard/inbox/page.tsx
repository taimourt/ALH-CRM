'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  UserCheck, 
  Bot, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  Globe, 
  Smartphone,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI' | 'AGENT' | 'SYSTEM';
  text: string;
  timestamp: string;
}

interface ExtractedRequirement {
  intent?: string;
  society?: string;
  size?: string;
  budgetMax?: number;
  purpose?: string;
  timeline?: string;
  propertyType?: string;
}

interface LeadScoreResult {
  score: number;
  scoreReason: string;
  recommendedAction: string;
}

interface OmnichannelConversation {
  id: string;
  channel: 'WEBSITE' | 'MESSENGER' | 'INSTAGRAM' | 'WHATSAPP';
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  psid?: string;
  assignedAgentName?: string;
  mode: 'AI' | 'HUMAN';
  lastActivity: string;
  lastMessageText: string;
  messagingWindowEligible: boolean;
  extractedRequirement?: ExtractedRequirement;
  leadScore?: LeadScoreResult;
  aiSummary?: string;
  messages: ChatMessage[];
}

export default function OmnichannelInboxPage() {
  const [activeChannel, setActiveChannel] = useState<string>('ALL');
  const [conversations, setConversations] = useState<OmnichannelConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agentInput, setAgentInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch Conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/conversations?channel=${activeChannel}`);
      const data = await res.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !selectedConvId) {
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [activeChannel]);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  // Toggle AI / HUMAN Mode
  const handleToggleMode = async (newMode: 'AI' | 'HUMAN') => {
    if (!selectedConv) return;
    try {
      const res = await fetch(`/api/crm/conversations/${selectedConv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      });
      const data = await res.json();
      if (data.success && data.conversation) {
        setConversations(prev =>
          prev.map(c => (c.id === selectedConv.id ? data.conversation : c))
        );
      }
    } catch (err) {
      console.error('Error toggling handoff mode', err);
    }
  };

  // Send Human Agent Reply
  const handleSendAgentReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim() || !selectedConv || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/crm/conversations/${selectedConv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentReplyText: agentInput,
          agentName: 'Asad Ali',
          mode: 'HUMAN', // Auto switch to human mode on manual reply
        }),
      });
      const data = await res.json();
      if (data.success && data.conversation) {
        setConversations(prev =>
          prev.map(c => (c.id === selectedConv.id ? data.conversation : c))
        );
        setAgentInput('');
      }
    } catch (err) {
      console.error('Error sending agent reply', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper channel icon & style badge
  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'WEBSITE':
        return <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300"><Globe className="w-3 h-3" /> Web Chat</span>;
      case 'WHATSAPP':
        return <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 border border-zinc-900 bg-zinc-900 text-white rounded"><Smartphone className="w-3 h-3" /> WhatsApp</span>;
      case 'MESSENGER':
        return <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 border border-zinc-400 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded"><MessageSquare className="w-3 h-3" /> Messenger</span>;
      case 'INSTAGRAM':
        return <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 border border-zinc-400 text-zinc-900 dark:text-zinc-100 rounded"><User className="w-3 h-3" /> Instagram</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      
      {/* Top Header / Channel Bar */}
      <header className="px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
              Omnichannel CRM Inbox
            </h1>
            <span className="text-xs font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 border border-zinc-300 dark:border-zinc-700">
              Live Gateway Active
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Website Chat • WhatsApp Cloud API • Meta Messenger • Instagram DM
          </p>
        </div>

        {/* Channel Selection Pills */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
          {['ALL', 'WEBSITE', 'WHATSAPP', 'MESSENGER', 'INSTAGRAM'].map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 text-xs font-mono transition-all ${
                activeChannel === ch
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </header>

      {/* 3-Pane Main Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANE: Conversation List */}
        <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Inbound Queue ({conversations.length})</span>
            <button onClick={fetchConversations} className="text-xs text-zinc-600 hover:underline">Refresh</button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading channels...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">No active conversations on this channel.</div>
          ) : (
            conversations.map(conv => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-4 border-b border-zinc-100 dark:border-zinc-800/60 transition-all ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 border-l-4 border-l-zinc-900 dark:border-l-zinc-100'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                      {conv.customerName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(conv.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    {getChannelBadge(conv.channel)}
                    
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                      conv.mode === 'HUMAN' 
                        ? 'border-zinc-900 bg-zinc-900 text-white font-bold' 
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {conv.mode === 'HUMAN' ? '👤 HUMAN' : '🤖 AI ACTIVE'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">
                    {conv.lastMessageText}
                  </p>

                  {conv.leadScore && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-900 dark:bg-zinc-100" 
                          style={{ width: `${conv.leadScore.score}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                        {conv.leadScore.score} pts
                      </span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* MIDDLE PANE: Chat Conversation & Controls */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col bg-zinc-100/50 dark:bg-zinc-950 overflow-hidden">
            
            {/* Conversation Header & Handoff Switch */}
            <div className="px-6 py-3.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-mono font-bold flex items-center justify-center text-sm">
                  {selectedConv.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {selectedConv.customerName}
                    </h2>
                    {getChannelBadge(selectedConv.channel)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {selectedConv.customerPhone && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedConv.customerPhone}</span>
                    )}
                    {selectedConv.psid && (
                      <span className="font-mono text-[11px]">ID: {selectedConv.psid}</span>
                    )}
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3 text-zinc-700" /> Agent: {selectedConv.assignedAgentName || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Mode Control & Messaging Window Badge */}
              <div className="flex items-center gap-3">
                {selectedConv.messagingWindowEligible && (
                  <span className="text-[11px] font-mono border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 24h Meta Window Active
                  </span>
                )}

                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 p-0.5 bg-zinc-50 dark:bg-zinc-800">
                  <button
                    onClick={() => handleToggleMode('AI')}
                    className={`px-3 py-1 text-xs font-mono transition-all flex items-center gap-1.5 ${
                      selectedConv.mode === 'AI'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" /> AI Mode
                  </button>
                  <button
                    onClick={() => handleToggleMode('HUMAN')}
                    className={`px-3 py-1 text-xs font-mono transition-all flex items-center gap-1.5 ${
                      selectedConv.mode === 'HUMAN'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Human Takeover
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {selectedConv.messages.map((msg) => {
                const isUser = msg.sender === 'USER';
                const isAI = msg.sender === 'AI';
                const isAgent = msg.sender === 'AGENT';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mb-1 px-1">
                      {isUser && <span>Customer</span>}
                      {isAI && <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300"><Bot className="w-3 h-3" /> Asad AI Advisor</span>}
                      {isAgent && <span className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100"><User className="w-3 h-3" /> Agent ({selectedConv.assignedAgentName || 'Asad Ali'})</span>}
                      <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-lg p-4 text-sm leading-relaxed border ${
                        isUser
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-sans'
                          : isAI
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 border-zinc-300 dark:border-zinc-700 font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Agent Input Reply Form */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
              {selectedConv.mode === 'AI' && (
                <div className="mb-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" /> AI is actively responding to customer messages. Sending a manual message will switch to Human Mode.</span>
                  <button 
                    onClick={() => handleToggleMode('HUMAN')} 
                    className="underline text-zinc-900 dark:text-zinc-100 font-bold"
                  >
                    Switch to Human Now
                  </button>
                </div>
              )}

              <form onSubmit={handleSendAgentReply} className="flex gap-2">
                <input
                  type="text"
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  placeholder={
                    selectedConv.mode === 'HUMAN'
                      ? 'Type human agent response (WhatsApp / Web / Meta)...'
                      : 'Type manual response to take over...'
                  }
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !agentInput.trim()}
                  className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-6 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all font-mono"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-400 font-mono text-xs">
            Select a conversation to view chat details
          </div>
        )}

        {/* RIGHT PANE: Customer Lead Card & AI Insights */}
        {selectedConv && (
          <div className="w-88 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-y-auto flex flex-col gap-6">
            
            {/* AI Lead Score Card */}
            {selectedConv.leadScore ? (
              <div className="p-4 border border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Lead Score
                  </span>
                  <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    {selectedConv.leadScore.score}/100
                  </span>
                </div>

                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 mb-3">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100"
                    style={{ width: `${selectedConv.leadScore.score}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-200">Score Logic:</strong> {selectedConv.leadScore.scoreReason}
                </p>

                <div className="p-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-mono">
                  <strong>Action:</strong> {selectedConv.leadScore.recommendedAction}
                </div>
              </div>
            ) : (
              <div className="p-4 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400">
                AI lead scoring in progress...
              </div>
            )}

            {/* Extracted Customer Requirement */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1">
                Extracted Requirement
              </h3>

              {selectedConv.extractedRequirement ? (
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Intent</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedConv.extractedRequirement.intent || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Target Society</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedConv.extractedRequirement.society || 'Any / Unspecified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Plot / Unit Size</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedConv.extractedRequirement.size || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Budget Max</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedConv.extractedRequirement.budgetMax 
                        ? `PKR ${(selectedConv.extractedRequirement.budgetMax / 100000).toFixed(0)} Lakhs` 
                        : 'Unspecified'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Purpose</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedConv.extractedRequirement.purpose || 'Investment / Build'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400">Purchase Timeline</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedConv.extractedRequirement.timeline || 'Immediate'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 font-mono">No requirement extracted yet.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1">
                CRM Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-xs font-mono border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all flex items-center justify-between">
                  <span>Schedule Site Visit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-full text-left px-3 py-2 text-xs font-mono border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all flex items-center justify-between">
                  <span>Assign to Senior Advisor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-full text-left px-3 py-2 text-xs font-mono border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all flex items-center justify-between">
                  <span>Export Conversation Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
