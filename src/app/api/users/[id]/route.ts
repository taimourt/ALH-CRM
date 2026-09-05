import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        team: true,
        manager: true,
        roleRef: true,
        sessions: { orderBy: { createdAt: 'desc' } },
        assignedLeads: { take: 10, orderBy: { updatedAt: 'desc' } },
        assignedDeals: { take: 10, orderBy: { updatedAt: 'desc' } },
        assignedVisits: { take: 10, orderBy: { scheduledAt: 'desc' } },
        assignedTasks: { take: 10, orderBy: { dueDate: 'asc' } },
        activityLogs: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Agent Performance Metrics
    const dealsClosed = user.assignedDeals.filter((d) => d.stage === 'CLOSED_WON' || d.stage === 'TOKEN').length;
    const totalRevenue = user.assignedDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const conversionRate = user.assignedLeads.length > 0 ? (dealsClosed / user.assignedLeads.length) * 100 : 0;

    const performance = {
      leadsAssigned: user.assignedLeads.length,
      leadsContacted: user.assignedLeads.length,
      siteVisits: user.assignedVisits.length,
      dealsClosed,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };

    return NextResponse.json({ ...user, performance });
  } catch (error) {
    console.error('Get user details error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const normRole = (authUser.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = normRole === 'SUPER_ADMIN' || normRole === 'MANAGER';

    const body = await request.json();
    const currentUser = await prisma.user.findUnique({ where: { id: params.id } });

    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Modifying another user or changing sensitive fields (role, status, department) requires Super Admin or Manager
    if (!isAuthorized && (authUser.id !== params.id || body.role || body.status || body.departmentId)) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin and Managers have access to modify staff accounts and roles.' },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(body.firstName !== undefined ? { firstName: body.firstName } : {}),
        ...(body.lastName !== undefined ? { lastName: body.lastName } : {}),
        ...(body.name !== undefined ? { name: body.name } : body.firstName || body.lastName ? { name: `${body.firstName || currentUser.firstName || ''} ${body.lastName || currentUser.lastName || ''}`.trim() } : {}),
        ...(body.avatar !== undefined ? { avatar: body.avatar } : {}),
        ...(body.whatsappNumber !== undefined ? { whatsappNumber: body.whatsappNumber } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.role !== undefined && isAuthorized ? { role: body.role } : {}),
        ...(body.status !== undefined && isAuthorized ? { status: body.status } : {}),
        ...(body.departmentId !== undefined && isAuthorized ? { departmentId: body.departmentId } : {}),
        ...(body.teamId !== undefined && isAuthorized ? { teamId: body.teamId } : {}),
        ...(body.managerId !== undefined && isAuthorized ? { managerId: body.managerId } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.jobTitle !== undefined ? { jobTitle: body.jobTitle } : {}),
      },
      include: {
        department: true,
        team: true,
        manager: true,
      },
    });

    // Record Audit Log for sensitive changes
    if (body.role || body.status) {
      await recordAuditLog({
        action: body.status ? `USER_STATUS_${body.status}` : 'USER_ROLE_CHANGED',
        targetType: 'USER',
        targetId: params.id,
        beforeValue: { role: currentUser.role, status: currentUser.status },
        afterValue: { role: updatedUser.role, status: updatedUser.status },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const normRole = (authUser.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = normRole === 'SUPER_ADMIN' || normRole === 'MANAGER';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin and Managers have access to delete staff accounts.' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        assignedLeads: true,
        assignedDeals: true,
        assignedVisits: true,
        assignedTasks: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Deletion Safety Check
    const activeDependencies =
      user.assignedLeads.length + user.assignedDeals.length + user.assignedVisits.length + user.assignedTasks.length;

    if (activeDependencies > 0) {
      return NextResponse.json(
        {
          error: 'DELETION_SAFETY_CHECK_FAILED',
          message: `User owns ${activeDependencies} CRM records (${user.assignedLeads.length} leads, ${user.assignedDeals.length} deals, ${user.assignedVisits.length} visits). Deactivate account instead of hard deletion to preserve historical audit records.`,
          dependencies: {
            leads: user.assignedLeads.length,
            deals: user.assignedDeals.length,
            visits: user.assignedVisits.length,
            tasks: user.assignedTasks.length,
          },
        },
        { status: 400 }
      );
    }

    // Check if last Super Admin
    if (user.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN', status: 'ACTIVE' } });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last active Super Admin account.' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({ where: { id: params.id } });

    await recordAuditLog({
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: params.id,
      beforeValue: { name: user.name, email: user.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
