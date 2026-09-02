import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { propertyId, amount, tokenAmount, expectedClosingDate } = body;

    const lead = await prisma.lead.findUnique({ where: { id: params.id } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    // 1. Create or Find Customer Record
    let customer = await prisma.customer.findFirst({ where: { leadId: lead.id } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          leadId: lead.id,
          assignedAgentId: lead.assignedAgentId,
        },
      });
    }

    // 2. Create Active Deal Record
    const deal = await prisma.deal.create({
      data: {
        title: `${property.title} (${lead.name})`,
        leadId: lead.id,
        customerId: customer.id,
        propertyId: property.id,
        agentId: lead.assignedAgentId || 'system',
        sellerName: property.ownerName || 'Direct Owner',
        sellerPhone: property.ownerPhone || null,
        amount: parseFloat(amount) || property.demandPrice,
        tokenAmount: parseFloat(tokenAmount) || 0,
        stage: tokenAmount > 0 ? 'TOKEN' : 'QUALIFIED',
        agreedCommission: property.commissionRate || 1.0,
        expectedClosingDate: expectedClosingDate ? new Date(expectedClosingDate) : null,
      },
    });

    // 3. Update Lead Stage to CLOSED_WON or BOOKING
    await prisma.lead.update({
      where: { id: lead.id },
      data: { stage: tokenAmount > 0 ? 'TOKEN' : 'QUALIFIED' },
    });

    // 4. Update Property Status to TOKEN or RESERVED
    await prisma.property.update({
      where: { id: property.id },
      data: { status: tokenAmount > 0 ? 'TOKEN' : 'RESERVED' },
    });

    // 5. Create Activity Log
    await prisma.activityLog.create({
      data: {
        entityType: 'DEAL',
        entityId: deal.id,
        action: 'LEAD_CONVERTED',
        description: `Converted lead ${lead.name} into deal "${deal.title}".`,
        userId: lead.assignedAgentId,
      },
    });

    // 6. Dispatch Notification to Agent and Management
    await createCRMNotification({
      userIds: [lead.assignedAgentId],
      notifyManagement: true,
      title: '🎉 Lead Converted to Deal',
      message: `Lead "${lead.name}" converted to deal "${deal.title}" (PKR ${deal.amount?.toLocaleString()}).`,
      type: 'DEAL',
      link: '/deals',
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error('Convert lead error:', error);
    return NextResponse.json({ error: 'Failed to convert lead to deal' }, { status: 500 });
  }
}
