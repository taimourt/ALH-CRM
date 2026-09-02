import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        society: true,
        agent: true,
        deals: { include: { lead: true, customer: true } },
        siteVisits: { include: { lead: true, agent: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Get property by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch property details' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.demandPrice ? { demandPrice: parseFloat(body.demandPrice) } : {}),
        ...(body.plotNumber !== undefined ? { plotNumber: body.plotNumber } : {}),
        ...(body.block !== undefined ? { block: body.block } : {}),
        ...(body.sector !== undefined ? { sector: body.sector } : {}),
        ...(body.ownerName !== undefined ? { ownerName: body.ownerName } : {}),
        ...(body.ownerPhone !== undefined ? { ownerPhone: body.ownerPhone } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
      },
      include: {
        society: true,
        agent: true,
      },
    });

    // Dispatch Notification on status change
    if (body.status) {
      await createCRMNotification({
        notifyManagement: true,
        notifyAgents: true,
        title: `🔄 Property Status: ${body.status.replace(/_/g, ' ')}`,
        message: `Property "${updatedProperty.title}" is now marked as ${body.status.replace(/_/g, ' ')}.`,
        type: 'PROPERTY',
        link: '/properties',
      });
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete: set status to INACTIVE
    const deactivated = await prisma.property.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json(deactivated);
  } catch (error) {
    console.error('Deactivate property error:', error);
    return NextResponse.json({ error: 'Failed to deactivate property' }, { status: 500 });
  }
}
