import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { queueAndSendEmail } from '@/lib/email-service';

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Email templates API error:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, subject, bodyHtml, enabled } = body;

    const updated = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(subject !== undefined ? { subject } : {}),
        ...(bodyHtml !== undefined ? { bodyHtml } : {}),
        ...(enabled !== undefined ? { enabled } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update email template error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateSlug, testEmail } = body;

    const result = await queueAndSendEmail(
      templateSlug || 'user-invitation',
      testEmail || 'asad@asadlandholdings.com',
      {
        first_name: 'Test User',
        company_name: 'Asad Land Holdings',
        role_name: 'Sales Agent',
        invitation_link: 'http://localhost:3000/login?invite=test_token_123',
      },
      '[TEST EMAIL] Template Verification'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
