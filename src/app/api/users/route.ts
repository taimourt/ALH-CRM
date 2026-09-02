import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { queueAndSendEmail } from '@/lib/email-service';
import { recordAuditLog } from '@/lib/audit';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const departmentId = searchParams.get('departmentId');

  try {
    const whereConditions: any = {};
    if (role && role !== 'ALL') whereConditions.role = role;
    if (status && status !== 'ALL') whereConditions.status = status;
    if (departmentId && departmentId !== 'ALL') whereConditions.departmentId = departmentId;

    if (q) {
      whereConditions.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { employeeId: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
      include: {
        department: true,
        team: true,
        manager: true,
        roleRef: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users API error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = normRole === 'SUPER_ADMIN' || normRole === 'MANAGER';

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin and Managers have access to create staff accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, role, departmentId, teamId, managerId, employeeId, jobTitle, whatsappNumber, notes, sendInvite } = body;

    if (!email || !firstName) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();
    const invitationToken = `inv_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const invitationExpiresAt = new Date(Date.now() + 86400000 * 7); // 7 Days single-use token

    // Determine dynamic base URL from request headers
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'crm.asadlandholdings.com';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${proto}://${host}`;
    const invitationLink = `${origin}/login?invite=${invitationToken}`;

    const targetRoleName = (role || 'SALES_AGENT').toUpperCase().replace(/\s+/g, '_');
    const matchedRole = await prisma.role.findFirst({
      where: {
        OR: [
          { name: { equals: role, mode: 'insensitive' } },
          { name: { equals: role?.replace(/_/g, ' '), mode: 'insensitive' } },
          { name: { equals: targetRoleName, mode: 'insensitive' } },
        ],
      },
    });

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: fullName,
        email,
        password: 'unassigned_password_hash',
        phone: phone || null,
        role: role || 'SALES_AGENT',
        roleId: matchedRole?.id || null,
        departmentId: departmentId || null,
        teamId: teamId || null,
        managerId: managerId || null,
        employeeId: employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        jobTitle: jobTitle || 'Sales Executive',
        whatsappNumber: whatsappNumber || phone || null,
        notes: notes || null,
        status: sendInvite ? 'INVITED' : 'ACTIVE',
        invitationToken: sendInvite ? invitationToken : null,
        invitationExpiresAt: sendInvite ? invitationExpiresAt : null,
      },
      include: {
        department: true,
        team: true,
        manager: true,
        roleRef: true,
      },
    });

    // Send invitation email asynchronously if requested
    let emailResult = null;
    if (sendInvite) {
      emailResult = await queueAndSendEmail('user-invitation', email, {
        first_name: firstName,
        last_name: lastName || '',
        company_name: 'Asad Land Holdings',
        role_name: (role || 'Sales Agent').replace('_', ' '),
        invitation_link: invitationLink,
      });
    }

    // Record Audit Trail
    await recordAuditLog({
      action: 'USER_CREATED',
      targetType: 'USER',
      targetId: newUser.id,
      afterValue: { name: fullName, email, role, status: newUser.status, invitationLink },
    });

    // Dispatch Notification to Management
    await createCRMNotification({
      notifyManagement: true,
      title: '👥 Staff Account Created',
      message: `User ${newUser.name} (${newUser.email}) added as ${(newUser.role || 'Staff').replace(/_/g, ' ')}.`,
      type: 'USER',
      link: '/settings/users',
    });

    return NextResponse.json({
      ...newUser,
      invitationLink: sendInvite ? invitationLink : null,
      emailResult,
    });
  } catch (error: any) {
    console.error('Create User error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
