import { prisma } from './db';
import { queueAndSendEmail } from './email-service';
import { recordAuditLog } from './audit';
import { formatPKR } from './utils';
import { createCRMNotification } from './notifications';
import { isRoundRobinEnabled, getRoundRobinSettingDetails } from './settings';

export interface RoundRobinAgent {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  activeLeadsCount: number;
  lastAssignedAt?: Date | null;
}

/**
 * 1. Fetch all active Sales Agents available for Round-Robin Distribution
 */
export async function getActiveSalesAgents(): Promise<RoundRobinAgent[]> {
  const agents = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: { in: ['SALES_AGENT', 'SENIOR_AGENT', 'AGENT'] },
    },
    include: {
      assignedLeads: {
        where: {
          stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] },
        },
        select: { id: true, assignedAt: true },
        orderBy: { assignedAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          assignedLeads: {
            where: {
              stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] },
            },
          },
        },
      },
    },
  });

  // If no sales agents exist, fallback to any active admin
  if (agents.length === 0) {
    const admins = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
      },
      include: {
        assignedLeads: {
          take: 1,
          orderBy: { assignedAt: 'desc' },
        },
        _count: {
          select: { assignedLeads: true },
        },
      },
    });

    return admins.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      role: a.role,
      activeLeadsCount: a._count.assignedLeads,
      lastAssignedAt: a.assignedLeads[0]?.assignedAt || null,
    }));
  }

  return agents.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    role: a.role,
    activeLeadsCount: a._count.assignedLeads,
    lastAssignedAt: a.assignedLeads[0]?.assignedAt || null,
  }));
}

/**
 * 2. Assign Lead automatically using Round-Robin algorithm
 * Supports { force: true } to bypass paused state (e.g. manual bulk dispatch)
 */
