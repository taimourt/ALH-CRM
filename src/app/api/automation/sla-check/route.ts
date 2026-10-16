import { NextResponse } from 'next/server';
import { checkAndEnforce24hLeadSLA } from '@/lib/lead-assignment';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingBreached = await prisma.lead.findMany({
      where: {
        stage: 'NEW',
        assignedAgentId: isAgentOnly ? user.id : { not: null },
        assignedAt: { lt: twentyFourHoursAgo },
      },
      include: {
        assignedAgent: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    return NextResponse.json({
      activeSlaWindowHours: 24,
      untouchedBreachedCount: pendingBreached.length,
      breachedLeads: pendingBreached.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        preferredSociety: l.preferredSociety,
        assignedAgent: l.assignedAgent?.name,
        assignedAt: l.assignedAt,
        hoursUntouched: Math.round((Date.now() - new Date(l.assignedAt || l.createdAt).getTime()) / (1000 * 60 * 60)),
      })),
    });
  } catch (error: any) {
    console.error('SLA Status check error:', error);
    return NextResponse.json({ error: 'Failed to inspect SLA status' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(userRole);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Only management can trigger SLA redistribution' }, { status: 403 });
    }

    const result = await checkAndEnforce24hLeadSLA();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('SLA Reassignment API error:', error);
    return NextResponse.json({ error: error.message || 'SLA check execution failed' }, { status: 500 });
  }
}

