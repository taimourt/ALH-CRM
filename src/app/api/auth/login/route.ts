import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ADMIN_ROLES, AUTH_COOKIE_NAME, createSession, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email ? String(body.email).toLowerCase().trim() : '';
    const password = body.password ? String(body.password) : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 1. Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    // 2. Check password
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // 3. Check status
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: `Access Denied: Your account status is '${user.status}'. Please contact system administrator.`,
        },
        { status: 403 }
      );
    }

    // 4. Check Admin authorization
    if (!ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        {
          error: `Access Restricted: User '${user.name}' has role '${user.role}'. Only authorized Admins (SUPER_ADMIN / ADMIN) can sign in.`,
        },
        { status: 403 }
      );
    }

    // 5. Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 6. Create session
    const userAgent = request.headers.get('user-agent') || 'Browser';
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const session = await createSession(user.id, userAgent, ipAddress);

    // 7. Audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'USER_LOGIN',
          targetType: 'AUTH',
          targetId: user.id,
          ipAddress: String(ipAddress).split(',')[0],
          deviceInfo: userAgent.slice(0, 100),
        },
      });
    } catch (e) {
      // Ignore non-critical audit log failures
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        jobTitle: user.jobTitle,
      },
    });

    // 8. Set secure HTTP-only cookie
    response.cookies.set(AUTH_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Also set a readable role/user cookie for client UI components
    response.cookies.set('alh_user_role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication failed due to server error.' },
      { status: 500 }
    );
  }
}