export async function assignLeadRoundRobin(leadId: string, options?: { force?: boolean }) {
  // Check if round-robin is enabled unless explicitly forced
  if (!options?.force) {
    const enabled = await isRoundRobinEnabled();
    if (!enabled) {
      console.log(`[Round-Robin] Lead distribution is PAUSED. Lead ${leadId} held in Unassigned Pool.`);
      return null;
    }
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  const agents = await getActiveSalesAgents();
  if (agents.length === 0) {
    console.warn('[Round-Robin] No active agents available for assignment.');
    return null;
  }

  // Sort agents:
  // 1. Never assigned or oldest assigned first
  // 2. Tiebreaker: Lowest active leads count
  agents.sort((a, b) => {
    if (!a.lastAssignedAt && b.lastAssignedAt) return -1;
    if (a.lastAssignedAt && !b.lastAssignedAt) return 1;
    if (a.lastAssignedAt && b.lastAssignedAt) {
      const timeDiff = new Date(a.lastAssignedAt).getTime() - new Date(b.lastAssignedAt).getTime();
      if (timeDiff !== 0) return timeDiff;
    }
    return a.activeLeadsCount - b.activeLeadsCount;
  });

  const selectedAgent = agents[0];
  const now = new Date();

  // Update Lead Assignment in Database
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedAgentId: selectedAgent.id,
      assignedAt: now,
      slaStatus: 'ON_TRACK',
    },
    include: {
      assignedAgent: true,
    },
  });

  // Record Audit Trail
  await recordAuditLog({
    action: 'LEAD_ASSIGNED_ROUND_ROBIN',
    targetType: 'LEAD',
    targetId: leadId,
    afterValue: {
      assignedTo: selectedAgent.name,
      agentEmail: selectedAgent.email,
      assignedAt: now,
    },
  });

  // Send Email Alert to Assigned Sales Agent
  try {
    const formattedBudget = lead.budgetMax ? formatPKR(lead.budgetMax) : 'Not specified';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin: 0;">ASAD LAND HOLDINGS</h2>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">⚡ New Lead Assigned via Round-Robin</p>
        </div>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 20px;">
          <h3 style="color: #ffffff; margin-top: 0;">Assalam-o-Alaikum ${selectedAgent.name},</h3>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            A new client inquiry has been assigned to you. <strong>Please call this client within 24 hours</strong> to maintain your SLA response score.
          </p>
          
          <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 16px;">
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 8px 0; color: #94a3b8;">Client Name:</td>
              <td style="padding: 8px 0; color: #f8fafc; font-weight: bold;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 8px 0; color: #94a3b8;">Phone Number:</td>
              <td style="padding: 8px 0; color: #10b981; font-weight: bold; font-family: monospace;">${lead.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 8px 0; color: #94a3b8;">Preferred Society:</td>
              <td style="padding: 8px 0; color: #f8fafc;">${lead.preferredSociety || 'Kohistan Enclave / New City / DHA'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 8px 0; color: #94a3b8;">Size Requirement:</td>
              <td style="padding: 8px 0; color: #f8fafc;">${lead.preferredSize || '5/10 Marla'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Client Budget:</td>
              <td style="padding: 8px 0; color: #10b981; font-weight: bold;">${formattedBudget}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center;">
          <a href="https://asad-crm.vercel.app/leads" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 14px;">
            Open Lead in CRM Pipeline →
          </a>
        </div>
        
        <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 24px;">
          Note: If untouched for 24 hours, this lead will be automatically reassigned by the SLA monitor.
        </p>
      </div>
    `;

    await queueAndSendEmail(
      'lead-assigned-agent',
      selectedAgent.email,
      {
        first_name: selectedAgent.name.split(' ')[0],
        lead_name: lead.name,
        preferred_society: lead.preferredSociety || 'Islamabad/Rawalpindi',
      },
      `⚡ New Lead Assigned: ${lead.name} • Asad Land Holdings`
    );
  } catch (emailErr) {
    console.error('[Lead Assignment Email Alert Error]:', emailErr);
  }

  // Dispatch Notification to Sales Agent and Management
  await createCRMNotification({
    userIds: [selectedAgent.id],
    notifyManagement: true,
    title: '⚡ New Lead Auto-Assigned',
    message: `Client "${lead.name}" (${lead.phone}) assigned to ${selectedAgent.name} via Round-Robin.`,
    type: 'LEAD',
    link: '/leads',
  });

  return updatedLead;
}

/**
 * 3. Manual Assignment or Reassignment by Super Admin / Sales Manager
 */
export async function reassignLeadManually({
  leadId,
  newAgentId,
  actorId,
  actorName,
  reason,
}: {
  leadId: string;
  newAgentId: string | null;
  actorId?: string;
  actorName?: string;
  reason?: string;
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { assignedAgent: true },
  });

  if (!lead) throw new Error('Lead not found');

  const oldAgentName = lead.assignedAgent?.name || 'Unassigned Pool';

  // If unassigning lead to Unassigned Pool
  if (!newAgentId || newAgentId === 'UNASSIGNED') {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        previousAgentId: lead.assignedAgentId || null,
        assignedAgentId: null,
        assignedAt: null,
        slaStatus: 'ON_TRACK',
      },
      include: {
        assignedAgent: true,
      },
    });

    await recordAuditLog({
      actorId,
      action: 'LEAD_MOVED_TO_UNASSIGNED_POOL',
      targetType: 'LEAD',
      targetId: leadId,
      beforeValue: { assignedTo: oldAgentName },
      afterValue: { assignedTo: 'Unassigned Pool', assignedBy: actorName || 'Admin', reason },
    });

    return updatedLead;
  }

  const newAgent = await prisma.user.findUnique({
    where: { id: newAgentId },
  });

  if (!newAgent) throw new Error('Target Agent not found');

  const now = new Date();

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      previousAgentId: lead.assignedAgentId || null,
      assignedAgentId: newAgent.id,
      assignedAt: now,
      slaStatus: 'ON_TRACK',
    },
    include: {
      assignedAgent: true,
    },
  });

  // Record Audit Log
  await recordAuditLog({
    actorId,
    action: 'LEAD_MANUALLY_REASSIGNED',
    targetType: 'LEAD',
    targetId: leadId,
    beforeValue: { assignedTo: oldAgentName },
    afterValue: { assignedTo: newAgent.name, assignedBy: actorName || 'Admin', reason },
  });

  // Send Email Alert to newly assigned agent
  try {
    await queueAndSendEmail(
      'lead-assigned-agent',
      newAgent.email,
      {
        first_name: newAgent.name.split(' ')[0],
        lead_name: lead.name,
        preferred_society: lead.preferredSociety || 'Kohistan Enclave / New City',
      },
      `⚡ Lead Assigned to You by Management: ${lead.name}`
    );
  } catch (e) {
    console.error('Failed to dispatch manual reassign email:', e);
  }

  // Create In-App Bell Notification for newly assigned agent
  try {
    await prisma.notification.create({
      data: {
        userId: newAgent.id,
        title: '👤 Lead Assigned by Management',
        message: `Lead "${lead.name}" assigned to you by ${actorName || 'Management'}.`,
        type: 'LEAD',
        link: '/leads',
        read: false,
      },
    });
  } catch (notifErr) {
    console.error('[In-App Notification Error]:', notifErr);
  }

  return updatedLead;
}

/**
 * 4. 24-Hour SLA / Inactivity Check & Auto-Reassignment Engine
 */
export async function checkAndEnforce24hLeadSLA() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find leads assigned > 24 hours ago that are still in 'NEW' stage (untouched)
  const breachedLeads = await prisma.lead.findMany({
    where: {
      stage: 'NEW',
      assignedAgentId: { not: null },
      assignedAt: { lt: twentyFourHoursAgo },
      slaStatus: { not: 'REASSIGNED' },
    },
    include: {
      assignedAgent: true,
    },
  });

  const reassignedResults: any[] = [];

  if (breachedLeads.length === 0) {
    return {
      breachedCount: 0,
      reassignedLeads: [],
      message: 'All assigned leads are within the 24-hour SLA window.',
    };
  }

  // Get active agents pool
  const allAgents = await getActiveSalesAgents();

  for (const lead of breachedLeads) {
    const oldAgent = lead.assignedAgent;
    // Filter agents pool to exclude the current inactive agent
    const candidateAgents = allAgents.filter((a) => a.id !== lead.assignedAgentId);
    const nextAgent = candidateAgents.length > 0 ? candidateAgents[0] : allAgents[0];

    if (!nextAgent) continue;

    const now = new Date();

    // Reassign lead to next agent
    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        previousAgentId: lead.assignedAgentId,
        assignedAgentId: nextAgent.id,
        assignedAt: now,
        slaStatus: 'BREACHED_24H',
      },
      include: {
        assignedAgent: true,
      },
    });

    // Record Audit Log
    await recordAuditLog({
      action: 'LEAD_AUTO_REASSIGNED_24H_INACTIVITY',
      targetType: 'LEAD',
      targetId: lead.id,
      beforeValue: {
        assignedTo: oldAgent?.name || 'Unknown',
        reason: '24-hour inactivity: No client contact made within 24h of assignment.',
      },
      afterValue: {
        reassignedTo: nextAgent.name,
        reassignedAt: now,
      },
    });

    // Send Alert to Super Admin & Managers
    try {
      const managers = await prisma.user.findMany({
        where: {
          role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
          status: 'ACTIVE',
        },
        select: { id: true, email: true, name: true },
      });

      for (const mgr of managers) {
        await queueAndSendEmail(
          'lead-sla-breach-manager',
          mgr.email,
          {
            first_name: mgr.name.split(' ')[0],
            lead_name: lead.name,
            agent_name: oldAgent?.name || 'Agent',
            new_agent_name: nextAgent.name,
          },
          `⚠️ 24h SLA Inactivity Alert: Lead "${lead.name}" Auto-Reassigned from ${oldAgent?.name || 'Agent'}`
        );

        // In-App Notification for Manager
        await prisma.notification.create({
          data: {
            userId: mgr.id,
            title: '⚠️ 24h SLA Lead Reassigned',
            message: `Lead "${lead.name}" reassigned from ${oldAgent?.name || 'Agent'} to ${nextAgent.name} (24h Inactivity).`,
            type: 'SYSTEM',
            link: '/leads',
            read: false,
          },
        }).catch(() => {});
      }

      // Also notify the new agent via Email
      await queueAndSendEmail(
        'lead-assigned-agent',
        nextAgent.email,
        {
          first_name: nextAgent.name.split(' ')[0],
          lead_name: lead.name,
          preferred_society: lead.preferredSociety || 'Priority Lead',
        },
        `🚨 URGENT: Lead "${lead.name}" Reassigned to You (24h Inactivity SLA Escalation)`
      );

      // In-App Notification for New Agent
      await prisma.notification.create({
        data: {
          userId: nextAgent.id,
          title: '🚨 SLA Lead Escalation Assigned',
          message: `Lead "${lead.name}" reassigned to you due to 24h SLA inactivity escalation.`,
          type: 'LEAD',
          link: '/leads',
          read: false,
        },
      }).catch(() => {});
    } catch (err) {
      console.error('SLA Notification Error:', err);
    }

    reassignedResults.push({
      leadId: lead.id,
      leadName: lead.name,
      previousAgent: oldAgent?.name,
      newAgent: nextAgent.name,
    });
  }

  return {
    breachedCount: breachedLeads.length,
    reassignedCount: reassignedResults.length,
    reassignedLeads: reassignedResults,
    message: `Successfully executed 24h SLA check. Reassigned ${reassignedResults.length} inactive lead(s) via Round-Robin.`,
  };
}
