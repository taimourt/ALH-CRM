import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');
  const leadId = searchParams.get('leadId');

  try {
    const whereConditions: any = {};
    if (channel && channel !== 'ALL') {
      whereConditions.channel = channel;
    }
    if (leadId && leadId !== 'ALL') {
      whereConditions.leadId = leadId;
    }

    const comms = await prisma.communication.findMany({
      where: whereConditions,
      include: {
        lead: true,
        customer: true,
        agent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comms);
  } catch (error) {
    console.error('Communications API error:', error);
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, channel, direction, summary, messageText, leadId, customerId, agentId, phone } = body;

    let deliveryStatus = 'SENT';

    // If WhatsApp channel, trigger integration
    if (channel === 'WHATSAPP' && phone) {
      const waRes = await sendWhatsAppMessage({ toPhone: phone, messageText: messageText || summary });
      deliveryStatus = waRes.status;
    }

    const newComm = await prisma.communication.create({
      data: {
        type: type || channel || 'WHATSAPP',
        channel: channel || 'WHATSAPP',
        direction: direction || 'OUTBOUND',
        summary: summary || messageText || 'Outbound message',
        messageText: messageText || summary,
        status: deliveryStatus,
        leadId: leadId || null,
        customerId: customerId || null,
        agentId: agentId || 'system',
      },
      include: {
        lead: true,
        customer: true,
        agent: true,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        entityType: 'COMMUNICATION',
        entityId: newComm.id,
        action: `${channel}_MESSAGE_SENT`,
        description: `Sent ${channel} message to ${phone || 'client'}: "${(summary || '').substring(0, 40)}..."`,
        userId: agentId || null,
      },
    });

    // Dispatch Notification to Agent and Management
    await createCRMNotification({
      userIds: agentId ? [agentId] : [],
      notifyManagement: true,
      title: `💬 ${channel || 'Message'} Logged`,
      message: `${channel} with ${newComm.lead?.name || newComm.customer?.name || phone || 'Client'}: "${(summary || messageText || '').substring(0, 50)}"`,
      type: 'COMMUNICATION',
      link: '/communications',
    });

    return NextResponse.json(newComm);
  } catch (error) {
    console.error('Create communication error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
