import { NextResponse } from 'next/server';
import { processIncomingChannelMessage } from '@/lib/ai/conversation-gateway';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, senderId, senderName, phone } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const conversation = await processIncomingChannelMessage({
      channel: 'WEBSITE',
      senderId: senderId || `web-${Date.now()}`,
      senderName: senderName || 'Website Visitor',
      phone: phone || undefined,
      text: message,
    });

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: lastMessage ? lastMessage.text : '',
      conversation,
    });
  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    return NextResponse.json(
      { error: 'Failed to process AI chat message' },
      { status: 500 }
    );
  }
}
