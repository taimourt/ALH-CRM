import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getActiveSalesAgents, assignLeadRoundRobin } from '@/lib/lead-assignment';
import { isRoundRobinEnabled, setRoundRobinEnabled, getRoundRobinSettingDetails } from '@/lib/settings';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const agents = await getActiveSalesAgents();
    const unassignedCount = await prisma.lead.count({
      where: { assignedAgentId: null },
    });
    const settingDetails = await getRoundRobinSettingDetails();

    return NextResponse.json({
      enabled: settingDetails.enabled,
      updatedAt: settingDetails.updatedAt,
      updatedBy: settingDetails.updatedBy,
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

    const canManageRoundRobin =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ADMIN' ||
      user.role === 'MANAGER' ||
      user.permissions?.includes('leads.assign') ||
      user.permissions?.includes('settings.manage');

    if (!canManageRoundRobin) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage lead distribution' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { leadId, autoAssignAllUnassigned, enabled, action } = body;

    // Handle TOGGLE Action
    if (action === 'TOGGLE' || typeof enabled === 'boolean') {
      const targetEnabled = typeof enabled === 'boolean' ? enabled : action === 'TOGGLE' ? !(await isRoundRobinEnabled()) : true;
      const prevDetails = await getRoundRobinSettingDetails();

      const result = await setRoundRobinEnabled(targetEnabled, user.name);

      await recordAuditLog({
        actorId: user.id,
        action: targetEnabled ? 'ROUND_ROBIN_DISTRIBUTION_ENABLED' : 'ROUND_ROBIN_DISTRIBUTION_PAUSED',
        targetType: 'SYSTEM_SETTINGS',
        targetId: 'ROUND_ROBIN_LEAD_DISTRIBUTION',
        beforeValue: { enabled: prevDetails.enabled },
        afterValue: { enabled: targetEnabled, toggledBy: user.name, timestamp: result.updatedAt },
      });

      const agents = await getActiveSalesAgents();
      const unassignedCount = await prisma.lead.count({
        where: { assignedAgentId: null },
      });

      return NextResponse.json({
        success: true,
        enabled: targetEnabled,
        message: targetEnabled
          ? 'Round-Robin Lead Distribution is now ACTIVE. Inbound inquiries will be auto-assigned.'
          : 'Round-Robin Lead Distribution is now PAUSED. Inbound leads will be held in Unassigned Pool.',
        updatedAt: result.updatedAt,
        updatedBy: user.name,
        activeAgentsCount: agents.length,
        unassignedLeadsCount: unassignedCount,
      });
    }

    // Handle Manual Single Lead Assignment
    if (leadId) {
      const assigned = await assignLeadRoundRobin(leadId, { force: true });
      return NextResponse.json({
        success: true,
        message: `Lead assigned to ${assigned?.assignedAgent?.name || 'Agent'} via Round-Robin.`,
        lead: assigned,
      });
    }

    // Handle Bulk Unassigned Pool Distribution
    if (autoAssignAllUnassigned) {
      const unassignedLeads = await prisma.lead.findMany({
        where: { assignedAgentId: null },
        take: 100,
        orderBy: { createdAt: 'asc' },
      });

      const assignedResults = [];
      for (const lead of unassignedLeads) {
        const res = await assignLeadRoundRobin(lead.id, { force: true });
        if (res) assignedResults.push({ leadId: lead.id, leadName: lead.name, agent: res.assignedAgent?.name });
      }

      await recordAuditLog({
        actorId: user.id,
        action: 'ROUND_ROBIN_BULK_POOL_DISTRIBUTED',
        targetType: 'LEAD',
        afterValue: {
          distributedCount: assignedResults.length,
          dispatchedBy: user.name,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully distributed ${assignedResults.length} unassigned lead(s) evenly across active sales agents.`,
        assignedCount: assignedResults.length,
        results: assignedResults,
      });
    }

    return NextResponse.json(
      { error: 'Please specify action: "TOGGLE", enabled: boolean, leadId, or autoAssignAllUnassigned: true' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Round-robin assign API error:', error);
    return NextResponse.json({ error: error.message || 'Round-robin assignment failed' }, { status: 500 });
  }
}
