import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

// 1. Verify password reset token (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Password reset token is missing.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        invitationExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or already consumed password reset link.' },
        { status: 404 }
      );
    }

    if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This password reset link has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Verify reset token error:', error);
    return NextResponse.json({ error: 'Failed to verify reset token.' }, { status: 500 });
  }
}

// 2. Set new password with reset token (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Reset token and new password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset link.' }, { status: 404 });
    }

    if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This password reset link has expired. Please request a new one.' }, { status: 410 });
    }

    const hashedPassword = hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        status: 'ACTIVE',
        passwordChangedAt: new Date(),
        invitationToken: null,
        invitationExpiresAt: null,
      },
    });

    await recordAuditLog({
      actorId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      targetType: 'USER',
      targetId: user.id,
      afterValue: { email: user.email, status: 'ACTIVE' },
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated. You may now log in.',
    });
  } catch (error: any) {
    console.error('Reset password POST error:', error);
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
  }
}
