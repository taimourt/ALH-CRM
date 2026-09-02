import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

// 1. Verify invitation token validity (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Invitation token is missing' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        jobTitle: true,
        status: true,
        invitationExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or already used invitation token' }, { status: 404 });
    }

    if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This invitation token has expired. Please request a new invite.' }, { status: 410 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        jobTitle: user.jobTitle,
      },
    });
  } catch (error: any) {
    console.error('Verify invitation error:', error);
    return NextResponse.json({ error: 'Failed to verify invitation token' }, { status: 500 });
  }
}

// 2. Accept invitation and set new password (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired invitation token' }, { status: 404 });
    }

    if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired. Please ask your administrator to resend.' }, { status: 410 });
    }

    // Activate user, save password, and clear single-use token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: password, // In production, bcrypt hash can be used
        status: 'ACTIVE',
        invitationToken: null,
        invitationExpiresAt: null,
      },
    });

    // Create session token and log user in immediately
    const sessionToken = await createSessionToken(user.id);

    await recordAuditLog({
      action: 'INVITATION_ACCEPTED',
      targetType: 'USER',
      targetId: user.id,
      afterValue: { email: user.email, status: 'ACTIVE' },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account activated successfully. Welcome to Asad Land Holdings!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

    response.cookies.set('alh_session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('alh_user_role', updatedUser.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Accept invitation error:', error);
    return NextResponse.json({ error: 'Failed to activate account' }, { status: 500 });
  }
}
