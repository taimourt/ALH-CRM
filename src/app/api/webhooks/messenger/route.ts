import { NextResponse } from 'next/server';
import { processIncomingChannelMessage } from '@/lib/ai/conversation-gateway';

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'asad_land_holdings_meta_verify_2026';

// Meta Webhook Verification Endpoint (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      console.log('[Meta Webhook] Messenger verification successful');
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden: Verification token mismatch', { status: 403 });
  }

  return new Response('Bad Request', { status: 400 });
}

// Meta Messenger Inbound Messages Handler (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        const webhookEvent = entry.messaging?.[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          const senderId = webhookEvent.sender?.id;
          const messageText = webhookEvent.message.text;

          console.log(`[Meta Messenger] Inbound message from PSID ${senderId}: "${messageText}"`);

          // Process via Gateway
          const conversation = await processIncomingChannelMessage({
            channel: 'MESSENGER',
            senderId: senderId || `messenger-${Date.now()}`,
            senderName: `FB User (${senderId?.slice(-4) || 'Anon'})`,
            text: messageText,
          });

          console.log(`[Meta Messenger] Gateway response for ${conversation.id}:`, conversation.lastMessageText);
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Not a page event' }, { status: 404 });
  } catch (error) {
    console.error('Error in /api/webhooks/messenger:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
