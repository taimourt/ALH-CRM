import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triggerWorkflow } from '@/lib/automation';
import { recordAuditLog } from '@/lib/audit';
import { assignLeadRoundRobin } from '@/lib/lead-assignment';

// Meta Webhook Verification Handshake (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const EXPECTED_TOKEN = process.env.META_VERIFY_TOKEN || 'alh_meta_verify_2026';

  if (mode === 'subscribe' && token === EXPECTED_TOKEN) {
    console.log('[META WEBHOOK] Verification challenge passed.');
    return new Response(challenge || 'OK', { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// Inbound Meta Lead Gen Webhook (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[FACEBOOK ADS WEBHOOK RECEIVED]:', JSON.stringify(body));

    let name = body.name || body.fullName || '';
    let phone = body.phone || body.phoneNumber || '';
    let email = body.email || '';
    let preferredSociety = body.preferredSociety || body.society || 'New City (Phase 2 & Paradise)';
    let preferredSize = body.preferredSize || body.size || '5 MARLA';
    let budgetMax = body.budgetMax ? parseFloat(body.budgetMax) : 18500000;
    let notes = body.notes || 'Ingested via Facebook / Instagram Lead Ads Webhook';

    // Parse Meta standard field_data array if present
    if (Array.isArray(body.field_data)) {
      body.field_data.forEach((field: any) => {
        const fieldName = field.name?.toLowerCase() || '';
        const val = Array.isArray(field.values) ? field.values[0] : field.values || '';
        if (fieldName.includes('full_name') || fieldName.includes('name')) name = val;
        if (fieldName.includes('phone') || fieldName.includes('mobile')) phone = val;
        if (fieldName.includes('email')) email = val;
        if (fieldName.includes('society') || fieldName.includes('project')) preferredSociety = val;
        if (fieldName.includes('budget') || fieldName.includes('size')) notes += ` | ${fieldName}: ${val}`;
      });
    }

    if (!name) name = 'Facebook Lead Ad Prospect';
    if (!phone) phone = '0321' + Math.floor(1000000 + Math.random() * 9000000);

    // Sanitize phone
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
          source: 'FACEBOOK_ADS',
          stage: 'NEW',
          score: 80,
          preferredSociety,
          preferredSize,
          budgetMax,
          notes: `${notes} (Ad Form: ${body.form_id || body.ad_id || 'Lead Form'})`,
          assignedAt: new Date(),
          slaStatus: 'ON_TRACK',
        },
      });

      // Distribute fairly via Round-Robin & email assigned sales agent
      try {
        await assignLeadRoundRobin(lead.id);
      } catch (assignErr) {
        console.error('Round-robin error for Facebook lead:', assignErr);
      }

      await triggerWorkflow('NEW_LEAD_CREATED', { leadId: lead.id });

      await recordAuditLog({
        action: 'WEBHOOK_LEAD_INGESTED',
        targetType: 'LEAD',
        targetId: lead.id,
        afterValue: { source: 'FACEBOOK_ADS', leadName: name, phone: cleanPhone },
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Meta Lead processed successfully into pipeline',
      leadId: lead.id,
      leadName: lead.name,
      stage: lead.stage,
    });
  } catch (error: any) {
    console.error('Facebook Ads Webhook Error:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
