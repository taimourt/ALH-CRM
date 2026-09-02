import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculatePropertyMatchScore } from '@/lib/property-matching';

export async function POST(request: Request) {
  try {
    const { leadId, preferences } = await request.json();

    let targetLead = preferences;

    if (leadId) {
      const dbLead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (dbLead) targetLead = dbLead;
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
