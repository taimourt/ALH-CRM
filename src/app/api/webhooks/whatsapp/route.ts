import { NextResponse } from 'next/server';
import { processIncomingChannelMessage } from '@/lib/ai/conversation-gateway';

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'asad_land_holdings_wa_verify_2026';

// WhatsApp Cloud API Webhook Verification Endpoint (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('[WhatsApp Webhook] Verification successful');
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden: Verification token mismatch', { status: 403 });
  }

  return new Response('Bad Request', { status: 400 });
}

// WhatsApp Inbound Message Handler (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value && value.messages && value.messages.length > 0) {
      const message = value.messages[0];
      const contact = value.contacts?.[0];

      if (message.type === 'text' && message.text?.body) {
        const fromPhone = message.from; // Phone number e.g. "923005123456"
        const formattedPhone = fromPhone.startsWith('+') ? fromPhone : `+${fromPhone}`;
        const senderName = contact?.profile?.name || formattedPhone;
        const textBody = message.text.body;

        console.log(`[WhatsApp API] Inbound from ${formattedPhone} (${senderName}): "${textBody}"`);

        const conversation = await processIncomingChannelMessage({
          channel: 'WHATSAPP',
          senderId: formattedPhone,
          phone: formattedPhone,
          senderName,
          text: textBody,
        });

        console.log(`[WhatsApp API] Gateway response for ${conversation.id}:`, conversation.lastMessageText);
      }

      return NextResponse.json({ status: 'SUCCESS' }, { status: 200 });
    }

    // Handles message status updates (e.g. delivered, read) silently
    return NextResponse.json({ status: 'EVENT_IGNORED' }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/webhooks/whatsapp:', error);
    return NextResponse.json({ error: 'WhatsApp Webhook processing failed' }, { status: 500 });
  }
}
