import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      activityLogs,
      auditLogs,
      recentLeads,
      recentPayments,
      recentDeals,
      recentVisits,
      recentTasks,
    ] = await Promise.all([
      prisma.activityLog.findMany({
        include: { user: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.auditLog.findMany({
        include: { actor: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.lead.findMany({
        include: { assignedAgent: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.payment.findMany({
        include: {
          customer: { select: { id: true, name: true } },
          deal: { select: { id: true, title: true } },
          property: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.deal.findMany({
        include: {
          agent: { select: { id: true, name: true } },
          lead: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      }),
      prisma.siteVisit.findMany({
        include: {
          lead: { select: { id: true, name: true } },
          agent: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.task.findMany({
        where: { status: 'COMPLETED' },
        include: { assignedTo: { select: { id: true, name: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 6,
      }),
    ]);

    // Construct unified feed
    const items: Array<{
      id: string;
      type: 'PAYMENT' | 'LEAD' | 'DEAL' | 'VISIT' | 'TASK' | 'SYSTEM' | 'AUDIT';
      title: string;
      description: string;
      category: string;
      actorName: string;
      actorRole: string;
      timestamp: string;
      link?: string;
      badgeColor: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'indigo';
    }> = [];

    // 1. Activity Logs
    activityLogs.forEach((log) => {
      items.push({
        id: `act-${log.id}`,
        type: 'SYSTEM',
        title: log.action.replace(/_/g, ' '),
        description: log.description,
        category: log.entityType,
        actorName: log.user?.name || 'System Automation',
        actorRole: log.user?.role || 'SYSTEM',
        timestamp: log.createdAt.toISOString(),
        badgeColor: 'indigo',
      });
    });

    // 2. Audit Logs
    auditLogs.forEach((log) => {
      items.push({
        id: `audit-${log.id}`,
        type: 'AUDIT',
        title: log.action.replace(/_/g, ' '),
        description: `${log.targetType} record modified by ${log.actor?.name || 'Admin'}`,
        category: log.targetType,
        actorName: log.actor?.name || 'Admin',
        actorRole: log.actor?.role || 'SUPER_ADMIN',
        timestamp: log.createdAt.toISOString(),
        badgeColor: 'blue',
      });
    });

    // 3. Recent Payments
    recentPayments.forEach((p) => {
      items.push({
        id: `pay-${p.id}`,
        type: 'PAYMENT',
        title: `Payment Received: PKR ${(p.amount || 0).toLocaleString()}`,
        description: `Payment recorded via ${p.paymentMethod || 'Bank Transfer'} for ${
          p.property?.title || p.deal?.title || 'Property Token'
        } (${p.customer?.name || 'Client'})`,
        category: 'Finance',
        actorName: 'Accounts / System',
        actorRole: 'ACCOUNTS',
        timestamp: p.paidAt ? p.paidAt.toISOString() : p.createdAt.toISOString(),
        link: '/payments',
        badgeColor: 'emerald',
      });
    });

    // 4. Recent Inbound Leads
    recentLeads.forEach((l) => {
      items.push({
        id: `lead-${l.id}`,
        type: 'LEAD',
        title: `New Lead Ingestion: ${l.name}`,
        description: `Inbound inquiry via ${l.source || 'Website'} (${l.phone}) • Assigned to ${
          l.assignedAgent?.name || 'Round-Robin Pool'
        }`,
        category: 'Lead Gen',
        actorName: l.assignedAgent?.name || 'Round-Robin',
        actorRole: 'SALES_AGENT',
        timestamp: l.createdAt.toISOString(),
        link: '/leads',
        badgeColor: 'blue',
      });
    });

    // 5. Recent Deals
    recentDeals.forEach((d) => {
      items.push({
        id: `deal-${d.id}`,
        type: 'DEAL',
        title: `Deal Stage: ${d.title}`,
        description: `Deal progressed to ${d.stage.replace(/_/g, ' ')} for PKR ${(
          d.amount || 0
        ).toLocaleString()} by ${d.agent?.name || 'Agent'}`,
        category: 'Pipeline',
        actorName: d.agent?.name || 'Sales Agent',
        actorRole: 'SALES_AGENT',
        timestamp: d.updatedAt.toISOString(),
        link: '/deals',
        badgeColor: d.stage === 'CLOSED_WON' ? 'emerald' : 'purple',
      });
    });

    // 6. Recent Site Visits
    recentVisits.forEach((v) => {
      items.push({
        id: `visit-${v.id}`,
        type: 'VISIT',
        title: `Site Visit: ${v.property?.title || 'Society Tour'}`,
        description: `Visit scheduled with ${v.lead?.name || 'Client'} by ${v.agent?.name || 'Agent'} (${
          v.status || 'SCHEDULED'
        })`,
        category: 'Operations',
        actorName: v.agent?.name || 'Field Agent',
        actorRole: 'SALES_AGENT',
        timestamp: v.createdAt.toISOString(),
        link: '/site-visits',
        badgeColor: 'amber',
      });
    });

    // 7. Completed Tasks
    recentTasks.forEach((t) => {
      items.push({
        id: `task-${t.id}`,
        type: 'TASK',
        title: `Task Completed: ${t.title}`,
        description: `Follow-up marked completed by ${t.assignedTo?.name || 'Agent'}`,
        category: 'Tasks',
        actorName: t.assignedTo?.name || 'Agent',
        actorRole: 'SALES_AGENT',
        timestamp: t.updatedAt.toISOString(),
        link: '/tasks',
        badgeColor: 'emerald',
      });
    });

    // Sort by timestamp descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Deduplicate by ID
    const uniqueItems = items.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

    return NextResponse.json(uniqueItems.slice(0, 25));
  } catch (error) {
    console.error('Activities API error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity timeline' }, { status: 500 });
  }
}
