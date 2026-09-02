import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateCommissionSplit } from '@/lib/financials';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'SUPER_ADMIN';
  const userId = searchParams.get('userId');

  try {
    const whereConditions: any = {};
    if (role === 'AGENT' && userId) {
      whereConditions.agentId = userId;
    }

    const rawCommissions = await prisma.commission.findMany({
      where: whereConditions,
      include: {
        deal: { include: { property: { include: { society: true } } } },
        agent: true,
        manager: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Role-based security masking: If role is AGENT, hide companyRetained and managerShare
    const commissions = rawCommissions.map((c) => {
      if (role === 'AGENT') {
        return {
          id: c.id,
          dealId: c.dealId,
          dealTitle: c.deal?.title,
          agentName: c.agent?.name,
          agentShare: c.agentShare,
          status: c.status,
          paidAt: c.paidAt,
          createdAt: c.createdAt,
        };
      }
      return c;
    });

    return NextResponse.json(commissions);
  } catch (error) {
    console.error('Commissions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, agentId, managerId, dealAmount, commissionRate, agentSplitPct, managerSplitPct } = body;

    const breakdown = calculateCommissionSplit(
      parseFloat(dealAmount) || 10000000,
      parseFloat(commissionRate) || 1.0,
      parseFloat(agentSplitPct) || 60,
      parseFloat(managerSplitPct) || 15
    );

    const commission = await prisma.commission.create({
      data: {
        dealId,
        agentId,
        managerId: managerId || null,
        totalDealCommission: breakdown.totalCompanyCommission,
        companyShare: breakdown.totalCompanyCommission,
        agentShare: breakdown.agentShare,
        managerShare: breakdown.managerShare,
        companyRetained: breakdown.companyRetained,
        amount: breakdown.agentShare,
        percentage: parseFloat(commissionRate) || 1.0,
        status: body.status || 'APPROVED',
      },
    });

    return NextResponse.json(commission);
  } catch (error) {
    console.error('Create Commission error:', error);
    return NextResponse.json({ error: 'Failed to calculate commission' }, { status: 500 });
  }
}
