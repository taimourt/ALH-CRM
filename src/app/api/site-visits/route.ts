import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const agentId = searchParams.get('agentId');

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const whereConditions: any = {};
    if (status && status !== 'ALL') whereConditions.status = status;
    if (isAgentOnly) {
      whereConditions.agentId = user.id;
    } else if (agentId && agentId !== 'ALL') {
      whereConditions.agentId = agentId;
    }

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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const body = await request.json();

    if (isAgentOnly && body.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
      if (lead && lead.assignedAgentId !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You can only schedule visits for leads assigned to you' }, { status: 403 });
      }
    }

    const targetAgentId = isAgentOnly ? user.id : (body.agentId || user.id);

    const newVisit = await prisma.siteVisit.create({
      data: {
        leadId: body.leadId,
        propertyId: body.propertyId,
        agentId: targetAgentId,
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
        userId: targetAgentId,
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const body = await request.json();
    const { id, status, customerFeedback, interestLevel, nextAction, notes } = body;

    const existingVisit = await prisma.siteVisit.findUnique({ where: { id } });
    if (!existingVisit) {
      return NextResponse.json({ error: 'Site visit not found' }, { status: 404 });
    }

    if (isAgentOnly && existingVisit.agentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only update your own site visits' }, { status: 403 });
    }

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
