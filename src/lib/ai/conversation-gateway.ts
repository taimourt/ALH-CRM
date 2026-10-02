import { ChatMessage, processAsadAIConversation } from './asad-ai';
import { ExtractedRequirement, LeadScoreResult } from './lead-extractor';
import { logAuditEntry } from './audit-logger';

export type ChannelType = 'WEBSITE' | 'MESSENGER' | 'INSTAGRAM' | 'WHATSAPP';
export type HandoffMode = 'AI' | 'HUMAN';

export interface OmnichannelConversation {
  id: string;
  channel: ChannelType;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  psid?: string; // Meta Messenger Page-Scoped ID or Instagram ID
  assignedAgentId?: string;
  assignedAgentName?: string;
  mode: HandoffMode;
  lastActivity: string;
  lastMessageText: string;
  messagingWindowEligible: boolean; // Server-side Meta 24-hour window check
  extractedRequirement?: ExtractedRequirement;
  leadScore?: LeadScoreResult;
  aiSummary?: string;
  messages: ChatMessage[];
}

// In-Memory Repository for Omnichannel Conversations (Seed Mock Dataset)
let conversationsStore: OmnichannelConversation[] = [
  {
    id: 'conv-web-101',
    channel: 'WEBSITE',
    customerName: 'Ch. Muhammad Akram',
    customerPhone: '+92 300 5123456',
    customerEmail: 'akram@example.com',
    assignedAgentName: 'Asad Ali',
    mode: 'AI',
    lastActivity: '2026-09-17T21:45:00Z',
    lastMessageText: 'bhai 10 marla plot chahiye faisal hills mein 80 lakh tak',
    messagingWindowEligible: true,
    extractedRequirement: {
      intent: 'BUY',
      society: 'Faisal Hills',
      size: '10 Marla',
      budgetMax: 8000000,
      purpose: 'INVESTMENT',
      timeline: '1_3_MONTHS',
    },
    leadScore: {
      score: 85,
      scoreReason: 'Specified Target Society (Faisal Hills) • Specified Plot Size (10 Marla) • Realistic Budget Defined (PKR 80 Lakhs)',
      recommendedAction: 'HIGH PRIORITY: Direct Call from Principal Advisor Asad Ali & Send WhatsApp Deed',
    },
    aiSummary: 'Customer inquiring for 10 Marla plot in Faisal Hills within PKR 80 Lakhs for investment.',
    messages: [
      {
        id: 'msg-1',
        sender: 'USER',
        text: 'bhai 10 marla plot chahiye faisal hills mein 80 lakh tak',
        timestamp: '2026-09-17T21:44:30Z',
      },
      {
        id: 'msg-2',
        sender: 'AI',
        text: 'Bilkul! Faisal Hills mein 10 Marla plot demand PKR 80 Lakh tak verified available hai. Aap investment ke liye lena chah rahe hain ya construction ke liye?',
        timestamp: '2026-09-17T21:45:00Z',
      },
    ],
  },
  {
    id: 'conv-wa-102',
    channel: 'WHATSAPP',
    customerName: 'Dr. Tariq Mahmood',
    customerPhone: '+92 301 9876543',
    assignedAgentName: 'Engr. Hammad Khan',
    mode: 'HUMAN',
    lastActivity: '2026-09-17T20:10:00Z',
    lastMessageText: 'Can you send turnkey villa blueprints for Kohistan Enclave?',
    messagingWindowEligible: true,
    extractedRequirement: {
      intent: 'BUY',
      society: 'Kohistan Enclave',
      propertyType: 'HOUSE_VILLA',
      purpose: 'RESIDENCE',
      timeline: 'IMMEDIATE',
    },
    leadScore: {
      score: 90,
      scoreReason: 'Immediate Purchase / Build Timeline • Turnkey Villa Inspection',
      recommendedAction: 'HUMAN TAKEOVER ACTIVE: Assigned to Engr. Hammad Khan',
    },
    aiSummary: 'Client requested turnkey villa blueprints and construction engineering consultation for Kohistan Enclave.',
    messages: [
      {
        id: 'msg-3',
        sender: 'USER',
        text: 'Can you send turnkey villa blueprints for Kohistan Enclave?',
        timestamp: '2026-09-17T20:10:00Z',
      },
    ],
  },
  {
    id: 'conv-[#fb-103]',
    channel: 'MESSENGER',
    customerName: 'Zainab Bibi',
    psid: 'fb-user-884123',
    mode: 'AI',
    lastActivity: '2026-09-17T19:30:00Z',
    lastMessageText: 'Faisal Hills ka rate bata dein',
    messagingWindowEligible: true,
    extractedRequirement: {
      society: 'Faisal Hills',
      intent: 'GENERAL_INQUIRY',
    },
    leadScore: {
      score: 45,
      scoreReason: 'Specified Target Society (Faisal Hills)',
      recommendedAction: 'Medium Priority: Send Price List',
    },
    aiSummary: 'FB Messenger user inquiring about Faisal Hills plot rates.',
    messages: [
      {
        id: 'msg-4',
        sender: 'USER',
        text: 'Faisal Hills ka rate bata dein',
        timestamp: '2026-09-17T19:30:00Z',
      },
    ],
  },
];

