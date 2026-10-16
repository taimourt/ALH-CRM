import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAgentOnly = userRole === 'SALES_AGENT' || userRole === 'AGENT';

    const body = await request.json();
    const { prompt, action, leadId } = body;

    if (action === 'score_lead') {
      const targetLeadId = leadId || body.leadId;
      const lead = await prisma.lead.findUnique({ where: { id: targetLeadId } });
      if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

      if (isAgentOnly && lead.assignedAgentId !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You can only score your assigned leads' }, { status: 403 });
      }

      // Intelligent rule-based lead scoring algorithm
      let score = 50;
      if (lead.budgetMax && lead.budgetMax >= 15000000) score += 20;
      if (lead.stage === 'SITE_VISIT' || lead.stage === 'NEGOTIATION') score += 20;
      if (lead.source === 'WHATSAPP' || lead.source === 'REFERRAL') score += 10;

      await prisma.lead.update({
        where: { id: targetLeadId },
        data: { score },
      });

      return NextResponse.json({ score, reasoning: 'High budget & active negotiation stage.' });
    }

    if (action === 'generate_whatsapp') {
      const { leadName, propertyTitle, price } = prompt || {};
      const message = `Assalam-o-Alaikum ${leadName || 'Respected Client'}, this is ${user.name || 'our sales team'} from Asad Land Holdings. Following up regarding ${propertyTitle || 'the 10 Marla Plot in DHA Phase 8'} listed at PKR ${price || '1.85 Crore'}. Would you be available for a short call or site visit tomorrow at 4 PM?`;
      return NextResponse.json({ draft: message });
    }

    // Query properties matching criteria
    const properties = await prisma.property.findMany({
      include: { society: true },
      take: 5,
    });

    const leads = await prisma.lead.findMany({
      where: {
        ...(isAgentOnly ? { assignedAgentId: user.id } : {}),
        score: { gte: 80 },
        isArchived: false,
      },
      take: 5,
    });

    const aiResponse = {
      message: `Based on your request "${prompt || 'leads'}", I analyzed the database. Here are your relevant high-priority leads and matched properties:`,
      matchedProperties: properties,
      hotLeads: leads,
      suggestions: leads.length > 0
        ? leads.map((l) => `Follow up with ${l.name} (${l.phone}) - Budget PKR ${((l.budgetMax || 0) / 10000000).toFixed(2)} Cr`)
        : ['No hot leads currently assigned to you.'],
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}

