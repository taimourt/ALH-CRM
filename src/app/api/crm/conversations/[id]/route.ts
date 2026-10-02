import { NextResponse } from 'next/server';
import { getConversationById, toggleHandoffMode, HandoffMode } from '@/lib/ai/conversation-gateway';
import { logAuditEntry } from '@/lib/ai/audit-logger';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = getConversationById(id);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { mode, agentReplyText, agentName } = body;

    const conversation = getConversationById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Handle Mode Toggle
    if (mode && (mode === 'AI' || mode === 'HUMAN')) {
      toggleHandoffMode(id, mode as HandoffMode);
    }

    // Handle Human Agent Reply
    if (agentReplyText && typeof agentReplyText === 'string') {
      const agentMsg = {
        id: `msg-agent-${Date.now()}`,
        sender: 'AGENT' as const,
        text: agentReplyText,
        timestamp: new Date().toISOString(),
      };
      conversation.messages.push(agentMsg);
      conversation.lastMessageText = agentReplyText;
      conversation.lastActivity = new Date().toISOString();
      conversation.assignedAgentName = agentName || conversation.assignedAgentName || 'Asad Ali';

      logAuditEntry({
        actor: 'HUMAN_AGENT',
        action: 'agent_sent_reply',
        conversationId: id,
        details: { agentName: conversation.assignedAgentName, text: agentReplyText },
      });
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}
