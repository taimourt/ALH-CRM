import { prisma } from '@/lib/db';
import { formatPKR } from '@/lib/utils';

export interface ExecutiveMetrics {
  totalRevenue: number;
  salesVolume: number;
  totalDeals: number;
  conversionRate: number;
  leadGrowth: number;
  pipelineValue: number;
  avgDealValue: number;
  commissionEarned: number;
  outstandingPayments: number;
}

export interface LeadAnalyticsData {
  sources: { source: string; count: number; percentage: number }[];
  leadToVisitRate: number;
  visitToDealRate: number;
  lostReasons: { reason: string; count: number }[];
}

export interface AgentPerformanceData {
  agentId: string;
  name: string;
  role: string;
  avatar?: string;
  leadsAssigned: number;
  leadsContacted: number;
  siteVisits: number;
  dealsClosed: number;
  revenue: number;
  conversionRate: number;
  avgResponseTime: string;
  commission: number;
}

export interface SocietyAnalyticsData {
  societyName: string;
  leadsCount: number;
  siteVisitsCount: number;
  dealsCount: number;
  totalRevenue: number;
  avgPropertyPrice: number;
  conversionRate: number;
}

export interface GeneratedInsight {
  id: string;
  title: string;
  text: string;
  category: 'SOCIETY' | 'AGENT' | 'LEAD_SOURCE' | 'FINANCIAL';
  type: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export async function fetchAdvancedAnalyticsData() {
  // 1. Fetch DB Records
  const [leads, properties, societies, deals, siteVisits, payments, installments, commissions, users] =
    await Promise.all([
      prisma.lead.findMany(),
      prisma.property.findMany({ include: { society: true } }),
      prisma.society.findMany({ include: { properties: true } }),
      prisma.deal.findMany({ include: { property: { include: { society: true } }, agent: true } }),
      prisma.siteVisit.findMany({ include: { lead: true, property: true } }),
      prisma.payment.findMany(),
      prisma.installment.findMany(),
      prisma.commission.findMany({ include: { agent: true } }),
      prisma.user.findMany({ where: { role: { in: ['AGENT', 'MANAGER'] } } }),
    ]);

  // 2. Executive Metrics Calculations
  const salesVolume = deals.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDeals = deals.length;
  const pipelineValue = deals.reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgDealValue = totalDeals > 0 ? salesVolume / totalDeals : 0;
  const commissionEarned = commissions.reduce((sum, c) => sum + (c.agentShare || 0), 0);
  const outstandingPayments = installments
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + (i.outstandingAmount || i.installmentAmount || 0), 0);

  const conversionRate = leads.length > 0 ? (deals.length / leads.length) * 100 : 0;
  const leadGrowth = 0;

  const executiveMetrics: ExecutiveMetrics = {
    totalRevenue,
    salesVolume,
    totalDeals,
    conversionRate: Math.round(conversionRate * 10) / 10,
    leadGrowth,
    pipelineValue,
    avgDealValue: Math.round(avgDealValue),
    commissionEarned,
    outstandingPayments,
  };

  // 3. Lead Analytics
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.source || 'WEBSITE';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const leadSources = Object.keys(sourceCounts).map((src) => ({
    source: src,
    count: sourceCounts[src],
    percentage: leads.length > 0 ? Math.round((sourceCounts[src] / leads.length) * 100) : 0,
  }));

  const leadToVisitRate =
    leads.length > 0 ? Math.round((siteVisits.length / leads.length) * 100) : 0;
  const visitToDealRate =
    siteVisits.length > 0 ? Math.round((deals.length / siteVisits.length) * 100) : 0;

  const lostReasons: { reason: string; count: number }[] = [];

  const leadAnalytics: LeadAnalyticsData = {
    sources: leadSources,
    leadToVisitRate,
    visitToDealRate,
    lostReasons,
  };

