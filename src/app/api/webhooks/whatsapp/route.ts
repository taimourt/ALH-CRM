import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

// GET: Meta Webhook Verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'asad_crm_whatsapp_verify_token_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST: Incoming Webhook Event
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const fromPhone = message.from;
      const textBody = message.text?.body || 'Inbound media message';

      // Find matching lead or customer by phone
      const lead = await prisma.lead.findFirst({
        where: { phone: { contains: fromPhone.slice(-10) } },
      });

      const comm = await prisma.communication.create({
        data: {
          type: 'WHATSAPP',
          channel: 'WHATSAPP',
          direction: 'INBOUND',
          summary: `Inbound WhatsApp from +${fromPhone}`,
          messageText: textBody,
          status: 'READ',
          leadId: lead?.id || null,
          agentId: lead?.assignedAgentId || 'system',
        },
      });

      // Dispatch Notification to Agent and Management
      await createCRMNotification({
        userIds: lead?.assignedAgentId ? [lead.assignedAgentId] : [],
        notifyManagement: true,
        title: `💬 Inbound WhatsApp: ${lead?.name || `+${fromPhone}`}`,
        message: textBody.substring(0, 70),
        type: 'COMMUNICATION',
        link: '/communications',
      });

      console.log('[WHATSAPP WEBHOOK] Logged inbound message:', comm.id);
    }

    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  } catch (error) {
    console.error('WhatsApp Webhook error:', error);
    return NextResponse.json({ status: 'ERROR' }, { status: 500 });
  }
}
