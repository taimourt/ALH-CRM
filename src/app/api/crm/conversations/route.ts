import { NextResponse } from 'next/server';
import { getOmnichannelConversations } from '@/lib/ai/conversation-gateway';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get('channel') || 'ALL';

    const conversations = getOmnichannelConversations(channel);

    return NextResponse.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error('Error fetching CRM conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
