import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isSuperAdmin = authUser.role === 'SUPER_ADMIN';

    const requests = await prisma.emailChangeRequest.findMany({
      where: isSuperAdmin ? {} : { userId: authUser.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            employeeId: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

    return NextResponse.json({
      requests,
      pendingCount,
      isSuperAdmin,
    });
  } catch (error: any) {
    console.error('Get email change requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch email change requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newEmail, reason } = body;

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'A valid new email address is required' }, { status: 400 });
    }

    const sanitizedNewEmail = newEmail.toLowerCase().trim();

    if (sanitizedNewEmail === authUser.email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'New email address must be different from current email.' }, { status: 400 });
    }

    // Check if target email is already taken by another account
    const existing = await prisma.user.findUnique({
      where: { email: sanitizedNewEmail },
    });

    if (existing && existing.id !== authUser.id) {
      return NextResponse.json({ error: 'Email address is already in use by another user' }, { status: 400 });
    }

    // Check if there is already a pending request for this exact email
    const existingPending = await prisma.emailChangeRequest.findFirst({
      where: {
        newEmail: sanitizedNewEmail,
        status: 'PENDING',
      },
    });

    if (existingPending && existingPending.userId !== authUser.id) {
      return NextResponse.json({ error: 'Another user already has a pending request for this email address.' }, { status: 400 });
    }

    // If requester is SUPER_ADMIN -> Apply directly
    if (authUser.role === 'SUPER_ADMIN') {
      const oldEmail = authUser.email;
      const updatedUser = await prisma.user.update({
        where: { id: authUser.id },
        data: { email: sanitizedNewEmail },
      });

      await recordAuditLog({
        actorId: authUser.id,
        action: 'SUPER_ADMIN_EMAIL_DIRECT_UPDATED',
        targetType: 'USER',
        targetId: authUser.id,
        beforeValue: { email: oldEmail },
        afterValue: { email: sanitizedNewEmail },
      });

      return NextResponse.json({
        success: true,
        immediate: true,
        message: `Super Admin email successfully updated to ${sanitizedNewEmail}.`,
        user: updatedUser,
      });
    }

    // For regular staff/agents/managers -> Create Pending Approval Request
    // Cancel any previous pending requests from this user
    await prisma.emailChangeRequest.updateMany({
      where: { userId: authUser.id, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });

    const newRequest = await prisma.emailChangeRequest.create({
      data: {
        userId: authUser.id,
        currentEmail: authUser.email,
        newEmail: sanitizedNewEmail,
        reason: reason || 'User profile email update',
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, email: true, avatar: true },
        },
      },
    });

    // Notify all Super Admins in real-time
    const superAdmins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
      select: { id: true },
    });

    for (const sa of superAdmins) {
      await prisma.notification.create({
        data: {
          userId: sa.id,
          title: '📩 Email Change Approval Required',
          message: `${authUser.name} (${authUser.role.replace(/_/g, ' ')}) requested to change email to "${sanitizedNewEmail}".`,
          type: 'USER',
          link: '/profile',
          read: false,
        },
      }).catch((err) => console.error('Notification error:', err));
    }

    await recordAuditLog({
      actorId: authUser.id,
      action: 'EMAIL_CHANGE_REQUESTED',
      targetType: 'USER',
      targetId: authUser.id,
      afterValue: {
        currentEmail: authUser.email,
        requestedNewEmail: sanitizedNewEmail,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      immediate: false,
      message: 'Email change request submitted. It will take effect once approved by Super Admin.',
      request: newRequest,
    });
  } catch (error: any) {
    console.error('Submit email change request error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit email change request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');

    const whereClause: any = {
      userId: authUser.id,
      status: 'PENDING',
    };

    if (requestId) {
      whereClause.id = requestId;
    }

    const pendingRequest = await prisma.emailChangeRequest.findFirst({
      where: whereClause,
    });

    if (!pendingRequest) {
      return NextResponse.json({ error: 'No active pending email change request found' }, { status: 404 });
    }

    const updated = await prisma.emailChangeRequest.update({
      where: { id: pendingRequest.id },
      data: { status: 'CANCELLED' },
    });

    await recordAuditLog({
      actorId: authUser.id,
      action: 'EMAIL_CHANGE_REQUEST_CANCELLED',
      targetType: 'USER',
      targetId: authUser.id,
      afterValue: {
        cancelledRequestId: pendingRequest.id,
        requestedEmail: pendingRequest.newEmail,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email change request was cancelled.',
      request: updated,
    });
  } catch (error: any) {
    console.error('Cancel email change request error:', error);
    return NextResponse.json({ error: 'Failed to cancel email change request' }, { status: 500 });
  }
}
