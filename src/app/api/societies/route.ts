import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const societies = await prisma.society.findMany({
      include: {
        properties: { select: { id: true, title: true, demandPrice: true, status: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(societies);
  } catch (error) {
    console.error('Societies API error:', error);
    return NextResponse.json({ error: 'Failed to fetch societies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSociety = await prisma.society.create({
      data: {
        name: body.name,
        city: body.city || 'Islamabad',
        location: body.location || 'Islamabad Expressway Corridor',
        developer: body.developer || 'Private Developer',
        nocStatus: body.nocStatus || 'CDA Approved',
        devStatus: body.devStatus || '100% Developed',
        blocks: body.blocks || 'Block A, Block B, Block C',
        priceRangeMin: body.priceRangeMin ? parseFloat(body.priceRangeMin) : 4500000,
        priceRangeMax: body.priceRangeMax ? parseFloat(body.priceRangeMax) : 35000000,
        installmentPlans: body.installmentPlans || null,
        notes: body.notes || null,
        totalPlots: body.totalPlots ? parseInt(body.totalPlots) : 3000,
        description: body.description || null,
        image: body.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      },
    });

    return NextResponse.json(newSociety);
  } catch (error) {
    console.error('Create Society error:', error);
    return NextResponse.json({ error: 'Failed to create society' }, { status: 500 });
  }
}
