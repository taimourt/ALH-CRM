import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triggerWorkflow } from '@/lib/automation';
import { recordAuditLog } from '@/lib/audit';
import { assignLeadRoundRobin } from '@/lib/lead-assignment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[GOOGLE SHEETS REALTIME WEBHOOK]:', JSON.stringify(body));

    let name = body.name || body.clientName || body['Client Name'] || 'Google Sheets Lead';
    let phone = body.phone || body.phoneNumber || body['Phone Number'] || body['Phone'] || '';
    let email = body.email || body['Email'] || '';
    let preferredSociety = body.preferredSociety || body.society || body['Preferred Society'] || 'Kohistan Enclave';
    let preferredSize = body.preferredSize || body.size || body['Preferred Size'] || '10 MARLA';
    let budgetMax = parseFloat(body.budgetMax || body.budget || body['Max Budget'] || '20000000');
    let notes = body.notes || body['Notes'] || 'Pushed in real-time from Google Sheet';

    if (!phone) {
      return NextResponse.json({ status: 'error', error: 'Phone number is required' }, { status: 400 });
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('92')) cleanPhone = '0' + cleanPhone.substring(2);

    let lead = await prisma.lead.findFirst({
      where: { phone: cleanPhone },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name,
          phone: cleanPhone,
          email: email || null,
          source: 'GOOGLE_SHEETS',
          stage: 'NEW',
          score: 75,
          preferredSociety,
          preferredSize,
          budgetMax,
          notes,
          assignedAt: new Date(),
          slaStatus: 'ON_TRACK',
        },
      });

      // Distribute fairly via Round-Robin & email assigned sales agent
      try {
        await assignLeadRoundRobin(lead.id);
      } catch (assignErr) {
        console.error('Round-robin error for Google Sheets lead:', assignErr);
      }

      await triggerWorkflow('NEW_LEAD_CREATED', { leadId: lead.id });

      await recordAuditLog({
        action: 'GOOGLE_SHEETS_REALTIME_LEAD_INGESTED',
        targetType: 'LEAD',
        targetId: lead.id,
        afterValue: { source: 'GOOGLE_SHEETS', leadName: name, phone: cleanPhone },
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Google Sheet row ingested instantly into CRM',
      leadId: lead.id,
      leadName: lead.name,
      stage: lead.stage,
    });
  } catch (error: any) {
    console.error('Google Sheets Webhook Error:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
