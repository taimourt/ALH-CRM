import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import { createCRMNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, reason, notes, nurtureBucket } = body;

    if (!leadId || !reason) {
      return NextResponse.json({ error: 'Lead ID and Disqualification Reason are required' }, { status: 400 });
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { assignedAgent: true },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Role check: Sales agents can only disqualify their own leads; Admins & Managers can disqualify any
    const isAgentOnly = user.role === 'SALES_AGENT' || user.role === 'AGENT';
    if (isAgentOnly && existingLead.assignedAgentId && existingLead.assignedAgentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only disqualify leads assigned to you.' }, { status: 403 });
    }

    // Auto-map nurture bucket if not explicitly provided
    let mappedBucket = nurtureBucket;
    if (!mappedBucket) {
      switch (reason) {
        case 'BUDGET_MISMATCH':
          mappedBucket = 'AFFORDABLE_PROJECTS';
          break;
        case 'NOT_INTERESTED_COLD':
          mappedBucket = 'LONG_TERM_90D';
          break;
        case 'LOOKING_FOR_RENT':
          mappedBucket = 'RENTAL_PARTNER';
          break;
        case 'WRONG_NUMBER_SPAM':
          mappedBucket = 'JUNK_EXCLUSION';
          break;
        case 'COMPETITOR_AGENT':
          mappedBucket = 'BROKER_NETWORK';
          break;
        default:
          mappedBucket = 'GENERAL_ARCHIVE';
      }
    }

    const previousAgentName = existingLead.assignedAgent?.name || 'Unassigned';

    // Update Lead: Mark as DISQUALIFIED, archive, set reason, unassign from agent
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage: 'DISQUALIFIED',
        isArchived: true,
        disqualifiedReason: reason,
        disqualifiedNotes: notes || null,
        disqualifiedAt: new Date(),
        disqualifiedById: user.id,
        nurtureBucket: mappedBucket,
        assignedAgentId: null,
        assignedAt: null,
        slaStatus: 'ON_TRACK',
      },
    });

    // Record Audit Log
    await recordAuditLog({
      action: 'LEAD_DISQUALIFIED',
      targetType: 'LEAD',
      targetId: leadId,
      beforeValue: { stage: existingLead.stage, assignedAgent: previousAgentName },
      afterValue: { stage: 'DISQUALIFIED', reason, nurtureBucket: mappedBucket, notes },
    });

    // Dispatch Notification to Management
    await createCRMNotification({
      notifyManagement: true,
      title: '❄️ Lead Archived / Disqualified',
      message: `Lead "${existingLead.name}" was archived by ${user.name} (Reason: ${reason.replace(/_/g, ' ')}).`,
      type: 'LEAD',
      link: '/leads?tab=ARCHIVE',
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: `Lead successfully moved to ${mappedBucket.replace(/_/g, ' ')} archive.`,
    });
  } catch (error: any) {
    console.error('Disqualify lead error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to disqualify lead' }, { status: 500 });
  }
}

// Reactivate / Restore Archived Lead
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadIdParam = searchParams.get('leadId');
    const body = await request.json().catch(() => ({}));
    const leadId = leadIdParam || body.leadId;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Restore lead to active pipeline (Stage: NEW)
    const restoredLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage: 'NEW',
        isArchived: false,
        disqualifiedReason: null,
        disqualifiedNotes: null,
        disqualifiedAt: null,
        disqualifiedById: null,
        nurtureBucket: null,
        slaStatus: 'ON_TRACK',
      },
    });

    // Record Audit Log
    await recordAuditLog({
      action: 'LEAD_REACTIVATED',
      targetType: 'LEAD',
      targetId: leadId,
      beforeValue: { stage: existingLead.stage, reason: existingLead.disqualifiedReason },
      afterValue: { stage: 'NEW', isArchived: false },
    });

    // Dispatch Notification
    await createCRMNotification({
      notifyManagement: true,
      title: '⚡ Lead Reactivated to Active Pipeline',
      message: `Lead "${restoredLead.name}" has been reactivated into the active sales pipeline by ${user.name}.`,
      type: 'LEAD',
      link: '/leads',
    });

    return NextResponse.json({
      success: true,
      lead: restoredLead,
      message: 'Lead restored to active pipeline successfully.',
    });
  } catch (error: any) {
    console.error('Reactivate lead error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to reactivate lead' }, { status: 500 });
  }
}
