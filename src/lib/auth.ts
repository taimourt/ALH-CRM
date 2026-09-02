import crypto from 'crypto';
import { prisma } from './db';
import { cookies } from 'next/headers';
import { getRolePermissionsFromDB } from './rbac';

export const AUTH_COOKIE_NAME = 'alh_session_token';
export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES_AGENT', 'ACCOUNTS'];

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(providedPassword: string, storedPasswordHash: string): boolean {
  if (!storedPasswordHash) return false;

  // 1. Direct match with plain passwords in development/seeds
  if (providedPassword === storedPasswordHash) return true;

  // 2. Direct match with common initial seed passwords
  if (
    storedPasswordHash === 'hashed_password_123' &&
    (providedPassword === 'password123' ||
      providedPassword === 'admin123' ||
      providedPassword === 'hashed_password_123')
  ) {
    return true;
  }

  // 3. SHA-256 match
  const hashed = hashPassword(providedPassword);
  if (hashed === storedPasswordHash) return true;

  return false;
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.userSession.create({
    data: {
      userId,
      token,
      deviceInfo: userAgent?.slice(0, 150) || 'Web Browser',
      ipAddress: ipAddress || '127.0.0.1',
      expiresAt,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          jobTitle: true,
        },
      },
    },
  });

  return session;
}

export async function createSessionToken(userId: string): Promise<string> {
  const session = await createSession(userId);
  return session.token;
}

export function setSessionCookie(token: string) {
  try {
    const cookieStore = cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (e) {
    // cookies() may not be writable in some contexts
  }
}

export async function getSessionUser(token?: string) {
  if (!token) return null;

  try {
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            avatar: true,
            jobTitle: true,
          },
        },
      },
    });

    if (!session) return null;
    if (new Date() > session.expiresAt) return null;
    if (session.user.status !== 'ACTIVE') return null;

    const permissions = await getRolePermissionsFromDB(session.user.role);

    return {
      ...session.user,
      permissions,
    };
  } catch (error) {
    console.error('Error fetching session user:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return getSessionUser(token);
}
