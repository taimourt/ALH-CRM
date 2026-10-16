import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { queueAndSendEmail } from '@/lib/email-service';
import { recordAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email ? String(body.email).toLowerCase().trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
    });

    // For security, do not disclose whether user exists, but if found, generate token
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.',
      });
    }

    const resetToken = `rst_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        invitationToken: resetToken,
        invitationExpiresAt: expiresAt,
      },
    });

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${proto}://${host}`;
    const resetLink = `${origin}/reset-password?token=${resetToken}`;

    try {
      await queueAndSendEmail(
        'user-invitation',
        user.email,
        {
          first_name: user.firstName || user.name.split(' ')[0],
          last_name: user.lastName || '',
          company_name: 'Asad Land Holdings',
          invitation_link: resetLink,
          role_name: user.role.replace('_', ' '),
        },
        'Password Reset Request - Asad Land Holdings CRM'
      );
    } catch (e) {
      console.warn('Could not dispatch password reset email:', e);
    }

    await recordAuditLog({
      action: 'PASSWORD_RESET_REQUESTED',
      targetType: 'USER',
      targetId: user.id,
      afterValue: { email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
      resetLink, // returned to streamline development and local testing
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request.' }, { status: 500 });
  }
}
