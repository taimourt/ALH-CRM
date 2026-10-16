import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { queueAndSendEmail } from '@/lib/email-service';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to change password.' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Determine target user (self, or another user if Super Admin)
    const targetUserId = (userId && authUser.role === 'SUPER_ADMIN') ? userId : authUser.id;

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Verify current password when user is changing their own password
    if (targetUserId === authUser.id && currentPassword) {
      const isCurrentValid = verifyPassword(currentPassword, targetUser.password);
      if (!isCurrentValid) {
        return NextResponse.json({ error: 'Current password is incorrect. Please check and try again.' }, { status: 400 });
      }
    }

    // Update Password & Timestamp in DB with standard SHA-256 hash
    const hashedPassword = hashPassword(newPassword);

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        status: 'ACTIVE',
      },
    });

    // Record Audit Log
    await recordAuditLog({
      actorId: authUser.id,
      action: 'ACCOUNT_PASSWORD_CHANGED',
      targetType: 'USER',
      targetId: targetUser.id,
    });

    // Send Security Notification Email
    try {
      await queueAndSendEmail(
        'security-alert',
        targetUser.email,
        {
          first_name: targetUser.firstName || targetUser.name,
          company_name: 'Asad Land Holdings',
        },
        '[SECURITY ALERT] Your CRM Password Was Successfully Changed'
      );
    } catch (e) {
      // Non-blocking email alert
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now use your new password permanently.',
    });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}

