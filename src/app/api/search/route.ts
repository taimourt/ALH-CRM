import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ leads: [], properties: [], customers: [], deals: [] });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const leadWhere: any = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
        { preferredSociety: { contains: q, mode: 'insensitive' } },
        { preferredSize: { contains: q, mode: 'insensitive' } },
      ],
    };

    const customerWhere: any = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
        { cnic: { contains: q } },
      ],
    };

    if (isAgentOnly) {
      leadWhere.assignedAgentId = user.id;
      customerWhere.assignedAgentId = user.id;
    }

    const leads = await prisma.lead.findMany({
      where: leadWhere,
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { plotNumber: { contains: q, mode: 'insensitive' } },
          { block: { contains: q, mode: 'insensitive' } },
          { sector: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { society: true },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    const customers = await prisma.customer.findMany({
      where: customerWhere,
      take: 5,
    });

    return NextResponse.json({ leads, properties, customers });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

