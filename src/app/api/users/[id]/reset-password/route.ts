import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import { queueAndSendEmail } from '@/lib/email-service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normRole = (authUser.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = normRole === 'SUPER_ADMIN' || normRole === 'ADMIN' || normRole === 'MANAGER';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin and Managers can reset agent passwords.' },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Agent/User account not found.' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    let newPassword = body.newPassword ? String(body.newPassword).trim() : '';

    // If no custom password provided, generate a strong temporary password
    if (!newPassword) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      newPassword = `ALH@${randomSuffix}#${Math.floor(100 + Math.random() * 900)}`;
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const hashedPassword = hashPassword(newPassword);

    // Update target user and ensure status is ACTIVE so they are not blocked by INVITED or expired tokens
    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        password: hashedPassword,
        status: targetUser.status === 'SUSPENDED' ? 'ACTIVE' : targetUser.status === 'INVITED' ? 'ACTIVE' : targetUser.status,
        passwordChangedAt: new Date(),
        invitationToken: null,
        invitationExpiresAt: null,
      },
    });

    await recordAuditLog({
      actorId: authUser.id,
      action: 'ADMIN_RESET_USER_PASSWORD',
      targetType: 'USER',
      targetId: targetUser.id,
      afterValue: { resetBy: authUser.name, targetEmail: targetUser.email },
    });

    // Attempt to notify user via email
    try {
      await queueAndSendEmail(
        'security-alert',
        targetUser.email,
        {
          first_name: targetUser.firstName || targetUser.name,
          company_name: 'Asad Land Holdings',
        },
        `[SECURITY] Your CRM Account Password Was Reset by Management`
      );
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: `Password for ${targetUser.name} (${targetUser.email}) has been successfully updated.`,
      newPassword, // Returned so admin can copy and communicate to agent directly
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error('Admin reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset user password.' }, { status: 500 });
  }
}
