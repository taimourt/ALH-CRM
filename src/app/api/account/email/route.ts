import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { queueAndSendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, newEmail, currentPassword } = body;

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid new email address is required' }, { status: 400 });
    }

    // Default to Super Admin if userId not passed
    const targetUserId = userId || 'user-1';

    const user = await prisma.user.findFirst({
      where: { OR: [{ id: targetUserId }, { role: 'SUPER_ADMIN' }] },
    });

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if email already in use
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: 'Email address is already in use by another user' }, { status: 400 });
    }

    const previousEmail = user.email;

    // Update Email in DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    // Record Audit Log
    await recordAuditLog({
      actorId: user.id,
      action: 'ACCOUNT_EMAIL_CHANGED',
      targetType: 'USER',
      targetId: user.id,
      beforeValue: { email: previousEmail },
      afterValue: { email: newEmail },
    });

    // Send Security Notification Email to previous and new email
    await queueAndSendEmail(
      'security-alert',
      previousEmail,
      {
        first_name: user.firstName || user.name,
        company_name: 'Asad Land Holdings',
      },
      '[SECURITY ALERT] Your CRM Email Address Was Changed'
    );

    return NextResponse.json({
      success: true,
      message: `Email address updated to ${newEmail}.`,
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
    });
  } catch (error) {
    console.error('Change email API error:', error);
    return NextResponse.json({ error: 'Failed to update email address' }, { status: 500 });
  }
}
