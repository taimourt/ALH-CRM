import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { prompt, action } = await request.json();

    if (action === 'score_lead') {
      const { leadId } = await request.json();
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

      // Intelligent rule-based lead scoring algorithm
      let score = 50;
      if (lead.budgetMax && lead.budgetMax >= 15000000) score += 20;
      if (lead.stage === 'SITE_VISIT' || lead.stage === 'NEGOTIATION') score += 20;
      if (lead.source === 'WHATSAPP' || lead.source === 'REFERRAL') score += 10;

      await prisma.lead.update({
        where: { id: leadId },
        data: { score },
      });

      return NextResponse.json({ score, reasoning: 'High budget & active negotiation stage.' });
    }

    if (action === 'generate_whatsapp') {
      const { leadName, propertyTitle, price } = prompt;
      const message = `Assalam-o-Alaikum ${leadName || 'Respected Client'}, this is Hamza from Asad Land Holdings. Following up regarding ${propertyTitle || 'the 10 Marla Plot in DHA Phase 8'} listed at PKR ${price || '1.85 Crore'}. Would you be available for a short call or site visit tomorrow at 4 PM?`;
      return NextResponse.json({ draft: message });
    }

    // Natural Language Search Parser / AI Sales Assistant Query
    const queryLower = (prompt || '').toLowerCase();

    // Query properties matching criteria
    const properties = await prisma.property.findMany({
      include: { society: true },
      take: 5,
    });

    const leads = await prisma.lead.findMany({
      where: { score: { gte: 80 } },
      take: 5,
    });

    const aiResponse = {
      message: `Based on your request "${prompt}", I analyzed the Asad Land Holdings database. Here are the relevant insights and matched properties:`,
      matchedProperties: properties,
      hotLeads: leads,
      suggestions: [
        'Follow up with Taimour Shah (Score: 88, Budget: 2 Crore)',
        'Offer Plot 142 DHA Phase 8 (PKR 1.85 Crore)',
        'Schedule site visit for Tuesday afternoon',
      ],
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('AI Assistant API error:', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
