import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        property: { include: { society: true } },
        lead: true,
        customer: true,
        agent: true,
        manager: true,
        payments: { orderBy: { createdAt: 'desc' } },
        installments: { orderBy: { installmentNumber: 'asc' } },
        commissions: true,
        siteVisits: { include: { agent: true, property: true }, orderBy: { scheduledAt: 'desc' } },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Fetch activity logs for this deal
    const activityLogs = await prisma.activityLog.findMany({
      where: { entityType: 'DEAL', entityId: params.id },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ...deal, activityLogs });
  } catch (error) {
    console.error('Get deal by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch deal record' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const currentDeal = await prisma.deal.findUnique({ where: { id: params.id } });
    if (!currentDeal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const updatedDeal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...(body.stage ? { stage: body.stage } : {}),
        ...(body.tokenAmount !== undefined ? { tokenAmount: parseFloat(body.tokenAmount) } : {}),
        ...(body.amount ? { amount: parseFloat(body.amount) } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.expectedClosingDate ? { expectedClosingDate: new Date(body.expectedClosingDate) } : {}),
        ...(body.documents ? { documents: JSON.stringify(body.documents) } : {}),
      },
      include: {
        property: { include: { society: true } },
        lead: true,
        customer: true,
        agent: true,
        manager: true,
      },
    });

    // Log Activity if stage updated
    if (body.stage && body.stage !== currentDeal.stage) {
      await prisma.activityLog.create({
        data: {
          entityType: 'DEAL',
          entityId: params.id,
          action: 'STAGE_CHANGED',
          description: `Deal stage updated from ${currentDeal.stage} to ${body.stage}.`,
          userId: body.userId || currentDeal.agentId,
        },
      });

      // Dispatch Notification
      await createCRMNotification({
        userIds: [currentDeal.agentId, currentDeal.managerId],
        notifyManagement: true,
        title: `🎯 Deal Stage: ${body.stage.replace(/_/g, ' ')}`,
        message: `Deal "${updatedDeal.title}" moved to ${body.stage.replace(/_/g, ' ')}.`,
        type: 'DEAL',
        link: '/deals',
      });
    }

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error('Update deal error:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}
