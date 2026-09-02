import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getActiveSalesAgents, assignLeadRoundRobin } from '@/lib/lead-assignment';

export async function GET() {
  try {
    const agents = await getActiveSalesAgents();
    const unassignedCount = await prisma.lead.count({
      where: { assignedAgentId: null },
    });

    return NextResponse.json({
      activeAgentsCount: agents.length,
      agents,
      unassignedLeadsCount: unassignedCount,
    });
  } catch (error: any) {
    console.error('Round-robin status API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Round-Robin status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { leadId, autoAssignAllUnassigned } = body;

    if (leadId) {
      const assigned = await assignLeadRoundRobin(leadId);
      return NextResponse.json({
        success: true,
        message: `Lead assigned to ${assigned?.assignedAgent?.name} via Round-Robin.`,
        lead: assigned,
      });
    }

    if (autoAssignAllUnassigned) {
      const unassignedLeads = await prisma.lead.findMany({
        where: { assignedAgentId: null },
        take: 50,
      });

      const assignedResults = [];
      for (const lead of unassignedLeads) {
        const res = await assignLeadRoundRobin(lead.id);
        if (res) assignedResults.push({ leadId: lead.id, agent: res.assignedAgent?.name });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully distributed ${assignedResults.length} unassigned lead(s) evenly across sales agents via Round-Robin.`,
        assignedCount: assignedResults.length,
        results: assignedResults,
      });
    }

    return NextResponse.json({ error: 'Please specify leadId or autoAssignAllUnassigned: true' }, { status: 400 });
  } catch (error: any) {
    console.error('Round-robin assign API error:', error);
    return NextResponse.json({ error: error.message || 'Round-robin assignment failed' }, { status: 500 });
  }
}
