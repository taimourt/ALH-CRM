import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { DEFAULT_ROLE_PRESETS } from '@/lib/rbac';

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: { users: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Roles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    const newRole = await prisma.role.create({
      data: {
        name,
        description: description || null,
        permissions: JSON.stringify(permissions || DEFAULT_ROLE_PRESETS.SALES_AGENT),
        isSystem: false,
      },
    });

    await recordAuditLog({
      action: 'ROLE_CREATED',
      targetType: 'ROLE',
      targetId: newRole.id,
      afterValue: { name, permissions },
    });

    return NextResponse.json(newRole);
  } catch (error) {
    console.error('Create Role error:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { roleId, permissions, description } = body;

    const currentRole = await prisma.role.findUnique({ where: { id: roleId } });
    if (!currentRole) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...(permissions ? { permissions: JSON.stringify(permissions) } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    });

    await recordAuditLog({
      action: 'ROLE_PERMISSIONS_UPDATED',
      targetType: 'ROLE',
      targetId: roleId,
      beforeValue: { permissions: currentRole.permissions },
      afterValue: { permissions: updatedRole.permissions },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error('Update Role error:', error);
    return NextResponse.json({ error: 'Failed to update role permissions' }, { status: 500 });
  }
}