export function getOmnichannelConversations(channelFilter?: string): OmnichannelConversation[] {
  if (!channelFilter || channelFilter === 'ALL') {
    return conversationsStore;
  }
  return conversationsStore.filter(c => c.channel === channelFilter);
}

export function getConversationById(id: string): OmnichannelConversation | null {
  return conversationsStore.find(c => c.id === id) || null;
}

export function toggleHandoffMode(id: string, mode: HandoffMode): OmnichannelConversation | null {
  const conv = conversationsStore.find(c => c.id === id);
  if (conv) {
    conv.mode = mode;
    logAuditEntry({
      actor: 'HUMAN_AGENT',
      action: 'toggle_handoff_mode',
      conversationId: id,
      details: { newMode: mode },
    });
  }
  return conv || null;
}

export async function processIncomingChannelMessage(params: {
  channel: ChannelType;
  senderId: string;
  senderName?: string;
  text: string;
  phone?: string;
}): Promise<OmnichannelConversation> {
  // Deduplicate contact / conversation
  let conv = conversationsStore.find(
    c => c.channel === params.channel && (c.psid === params.senderId || c.customerPhone === params.phone)
  );

  if (!conv) {
    conv = {
      id: `conv-${params.channel.toLowerCase()}-${Date.now()}`,
      channel: params.channel,
      customerName: params.senderName || params.phone || 'New Customer',
      customerPhone: params.phone,
      psid: params.senderId,
      mode: 'AI',
      lastActivity: new Date().toISOString(),
      lastMessageText: params.text,
      messagingWindowEligible: true,
      messages: [],
    };
    conversationsStore.unshift(conv);
  }

  // Append user message
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'USER',
    text: params.text,
    timestamp: new Date().toISOString(),
  };
  conv.messages.push(userMsg);
  conv.lastMessageText = params.text;
  conv.lastActivity = new Date().toISOString();

  // If in HUMAN mode, AI does NOT auto-reply
  if (conv.mode === 'HUMAN') {
    logAuditEntry({
      actor: 'SYSTEM',
      action: 'human_mode_suppressed_ai',
      conversationId: conv.id,
    });
    return conv;
  }

  // Execute Asad AI Engine
  const aiResult = await processAsadAIConversation(conv.messages, conv.id);

  const aiMsg: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    sender: 'AI',
    text: aiResult.replyText,
    timestamp: new Date().toISOString(),
  };

  conv.messages.push(aiMsg);
  if (aiResult.extractedRequirement) conv.extractedRequirement = aiResult.extractedRequirement;
  if (aiResult.leadScore) conv.leadScore = aiResult.leadScore;
  if (aiResult.handoffTriggered) conv.mode = 'HUMAN';

  return conv;
}
