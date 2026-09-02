import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage');
  const agentId = searchParams.get('agentId');
  const q = searchParams.get('q') || '';

  try {
    const user = await getCurrentUser();
    const isAgentOnly = user?.role === 'SALES_AGENT' || user?.role === 'AGENT';

    const whereConditions: any = {};
    if (stage && stage !== 'ALL') whereConditions.stage = stage;
    if (isAgentOnly && user) {
      whereConditions.agentId = user.id;
    } else if (agentId && agentId !== 'ALL') {
      whereConditions.agentId = agentId;
    }
    if (q) {
      whereConditions.OR = [
        { title: { contains: q } },
        { sellerName: { contains: q } },
        { lead: { name: { contains: q } } },
        { customer: { name: { contains: q } } },
      ];
    }

    const deals = await prisma.deal.findMany({
      where: whereConditions,
      include: {
        property: { include: { society: true } },
        lead: true,
        customer: true,
        agent: true,
        manager: true,
        payments: true,
        installments: true,
        commissions: true,
        siteVisits: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Deals API error:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newDeal = await prisma.deal.create({
      data: {
        title: body.title,
        leadId: body.leadId || null,
        customerId: body.customerId || null,
        propertyId: body.propertyId,
        agentId: body.agentId,
        managerId: body.managerId || null,
        sellerName: body.sellerName || null,
        sellerPhone: body.sellerPhone || null,
        amount: parseFloat(body.amount) || 1000000,
        tokenAmount: parseFloat(body.tokenAmount) || 0,
        stage: body.stage || 'LEAD',
        agreedCommission: parseFloat(body.agreedCommission) || 1.0,
        expectedClosingDate: body.expectedClosingDate ? new Date(body.expectedClosingDate) : null,
        notes: body.notes || null,
        documents: body.documents ? JSON.stringify(body.documents) : null,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        entityType: 'DEAL',
        entityId: newDeal.id,
        action: 'DEAL_CREATED',
        description: `Deal "${newDeal.title}" created with stage ${newDeal.stage}.`,
        userId: body.agentId,
      },
    });

    // Dispatch Notification to Agent and Management
    await createCRMNotification({
      userIds: [body.agentId, body.managerId],
      notifyManagement: true,
      title: '💼 New Deal Pipeline Created',
      message: `Deal "${newDeal.title}" created (PKR ${newDeal.amount?.toLocaleString()}) in stage ${newDeal.stage}.`,
      type: 'DEAL',
      link: '/deals',
    });

    return NextResponse.json(newDeal);
  } catch (error) {
    console.error('Create Deal error:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
