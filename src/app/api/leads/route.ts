import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { assignLeadRoundRobin } from '@/lib/lead-assignment';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage');

  try {
    const user = await getCurrentUser();
    const isAgentOnly = user?.role === 'SALES_AGENT' || user?.role === 'AGENT';

    const whereConditions: any = {
      ...(stage ? { stage: stage as any } : {}),
      ...(isAgentOnly && user
        ? {
            OR: [
              { assignedAgentId: user.id },
              { deals: { some: { agentId: user.id } } },
            ],
          }
        : {}),
    };

    const leads = await prisma.lead.findMany({
      where: whereConditions,
      include: {
        assignedAgent: true,
        siteVisits: { include: { property: true } },
        communications: { orderBy: { createdAt: 'desc' }, take: 5 },
        deals: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const isAgentOnly = user?.role === 'SALES_AGENT' || user?.role === 'AGENT';

    const body = await request.json();

    // If a sales agent creates a lead, it is assigned directly to them (they cannot reassign to others)
    const targetAssignedAgentId = isAgentOnly && user ? user.id : body.assignedAgentId || null;

    const newLead = await prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        stage: body.stage || 'NEW',
        source: body.source || 'WEBSITE',
        score: body.score || 70,
        budgetMin: body.budgetMin || null,
        budgetMax: body.budgetMax || null,
        preferredType: body.preferredType || 'RESIDENTIAL_PLOT',
        preferredSize: body.preferredSize || '10 MARLA',
        preferredSociety: body.preferredSociety || 'Kohistan Enclave',
        notes: body.notes || null,
        assignedAgentId: targetAssignedAgentId,
        assignedAt: new Date(),
        slaStatus: 'ON_TRACK',
      },
    });

    // If created by admin/manager without an agent specified, auto-distribute via Round-Robin
    if (!targetAssignedAgentId && !isAgentOnly) {
      try {
        const assigned = await assignLeadRoundRobin(newLead.id);
        if (assigned) return NextResponse.json(assigned);
      } catch (assignErr) {
        console.error('Auto Round-Robin error on lead create:', assignErr);
      }
    } else {
      await createCRMNotification({
        userIds: targetAssignedAgentId ? [targetAssignedAgentId] : [],
        notifyManagement: true,
        title: '⚡ New Lead Created',
        message: `Lead "${newLead.name}" (${newLead.phone}) registered for ${newLead.preferredSociety || 'project'}.`,
        type: 'LEAD',
        link: '/leads',
      });
    }

    const leadWithAgent = await prisma.lead.findUnique({
      where: { id: newLead.id },
      include: { assignedAgent: true },
    });

    return NextResponse.json(leadWithAgent || newLead);
  } catch (error) {
    console.error('Create Lead error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    const isAgentOnly = user?.role === 'SALES_AGENT' || user?.role === 'AGENT';

    const body = await request.json();
    const { id, stage, notes, assignedAgentId } = body;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Sales Agent can only update their own assigned leads and CANNOT reassign to other agents
    if (isAgentOnly && user && existingLead.assignedAgentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only update leads assigned to you.' }, { status: 403 });
    }

    const isContactStage = stage && stage !== 'NEW';

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(stage ? { stage } : {}),
        ...(notes !== undefined ? { notes } : {}),
        // Sales agents cannot reassign leads
        ...(!isAgentOnly && assignedAgentId !== undefined ? { assignedAgentId, assignedAt: new Date() } : {}),
        ...(isContactStage ? { lastContactedAt: new Date(), slaStatus: 'ON_TRACK' } : {}),
      },
      include: {
        assignedAgent: true,
      },
    });

    // Notify on lead update / stage change
    if (stage && stage !== existingLead.stage) {
      await createCRMNotification({
        userIds: updated.assignedAgentId ? [updated.assignedAgentId] : [],
        notifyManagement: true,
        title: `📊 Lead Stage: ${stage.replace(/_/g, ' ')}`,
        message: `Lead "${updated.name}" updated to stage ${stage.replace(/_/g, ' ')}.`,
        type: 'LEAD',
        link: '/leads',
      });
    }

    // If moved to CLOSED_WON or TOKEN, sync to Deal and Commission tables
    if (stage === 'CLOSED_WON' || stage === 'TOKEN') {
      try {
        const existingDeal = await prisma.deal.findFirst({ where: { leadId: id } });
        const dealAmount = existingLead.budgetMax || 15000000;
        const agentId = updated.assignedAgentId || (user ? user.id : (await prisma.user.findFirst({ where: { role: 'SALES_AGENT' } }))?.id);

        let defaultProp = await prisma.property.findFirst();
        if (!defaultProp) {
          defaultProp = await prisma.property.create({
            data: {
              title: `Plot in ${existingLead.preferredSociety || 'Kohistan Enclave'}`,
              size: 10,
              sizeUnit: 'MARLA',
              demandPrice: dealAmount,
              status: 'AVAILABLE',
            },
          });
        }

        if (!existingDeal && agentId) {
          const createdDeal = await prisma.deal.create({
            data: {
              title: `${stage === 'CLOSED_WON' ? 'Closed Deal' : 'Token Booking'} • ${updated.name}`,
              leadId: updated.id,
              propertyId: defaultProp.id,
              agentId: agentId,
              amount: dealAmount,
              tokenAmount: dealAmount * 0.1,
              stage: stage === 'CLOSED_WON' ? 'CLOSED_WON' : 'TOKEN',
              agreedCommission: 1.0,
            },
          });

          if (stage === 'CLOSED_WON') {
            const totalCommission = dealAmount * 0.01;
            await prisma.commission.create({
              data: {
                dealId: createdDeal.id,
                agentId: agentId,
                amount: totalCommission,
                percentage: 1.0,
                totalDealCommission: totalCommission,
                agentShare: totalCommission * 0.6,
                managerShare: totalCommission * 0.15,
                companyShare: totalCommission * 0.25,
                status: 'APPROVED',
              },
            });
          }
        } else if (existingDeal) {
          await prisma.deal.update({
            where: { id: existingDeal.id },
            data: {
              stage: stage === 'CLOSED_WON' ? 'CLOSED_WON' : 'TOKEN',
            },
          });
        }
      } catch (dealSyncErr) {
        console.error('Error syncing deal upon lead stage update:', dealSyncErr);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update Lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
