import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const agentId = searchParams.get('agentId');

  try {
    const whereConditions: any = {};
    if (status && status !== 'ALL') whereConditions.status = status;
    if (agentId && agentId !== 'ALL') whereConditions.agentId = agentId;

    const visits = await prisma.siteVisit.findMany({
      where: whereConditions,
      include: {
        lead: true,
        property: { include: { society: true } },
        agent: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error('Site visits API error:', error);
    return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newVisit = await prisma.siteVisit.create({
      data: {
        leadId: body.leadId,
        propertyId: body.propertyId,
        agentId: body.agentId,
        scheduledAt: new Date(body.scheduledAt || Date.now()),
        status: body.status || 'SCHEDULED',
        notes: body.notes || null,
        interestLevel: body.interestLevel || 'WARM',
      },
      include: {
        lead: true,
        property: true,
        agent: true,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        entityType: 'SITE_VISIT',
        entityId: newVisit.id,
        action: 'VISIT_SCHEDULED',
        description: `Site visit scheduled for lead ${newVisit.lead.name} on ${newVisit.property.title}.`,
        userId: body.agentId,
      },
    });

    // Dispatch Notification to Agent and Management
    await createCRMNotification({
      userIds: newVisit.agentId ? [newVisit.agentId] : [],
      notifyManagement: true,
      title: '📅 Site Visit Scheduled',
      message: `Site visit scheduled with ${newVisit.lead?.name || 'Client'} for ${newVisit.property?.title || 'Property'} on ${new Date(newVisit.scheduledAt).toLocaleDateString()}.`,
      type: 'VISIT',
      link: '/site-visits',
    });

    return NextResponse.json(newVisit);
  } catch (error) {
    console.error('Create Site Visit error:', error);
    return NextResponse.json({ error: 'Failed to schedule site visit' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, customerFeedback, interestLevel, nextAction, notes } = body;

    const updatedVisit = await prisma.siteVisit.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(customerFeedback !== undefined ? { customerFeedback } : {}),
        ...(interestLevel ? { interestLevel } : {}),
        ...(nextAction !== undefined ? { nextAction } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        lead: true,
        property: true,
        agent: true,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        entityType: 'SITE_VISIT',
        entityId: id,
        action: 'VISIT_UPDATED',
        description: `Site visit status changed to ${status || 'updated'}. Feedback: ${customerFeedback || 'Recorded'}`,
        userId: updatedVisit.agentId,
      },
    });

    // Dispatch Notification
    await createCRMNotification({
      userIds: updatedVisit.agentId ? [updatedVisit.agentId] : [],
      notifyManagement: true,
      title: `✅ Site Visit ${status || 'Updated'}`,
      message: `Site visit with ${updatedVisit.lead?.name || 'Client'} marked as ${status || 'updated'}.${customerFeedback ? ` Feedback: "${customerFeedback}"` : ''}`,
      type: 'VISIT',
      link: '/site-visits',
    });

    return NextResponse.json(updatedVisit);
  } catch (error) {
    console.error('Update Site Visit error:', error);
    return NextResponse.json({ error: 'Failed to update site visit' }, { status: 500 });
  }
}
