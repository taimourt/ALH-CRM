import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        department: true,
        team: true,
        manager: true,
        roleRef: true,
        emailChangeRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            assignedLeads: true,
            assignedDeals: true,
            assignedVisits: true,
            assignedTasks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const pendingEmailRequest = user.emailChangeRequests.find((r) => r.status === 'PENDING') || null;

    return NextResponse.json({
      user,
      pendingEmailRequest,
    });
  } catch (error: any) {
    console.error('Get profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, name, avatar, phone, whatsappNumber, jobTitle, notes } = body;

    const currentUser = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine effective full name
    let computedName = currentUser.name;
    if (name) {
      computedName = name.trim();
    } else if (firstName !== undefined || lastName !== undefined) {
      const fName = firstName !== undefined ? firstName : currentUser.firstName || '';
      const lName = lastName !== undefined ? lastName : currentUser.lastName || '';
      computedName = `${fName} ${lName}`.trim() || currentUser.name;
    }

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
        name: computedName,
        ...(avatar !== undefined ? { avatar } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
        ...(jobTitle !== undefined ? { jobTitle } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        department: true,
        team: true,
        manager: true,
        roleRef: true,
      },
    });

    await recordAuditLog({
      actorId: authUser.id,
      action: 'USER_PROFILE_UPDATED',
      targetType: 'USER',
      targetId: authUser.id,
      afterValue: {
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        whatsappNumber: updatedUser.whatsappNumber,
        jobTitle: updatedUser.jobTitle,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile settings updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
