import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parsePropertyQuery } from '@/lib/property-matching';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const society = searchParams.get('society');
  const block = searchParams.get('block');
  const agentId = searchParams.get('agentId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  try {
    // Parse natural language search e.g. "10 marla plot Faisal Hills under 1 crore"
    const parsedNL = q ? parsePropertyQuery(q) : null;

    const whereConditions: any = {};

    if (status && status !== 'ALL') {
      whereConditions.status = status;
    }

    if (type && type !== 'ALL') {
      whereConditions.propertyType = type;
    } else if (parsedNL?.propertyType) {
      whereConditions.propertyType = parsedNL.propertyType;
    }

    if (society && society !== 'ALL') {
      whereConditions.society = { name: { contains: society } };
    } else if (parsedNL?.societyName) {
      whereConditions.society = { name: { contains: parsedNL.societyName } };
    }

    if (block && block !== 'ALL') {
      whereConditions.block = { contains: block };
    } else if (parsedNL?.block) {
      whereConditions.block = { contains: parsedNL.block };
    }

    if (agentId && agentId !== 'ALL') {
      whereConditions.agentId = agentId;
    }

    // Price filtering
    const effectiveMaxPrice = maxPrice ? parseFloat(maxPrice) : parsedNL?.maxPrice;
    const effectiveMinPrice = minPrice ? parseFloat(minPrice) : parsedNL?.minPrice;

    if (effectiveMaxPrice || effectiveMinPrice) {
      whereConditions.demandPrice = {};
      if (effectiveMaxPrice) whereConditions.demandPrice.lte = effectiveMaxPrice;
      if (effectiveMinPrice) whereConditions.demandPrice.gte = effectiveMinPrice;
    }

    // Size filtering from NL query
    if (parsedNL?.size) {
      whereConditions.size = parsedNL.size;
    }

    // Fallback keyword search if query exists
    if (q && !parsedNL?.societyName && !parsedNL?.propertyType && !parsedNL?.maxPrice) {
      whereConditions.OR = [
        { title: { contains: q } },
        { plotNumber: { contains: q } },
        { block: { contains: q } },
        { sector: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const properties = await prisma.property.findMany({
      where: whereConditions,
      include: {
        society: true,
        agent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      properties,
      parsedQuery: parsedNL,
      total: properties.length,
    });
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'SALES_AGENT' || user.role === 'AGENT') {
      return NextResponse.json(
        { error: 'Forbidden: Sales Agents have read-only view access to property inventory and cannot list properties.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    let societyId = body.societyId;
    if (!societyId && body.societyName) {
      const society = await prisma.society.findFirst({
        where: { name: { contains: body.societyName } },
      });
      if (society) societyId = society.id;
    }

    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        plotNumber: body.plotNumber || null,
        block: body.block || null,
        sector: body.sector || null,
        street: body.street || null,
        propertyType: body.propertyType || 'RESIDENTIAL_PLOT',
        size: parseFloat(body.size) || 10,
        sizeUnit: body.sizeUnit || 'MARLA',
        demandPrice: parseFloat(body.demandPrice) || 1000000,
        marketPrice: parseFloat(body.marketPrice) || parseFloat(body.demandPrice) || 1000000,
        status: body.status || 'AVAILABLE',
        city: body.city || 'Islamabad',
        societyId: societyId || null,
        ownerName: body.ownerName || null,
        ownerPhone: body.ownerPhone || null,
        dealerName: body.dealerName || 'Asad Land Holdings',
        dealerPhone: body.dealerPhone || '03008554433',
        agentId: body.agentId || null,
        commissionRate: parseFloat(body.commissionRate) || 1.0,
        description: body.description || null,
        images: body.images || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        galleryImages: body.galleryImages ? JSON.stringify(body.galleryImages) : null,
        documents: body.documents ? JSON.stringify(body.documents) : null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
      },
    });

    // Dispatch Notification to all Agents and Management
    await createCRMNotification({
      notifyManagement: true,
      notifyAgents: true,
      title: '🏡 New Property Listed',
      message: `Property "${newProperty.title}" listed in ${newProperty.city} for PKR ${newProperty.demandPrice.toLocaleString()}.`,
      type: 'PROPERTY',
      link: '/properties',
    });

    return NextResponse.json(newProperty);
  } catch (error) {
    console.error('Create Property error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
