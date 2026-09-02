import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: true,
        teams: {
          include: {
            leader: true,
            users: { select: { id: true, name: true, role: true, avatar: true } },
          },
        },
        users: { select: { id: true, name: true, role: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json({ error: 'Failed to fetch departments & teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, description, departmentId, managerId, leaderId } = body;

    if (type === 'DEPARTMENT') {
      const newDept = await prisma.department.create({
        data: {
          name,
          description: description || null,
          managerId: managerId || null,
        },
      });
      return NextResponse.json(newDept);
    } else {
      const newTeam = await prisma.team.create({
        data: {
          name,
          departmentId: departmentId || null,
          leaderId: leaderId || null,
        },
      });
      return NextResponse.json(newTeam);
    }
  } catch (error) {
    console.error('Create Team/Dept error:', error);
    return NextResponse.json({ error: 'Failed to create team or department' }, { status: 500 });
  }
}
