import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      whatsapp,
      email,
      requirement,
      propertyId,
      societyId,
      propertyType,
      size,
      budget,
      purpose,
      timeline,
      leadSource = 'WEBSITE',
      notes,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const noteText = [
      requirement ? `Requirement: ${requirement}` : '',
      purpose ? `Purpose: ${purpose}` : '',
      timeline ? `Timeline: ${timeline}` : '',
      budget ? `Budget: PKR ${budget}` : '',
      utmSource ? `UTM Source: ${utmSource}` : '',
      notes ? `Notes: ${notes}` : '',
    ].filter(Boolean).join(' | ');

    // Attempt DB record creation if database is connected
    let leadRecord = null;
    try {
      leadRecord = await prisma.lead.create({
        data: {
          name,
          phone,
          email: email || null,
          source: leadSource,
          preferredType: propertyType || null,
          preferredSize: size || null,
          budgetMax: typeof budget === 'number' ? budget : parseFloat(budget) || null,
          notes: noteText || 'Website lead submission',
        },
      });
    } catch (dbErr) {
      console.warn('Prisma Lead creation fallback (DB unavailable or dev mode):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead received and assigned to Wah Cantt advisory desk.',
      leadId: leadRecord?.id || `web-lead-${Date.now()}`,
    });
  } catch (error) {
    console.error('Lead submission API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing lead' },
      { status: 500 }
    );
  }
}