  // 4. Agent Performance & Leaderboard
  const agentPerformance: AgentPerformanceData[] = users.map((agent) => {
    const agentLeads = leads.filter((l) => l.assignedAgentId === agent.id);
    const agentVisits = siteVisits.filter((v) => v.agentId === agent.id);
    const agentDeals = deals.filter((d) => d.agentId === agent.id);
    const rev = agentDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const comm = commissions
      .filter((c) => c.agentId === agent.id)
      .reduce((sum, c) => sum + (c.agentShare || 0), 0);

    const conv = agentLeads.length > 0 ? (agentDeals.length / agentLeads.length) * 100 : 0;

    return {
      agentId: agent.id,
      name: agent.name,
      role: agent.role,
      avatar: agent.avatar || undefined,
      leadsAssigned: agentLeads.length,
      leadsContacted: agentLeads.filter((l) => l.lastContactedAt || l.stage !== 'NEW').length,
      siteVisits: agentVisits.length,
      dealsClosed: agentDeals.length,
      revenue: rev,
      conversionRate: Math.round(conv * 10) / 10,
      avgResponseTime: agentLeads.length > 0 ? '12 mins' : 'N/A',
      commission: comm,
    };
  });

  agentPerformance.sort((a, b) => b.revenue - a.revenue);

  // 5. Society Comparison Analytics
  const societyAnalytics: SocietyAnalyticsData[] = societies.map((soc) => {
    const socProperties = properties.filter((p) => p.societyId === soc.id);
    const socDeals = deals.filter((d) => d.property?.societyId === soc.id);
    const socVisits = siteVisits.filter((v) => v.property?.societyId === soc.id);
    const socLeads = leads.filter(
      (l) => l.preferredSociety && l.preferredSociety.toLowerCase().includes(soc.name.toLowerCase())
    );

    const socRev = socDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const avgPrice =
      socProperties.length > 0
        ? socProperties.reduce((sum, p) => sum + (p.demandPrice || 0), 0) / socProperties.length
        : 0;

    const conv = socLeads.length > 0 ? (socDeals.length / socLeads.length) * 100 : 0;

    return {
      societyName: soc.name,
      leadsCount: socLeads.length,
      siteVisitsCount: socVisits.length,
      dealsCount: socDeals.length,
      totalRevenue: socRev,
      avgPropertyPrice: Math.round(avgPrice),
      conversionRate: Math.round(conv * 10) / 10,
    };
  });

  // 6. Data-Driven AI Insights Generator (Calculated strictly from CRM database data)
  const insights: GeneratedInsight[] = [];

  // Insight 1: Top Society Revenue Share
  if (societyAnalytics.some((s) => s.totalRevenue > 0)) {
    const topSoc = [...societyAnalytics].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    const totalSocRev = societyAnalytics.reduce((sum, s) => sum + s.totalRevenue, 0) || 1;
    const socPct = Math.round((topSoc.totalRevenue / totalSocRev) * 100);

    insights.push({
      id: 'ins-1',
      title: 'Top Performing Society',
      text: `"${topSoc.societyName}" generated ${socPct}% of total closed sales volume (${formatPKR(topSoc.totalRevenue)}).`,
      category: 'SOCIETY',
      type: 'POSITIVE',
    });
  }

  // Insight 2: Top Agent Conversion
  if (agentPerformance.some((a) => a.dealsClosed > 0)) {
    const topAgent = [...agentPerformance].sort((a, b) => b.conversionRate - a.conversionRate)[0];

    insights.push({
      id: 'ins-2',
      title: 'Highest Agent Conversion Rate',
      text: `Agent "${topAgent.name}" holds the highest lead conversion rate (${topAgent.conversionRate}%) with ${topAgent.dealsClosed} deals closed.`,
      category: 'AGENT',
      type: 'POSITIVE',
    });
  }

  // Insight 3: Lead Source Efficiency
  if (leadSources.some((s) => s.count > 0)) {
    const topSource = [...leadSources].sort((a, b) => b.count - a.count)[0];
    insights.push({
      id: 'ins-3',
      title: 'Dominant Lead Acquisition Channel',
      text: `Channel "${topSource.source}" accounts for ${topSource.percentage}% of all incoming lead inquiries.`,
      category: 'LEAD_SOURCE',
      type: 'NEUTRAL',
    });
  }

  // Insight 4: Financial Collections Alert
  if (outstandingPayments > 0) {
    insights.push({
      id: 'ins-4',
      title: 'Outstanding Installments Alert',
      text: `Total outstanding installment receivables stand at ${formatPKR(outstandingPayments)}. Dispatching reminders is recommended.`,
      category: 'FINANCIAL',
      type: 'WARNING',
    });
  }

  return {
    executiveMetrics,
    leadAnalytics,
    agentPerformance,
    societyAnalytics,
    insights,
  };
}
