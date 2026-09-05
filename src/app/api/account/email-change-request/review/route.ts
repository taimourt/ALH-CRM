import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import { queueAndSendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin can approve or reject email change requests.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action, rejectionReason } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: 'requestId and action (APPROVE/REJECT) are required.' }, { status: 400 });
    }

    const emailRequest = await prisma.emailChangeRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
      },
    });

    if (!emailRequest) {
      return NextResponse.json({ error: 'Email change request not found' }, { status: 404 });
    }

    if (emailRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: `This request has already been ${emailRequest.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    const now = new Date();

    if (action === 'APPROVE') {
      // Check if target email was taken in the meantime
      const existingUser = await prisma.user.findUnique({
        where: { email: emailRequest.newEmail },
      });

      if (existingUser && existingUser.id !== emailRequest.userId) {
        return NextResponse.json(
          { error: `Cannot approve: Email address ${emailRequest.newEmail} is now in use by another user account.` },
          { status: 400 }
        );
      }

      // 1. Update user email in database
      const previousEmail = emailRequest.user.email;
      const updatedUser = await prisma.user.update({
        where: { id: emailRequest.userId },
        data: { email: emailRequest.newEmail },
      });

      // 2. Mark request APPROVED
      const updatedRequest = await prisma.emailChangeRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedById: authUser.id,
          reviewedAt: now,
        },
      });

      // 3. Send In-App Notification to the user
      await prisma.notification.create({
        data: {
          userId: emailRequest.userId,
          title: '✅ Email Change Approved',
          message: `Your account email address has been updated to "${emailRequest.newEmail}" by Super Admin ${authUser.name}.`,
          type: 'USER',
          link: '/profile',
          read: false,
        },
      }).catch((err) => console.error('Notification error:', err));

      // 4. Send Security Alert Email
      try {
        await queueAndSendEmail(
          'security-alert',
          previousEmail,
          {
            first_name: updatedUser.firstName || updatedUser.name,
            company_name: 'Asad Land Holdings',
          },
          `[SECURITY NOTICE] Your CRM Email Address Changed to ${emailRequest.newEmail}`
        );
      } catch (emailErr) {
        console.error('Security email alert dispatch failed:', emailErr);
      }

      // 5. Audit Trail
      await recordAuditLog({
        actorId: authUser.id,
        action: 'EMAIL_CHANGE_APPROVED',
        targetType: 'USER',
        targetId: emailRequest.userId,
        beforeValue: { email: previousEmail },
        afterValue: {
          newEmail: emailRequest.newEmail,
          approvedBy: authUser.name,
          requestId,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Email change approved for ${emailRequest.user.name}. Account email is now ${emailRequest.newEmail}.`,
        request: updatedRequest,
        user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
      });
    }

    if (action === 'REJECT') {
      const reason = rejectionReason || 'Administrative decision by Super Admin.';

      // 1. Mark request REJECTED
      const updatedRequest = await prisma.emailChangeRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          reviewedById: authUser.id,
          reviewedAt: now,
        },
      });

      // 2. Send In-App Notification to the user
      await prisma.notification.create({
        data: {
          userId: emailRequest.userId,
          title: '❌ Email Change Request Rejected',
          message: `Your request to change email to "${emailRequest.newEmail}" was rejected by Super Admin ${authUser.name}. Reason: ${reason}`,
          type: 'USER',
          link: '/profile',
          read: false,
        },
      }).catch((err) => console.error('Notification error:', err));

      // 3. Audit Trail
      await recordAuditLog({
        actorId: authUser.id,
        action: 'EMAIL_CHANGE_REJECTED',
        targetType: 'USER',
        targetId: emailRequest.userId,
        beforeValue: { requestedEmail: emailRequest.newEmail },
        afterValue: {
          rejectedBy: authUser.name,
          rejectionReason: reason,
          requestId,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Email change request for ${emailRequest.user.name} was rejected.`,
        request: updatedRequest,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Expected APPROVE or REJECT.' }, { status: 400 });
  } catch (error: any) {
    console.error('Review email change request error:', error);
    return NextResponse.json({ error: error.message || 'Failed to review email change request' }, { status: 500 });
  }
}
