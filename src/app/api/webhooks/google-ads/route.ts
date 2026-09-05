import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triggerWorkflow } from '@/lib/automation';
import { recordAuditLog } from '@/lib/audit';
import { assignLeadRoundRobin } from '@/lib/lead-assignment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[GOOGLE ADS WEBHOOK RECEIVED]:', JSON.stringify(body));

    // Support both Google Ads standard webhook payload and direct JSON
    let name = body.name || body.fullName || '';
    let phone = body.phone || body.phoneNumber || '';
    let email = body.email || '';
    let preferredSociety = body.preferredSociety || body.society || 'Kohistan Enclave';
    let preferredSize = body.preferredSize || body.size || '10 MARLA';
    let budgetMax = body.budgetMax ? parseFloat(body.budgetMax) : 25000000;
    let notes = body.notes || 'Ingested via Google Ads Lead Extension Webhook';

    // Parse Google Ads user_column_data array if present
    if (Array.isArray(body.user_column_data)) {
      body.user_column_data.forEach((col: any) => {
        const colId = col.column_id?.toUpperCase() || '';
        const colVal = col.string_value || '';
        if (colId.includes('FULL_NAME') || colId.includes('NAME')) name = colVal;
        if (colId.includes('PHONE')) phone = colVal;
        if (colId.includes('EMAIL')) email = colVal;
        if (colId.includes('SOCIETY') || colId.includes('LOCATION')) preferredSociety = colVal;
        if (colId.includes('SIZE') || colId.includes('BUDGET')) notes += ` | ${colId}: ${colVal}`;
      });
    }

    if (!name) name = 'Google Ads Inquiry';
    if (!phone) phone = '0300' + Math.floor(1000000 + Math.random() * 9000000);

    // Sanitize phone number (Pakistan format)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('92')) cleanPhone = '0' + cleanPhone.substring(2);

    // Check duplicate
    let lead = await prisma.lead.findFirst({
      where: { phone: cleanPhone },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name,
          phone: cleanPhone,
          email: email || null,
          source: 'GOOGLE_ADS',
          stage: 'NEW',
          score: 85, // Higher intent for paid search
          preferredSociety,
          preferredSize,
          budgetMax,
          notes: `${notes} (Campaign: ${body.campaign_id || body.campaignName || 'Search Campaign'})`,
          assignedAgentId: null,
          assignedAt: null,
          slaStatus: 'ON_TRACK',
        },
      });

      // Distribute fairly via Round-Robin & email assigned sales agent
      try {
        await assignLeadRoundRobin(lead.id);
      } catch (assignErr) {
        console.error('Round-robin error for Google Ads lead:', assignErr);
      }

      // Trigger workflow (WhatsApp greeting, SMS notification, Task)
      await triggerWorkflow('NEW_LEAD_CREATED', { leadId: lead.id });

      await recordAuditLog({
        action: 'WEBHOOK_LEAD_INGESTED',
        targetType: 'LEAD',
        targetId: lead.id,
        afterValue: { source: 'GOOGLE_ADS', leadName: name, phone: cleanPhone },
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Lead processed successfully from Google Ads',
      leadId: lead.id,
      leadName: lead.name,
      stage: lead.stage,
    });
  } catch (error: any) {
    console.error('Google Ads Webhook Error:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
