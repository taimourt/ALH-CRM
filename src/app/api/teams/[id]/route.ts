import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        leader: true,
        users: {
          include: {
            assignedLeads: true,
            assignedDeals: true,
            assignedVisits: true,
            assignedTasks: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Fetch team leads, deals, site visits, and tasks
    const memberIds = team.users.map((u) => u.id);

    const [teamLeads, teamDeals, teamVisits, teamTasks, teamActivity] = await Promise.all([
      prisma.lead.findMany({
        where: { assignedAgentId: { in: memberIds } },
        include: { assignedAgent: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.deal.findMany({
        where: { agentId: { in: memberIds } },
        include: { agent: true, property: true, customer: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.siteVisit.findMany({
        where: { agentId: { in: memberIds } },
        include: { agent: true, property: true, lead: true },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.task.findMany({
        where: { assignedToId: { in: memberIds } },
        include: { assignedTo: true },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.activityLog.findMany({
        where: { userId: { in: memberIds } },
        include: { user: true },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalRevenue = teamDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

    // Format member performance metrics
    const members = team.users.map((u) => {
      const activeLeads = u.assignedLeads.length;
      const openDeals = u.assignedDeals.length;
      const visits = u.assignedVisits.length;
      const tasks = u.assignedTasks.length;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        role: u.role,
        status: u.status,
        jobTitle: u.jobTitle,
        activeLeads,
        openDeals,
        visits,
        tasks,
      };
    });

    return NextResponse.json({
      ...team,
      members,
      totalRevenue,
      teamLeads,
      teamDeals,
      teamVisits,
      teamTasks,
      teamActivity,
    });
  } catch (error) {
    console.error('Get team details error:', error);
    return NextResponse.json({ error: 'Failed to fetch team details' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, leaderId } = body;

    const updated = await prisma.team.update({
      where: { id: params.id },
      data: {
        ...(name ? { name } : {}),
        ...(leaderId !== undefined ? { leaderId } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}
