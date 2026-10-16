import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculatePropertyMatchScore } from '@/lib/property-matching';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const { leadId, preferences } = await request.json();

    let targetLead = preferences;

    if (leadId) {
      const dbLead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!dbLead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }

      if (isAgentOnly && dbLead.assignedAgentId !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You can only match properties for leads assigned to you' }, { status: 403 });
      }

      targetLead = dbLead;
    }

    if (!targetLead) {
      return NextResponse.json({ error: 'Lead preferences missing' }, { status: 400 });
    }

    const availableProperties = await prisma.property.findMany({
      where: { status: { in: ['AVAILABLE', 'RESERVED'] } },
      include: { society: true, agent: true },
    });

    const rankedMatches = availableProperties
      .map((property) => calculatePropertyMatchScore(targetLead, property))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      lead: targetLead,
      matches: rankedMatches,
      totalMatched: rankedMatches.length,
    });
  } catch (error) {
    console.error('Property match API error:', error);
    return NextResponse.json({ error: 'Matching calculation failed' }, { status: 500 });
  }
}

