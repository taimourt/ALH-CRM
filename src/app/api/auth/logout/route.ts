import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      // Invalidate session in DB
      await prisma.userSession.deleteMany({
        where: { token },
      }).catch(() => {});
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear session cookies
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('alh_user_role');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
