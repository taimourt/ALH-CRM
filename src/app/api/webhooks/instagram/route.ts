import { NextResponse } from 'next/server';
import { processIncomingChannelMessage } from '@/lib/ai/conversation-gateway';

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'asad_land_holdings_meta_verify_2026';

// Instagram Webhook Verification Endpoint (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      console.log('[Instagram Webhook] Verification successful');
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden: Verification token mismatch', { status: 403 });
  }

  return new Response('Bad Request', { status: 400 });
}

// Instagram Inbound Messages Handler (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        const webhookEvent = entry.messaging?.[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          const senderId = webhookEvent.sender?.id;
          const messageText = webhookEvent.message.text;

          console.log(`[Instagram DM] Inbound message from ${senderId}: "${messageText}"`);

          // Process via Gateway
          const conversation = await processIncomingChannelMessage({
            channel: 'INSTAGRAM',
            senderId: senderId || `ig-${Date.now()}`,
            senderName: `@ig_user_${senderId?.slice(-4) || 'client'}`,
            text: messageText,
          });

          console.log(`[Instagram DM] Gateway response for ${conversation.id}:`, conversation.lastMessageText);
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Not an instagram event' }, { status: 404 });
  } catch (error) {
    console.error('Error in /api/webhooks/instagram:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
