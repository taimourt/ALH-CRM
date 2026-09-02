import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { targetAgentId } = await request.json();

    if (!targetAgentId) {
      return NextResponse.json({ error: 'Target agent ID is required for reassignment' }, { status: 400 });
    }

    const sourceUser = await prisma.user.findUnique({ where: { id: params.id } });
    const targetAgent = await prisma.user.findUnique({ where: { id: targetAgentId } });

    if (!sourceUser || !targetAgent) {
      return NextResponse.json({ error: 'Source or target user not found' }, { status: 404 });
    }

    // 1. Reassign Leads
    const leadsReassigned = await prisma.lead.updateMany({
      where: { assignedAgentId: params.id },
      data: { assignedAgentId: targetAgentId },
    });

    // 2. Reassign Open Deals
    const dealsReassigned = await prisma.deal.updateMany({
      where: { agentId: params.id },
      data: { agentId: targetAgentId },
    });

    // 3. Reassign Upcoming Site Visits
    const visitsReassigned = await prisma.siteVisit.updateMany({
      where: { agentId: params.id, status: { in: ['SCHEDULED', 'CONFIRMED'] } },
      data: { agentId: targetAgentId },
    });

    // 4. Reassign Open Tasks
    const tasksReassigned = await prisma.task.updateMany({
      where: { assignedToId: params.id, status: 'PENDING' },
      data: { assignedToId: targetAgentId },
    });

    // 5. Deactivate Source User
    await prisma.user.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' },
    });

    // Record Audit Trail
    await recordAuditLog({
      action: 'USER_DEACTIVATED_WITH_REASSIGNMENT',
      targetType: 'USER',
      targetId: params.id,
      afterValue: {
        deactivatedUser: sourceUser.name,
        transferredTo: targetAgent.name,
        leadsTransferred: leadsReassigned.count,
        dealsTransferred: dealsReassigned.count,
        visitsTransferred: visitsReassigned.count,
        tasksTransferred: tasksReassigned.count,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deactivated ${sourceUser.name} and transferred records to ${targetAgent.name}.`,
      summary: {
        leads: leadsReassigned.count,
        deals: dealsReassigned.count,
        visits: visitsReassigned.count,
        tasks: tasksReassigned.count,
      },
    });
  } catch (error) {
    console.error('Reassign user error:', error);
    return NextResponse.json({ error: 'Failed to reassign user records' }, { status: 500 });
  }
}
