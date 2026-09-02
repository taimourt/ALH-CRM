import { NextResponse } from 'next/server';
import { checkAndEnforce24hLeadSLA } from '@/lib/lead-assignment';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingBreached = await prisma.lead.findMany({
      where: {
        stage: 'NEW',
        assignedAgentId: { not: null },
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
