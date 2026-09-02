import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const method = searchParams.get('method');
  const role = searchParams.get('role') || 'SUPER_ADMIN';
  const userId = searchParams.get('userId');

  try {
    const whereConditions: any = {};
    if (status && status !== 'ALL') whereConditions.status = status;
    if (method && method !== 'ALL') whereConditions.paymentMethod = method;

    // RBAC: If Agent, only return payments for deals assigned to this agent
    if (role === 'AGENT' && userId) {
      whereConditions.deal = { agentId: userId };
    }

    const payments = await prisma.payment.findMany({
      where: whereConditions,
      include: {
        deal: { include: { agent: true } },
        customer: true,
        property: { include: { society: true } },
      },
      orderBy: { paidAt: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Auto-generate receipt number e.g. REC-2026-0091
    const count = await prisma.payment.count();
    const receiptNumber = `REC-2026-${(count + 91).toString().padStart(4, '0')}`;

    const newPayment = await prisma.payment.create({
      data: {
        dealId: body.dealId || null,
        customerId: body.customerId || null,
        propertyId: body.propertyId || null,
        amount: parseFloat(body.amount) || 100000,
        paymentMethod: body.paymentMethod || 'Bank Transfer',
        referenceNumber: body.referenceNumber || null,
        status: body.status || 'PAID',
        receiptNumber,
        notes: body.notes || null,
        paidAt: body.paidAt ? new Date(body.paidAt) : new Date(),
      },
      include: {
        deal: true,
        customer: true,
        property: true,
      },
    });

    // Update Deal Token Amount if token payment
    if (body.dealId && body.isToken) {
      const deal = await prisma.deal.findUnique({ where: { id: body.dealId } });
      if (deal) {
        await prisma.deal.update({
          where: { id: body.dealId },
          data: {
            tokenAmount: (deal.tokenAmount || 0) + parseFloat(body.amount),
            stage: 'TOKEN',
          },
        });
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        entityType: 'PAYMENT',
        entityId: newPayment.id,
        action: 'PAYMENT_RECORDED',
        description: `Recorded ${newPayment.paymentMethod} payment of PKR ${newPayment.amount.toLocaleString()} (${receiptNumber}).`,
        userId: body.userId || null,
      },
    });

    // Dispatch Notification to Agent, Accounts, and Management
    const recipientId = newPayment.deal?.agentId || body.userId;
    await createCRMNotification({
      userIds: recipientId ? [recipientId] : [],
      notifyManagement: true,
      notifyRoles: ['ACCOUNTS'],
      title: '💰 Payment Received',
      message: `Received PKR ${newPayment.amount.toLocaleString()} (${newPayment.receiptNumber}) for ${newPayment.property?.title || 'property'}.`,
      type: 'PAYMENT',
      link: '/payments',
    });

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Create Payment error:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
