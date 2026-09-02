import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ leads: [], properties: [], customers: [], deals: [] });
  }

  try {
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { phone: { contains: q } },
          { preferredSociety: { contains: q } },
          { preferredSize: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { plotNumber: { contains: q } },
          { block: { contains: q } },
          { sector: { contains: q } },
          { city: { contains: q } },
        ],
      },
      include: { society: true },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { phone: { contains: q } },
          { cnic: { contains: q } },
        ],
      },
      take: 5,
    });

    return NextResponse.json({ leads, properties, customers });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
