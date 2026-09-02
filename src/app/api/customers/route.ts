import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      include: {
        deals: {
          include: {
            property: { select: { id: true, title: true, plotNumber: true, block: true } },
          },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
        },
        assignedAgent: {
          select: { id: true, name: true, phone: true },
        },
        lead: {
          select: { id: true, source: true, preferredSociety: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Customers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, email, cnic, address, city, assignedAgentId, leadId } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: email || null,
        cnic: cnic || null,
        address: address || null,
        city: city || 'Islamabad',
        assignedAgentId: assignedAgentId || user.id,
        leadId: leadId || null,
      },
    });

    // Dispatch Notification to Agent and Management
    await createCRMNotification({
      userIds: [customer.assignedAgentId],
      notifyManagement: true,
      title: '🏛️ Verified Buyer Registered',
      message: `Customer "${customer.name}" (${customer.phone}) registered in CRM.`,
      type: 'LEAD',
      link: '/customers',
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Customers POST error:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
