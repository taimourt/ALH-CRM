import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { managerId } = await request.json();

    if (!managerId) {
      return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: { leader: true },
    });

    const newManager = await prisma.user.findUnique({ where: { id: managerId } });

    if (!team || !newManager) {
      return NextResponse.json({ error: 'Team or Manager not found' }, { status: 404 });
    }

    const previousManagerName = team.leader?.name || 'None';

    // 1. Update Team leader
    await prisma.team.update({
      where: { id: params.id },
      data: { leaderId: managerId },
    });

    // 2. Ensure new manager is linked to team & role set to MANAGER if needed
    await prisma.user.update({
      where: { id: managerId },
      data: {
        teamId: params.id,
        departmentId: team.departmentId || undefined,
      },
    });

    // 3. Dispatch Notification to new manager
    await prisma.notification.create({
      data: {
        userId: managerId,
        title: 'Assigned as Team Manager',
        message: `You have been assigned as Team Manager for "${team.name}".`,
        type: 'IN_APP',
      },
    });

    // 4. Record Audit Log
    await recordAuditLog({
      action: 'TEAM_MANAGER_CHANGED',
      targetType: 'TEAM',
      targetId: params.id,
      afterValue: {
        teamName: team.name,
        previousManager: previousManagerName,
        newManager: newManager.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Assigned ${newManager.name} as Team Manager for ${team.name}.`,
    });
  } catch (error) {
    console.error('Change team manager error:', error);
    return NextResponse.json({ error: 'Failed to update team manager' }, { status: 500 });
  }
}
