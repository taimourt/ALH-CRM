import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

// POST: Add Existing User to Team OR Move User to Team
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, newRoleId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    const targetTeam = await prisma.team.findUnique({ where: { id: params.id } });

    if (!user || !targetTeam) {
      return NextResponse.json({ error: 'User or target team not found' }, { status: 404 });
    }

    const previousTeamName = user.team?.name || 'Unassigned';

    // Update team membership on user model
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        teamId: params.id,
        departmentId: targetTeam.departmentId || user.departmentId,
        ...(newRoleId ? { role: newRoleId } : {}),
      },
    });

    // Record Audit Log
    const actionName = user.teamId ? 'TEAM_MEMBER_MOVED' : 'TEAM_MEMBER_ADDED';
    await recordAuditLog({
      action: actionName,
      targetType: 'TEAM',
      targetId: params.id,
      afterValue: {
        userName: user.name,
        previousTeam: previousTeamName,
        newTeam: targetTeam.name,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Added ${user.name} to ${targetTeam.name}.`,
    });
  } catch (error) {
    console.error('Add/Move team member error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE: Remove User from Team (with optional record reassignment)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const reassignToUserId = searchParams.get('reassignToUserId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const teamName = user.team?.name || 'Team';

    // Optional Reassignment of active leads, tasks, visits, deals
    let reassignedSummary = null;
    if (reassignToUserId) {
      const targetUser = await prisma.user.findUnique({ where: { id: reassignToUserId } });
      if (targetUser) {
        const leadsReassigned = await prisma.lead.updateMany({
          where: { assignedAgentId: userId },
          data: { assignedAgentId: reassignToUserId },
        });

        const dealsReassigned = await prisma.deal.updateMany({
          where: { agentId: userId },
          data: { agentId: reassignToUserId },
        });

        const visitsReassigned = await prisma.siteVisit.updateMany({
          where: { agentId: userId, status: { in: ['SCHEDULED', 'CONFIRMED'] } },
          data: { agentId: reassignToUserId },
        });

        const tasksReassigned = await prisma.task.updateMany({
          where: { assignedToId: userId, status: 'PENDING' },
          data: { assignedToId: reassignToUserId },
        });

        reassignedSummary = {
          transferredTo: targetUser.name,
          leads: leadsReassigned.count,
          deals: dealsReassigned.count,
          visits: visitsReassigned.count,
          tasks: tasksReassigned.count,
        };
      }
    }

    // Remove user's teamId association (DO NOT DELETE USER ACCOUNT OR CRM HISTORY)
    await prisma.user.update({
      where: { id: userId },
      data: { teamId: null },
    });

    // Record Audit Log
    await recordAuditLog({
      action: 'TEAM_MEMBER_REMOVED',
      targetType: 'TEAM',
      targetId: params.id,
      afterValue: {
        userName: user.name,
        removedFromTeam: teamName,
        reassignedSummary,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Removed ${user.name} from ${teamName}. User account and historical CRM records remain intact.`,
      reassignedSummary,
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
