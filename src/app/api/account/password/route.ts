import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { queueAndSendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Default to Super Admin if userId not passed
    const targetUserId = userId || 'user-1';

    const user = await prisma.user.findFirst({
      where: { OR: [{ id: targetUserId }, { role: 'SUPER_ADMIN' }] },
    });

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Update Password & Timestamp in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: `hashed_${newPassword}`,
        passwordChangedAt: new Date(),
      },
    });

    // Record Audit Log
    await recordAuditLog({
      actorId: user.id,
      action: 'ACCOUNT_PASSWORD_CHANGED',
      targetType: 'USER',
      targetId: user.id,
    });

    // Send Security Notification Email
    await queueAndSendEmail(
      'security-alert',
      user.email,
      {
        first_name: user.firstName || user.name,
        company_name: 'Asad Land Holdings',
      },
      '[SECURITY ALERT] Your CRM Password Was Successfully Changed'
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Security confirmation email sent.',
    });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
