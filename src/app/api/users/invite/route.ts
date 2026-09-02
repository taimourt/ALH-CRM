import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { queueAndSendEmail } from '@/lib/email-service';
import { recordAuditLog } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const normRole = (authUser.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = normRole === 'SUPER_ADMIN' || normRole === 'MANAGER';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin and Managers have access to invite staff accounts.' },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Generate fresh single-use invitation token
    const newToken = `inv_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 86400000 * 7);

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'INVITED',
        invitationToken: newToken,
        invitationExpiresAt: expiresAt,
      },
    });

    // Determine dynamic base URL from request headers
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'crm.asadlandholdings.com';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${proto}://${host}`;
    const invitationLink = `${origin}/login?invite=${newToken}`;

    const emailResult = await queueAndSendEmail('user-invitation', user.email, {
      first_name: user.firstName || user.name.split(' ')[0],
      last_name: user.lastName || '',
      company_name: 'Asad Land Holdings',
      role_name: user.role.replace('_', ' '),
      invitation_link: invitationLink,
    });

    await recordAuditLog({
      action: 'INVITATION_RESENT',
      targetType: 'USER',
      targetId: userId,
      afterValue: { recipient: user.email, invitationLink },
    });

    return NextResponse.json({
      success: true,
      invitationToken: newToken,
      invitationLink,
      recipient: user.email,
      message: `Issued fresh invitation token for ${user.email}.`,
      emailResult,
    });
  } catch (error) {
    console.error('Resend invitation error:', error);
    return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
  }
}
