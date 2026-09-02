import { prisma } from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { syncGoogleSheetsLeads, DEFAULT_GOOGLE_SHEET_URL } from '@/lib/google-sheets';

export type AutomationEvent = 'NEW_LEAD_CREATED' | 'SITE_VISIT_COMPLETED' | 'PAYMENT_DUE_3_DAYS' | 'GOOGLE_SHEETS_SYNC';

export interface AutomationPayload {
  leadId?: string;
  visitId?: string;
  installmentId?: string;
  userId?: string;
  sheetUrl?: string;
}

export async function triggerWorkflow(event: AutomationEvent, payload: AutomationPayload) {
  console.log(`[AUTOMATION ENGINE] Triggered event "${event}"`, payload);

  const results: any[] = [];

  try {
    if (event === 'NEW_LEAD_CREATED' && payload.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: payload.leadId } });
      if (!lead) return;

      // 1. Auto-assign agent if unassigned
      let agentId = lead.assignedAgentId;
      if (!agentId) {
        const defaultAgent = await prisma.user.findFirst({ where: { role: 'AGENT' } });
        if (defaultAgent) {
          agentId = defaultAgent.id;
          await prisma.lead.update({ where: { id: lead.id }, data: { assignedAgentId: agentId } });
        }
      }

      // 2. Send WhatsApp Greeting Message
      const greetingText = `Assalam-o-Alaikum ${lead.name}! Thank you for contacting Asad Land Holdings. Our property advisor has received your inquiry for ${lead.preferredSociety || 'plots in Islamabad'} and will contact you shortly.`;
      const waRes = await sendWhatsAppMessage({ toPhone: lead.phone, messageText: greetingText });

      await prisma.communication.create({
        data: {
          type: 'WHATSAPP',
          channel: 'WHATSAPP',
          direction: 'OUTBOUND',
          summary: 'Auto-reply WhatsApp Greeting Message',
          messageText: greetingText,
          status: waRes.status,
          leadId: lead.id,
          agentId: agentId || 'system',
        },
      });

      // 3. Create 24h Follow-up Task
      const task = await prisma.task.create({
        data: {
          title: `Follow up with new lead ${lead.name}`,
          description: `Call ${lead.name} (${lead.phone}) regarding ${lead.preferredSize || '10 Marla'} in ${lead.preferredSociety || 'DHA Phase 8'}.`,
          dueDate: new Date(Date.now() + 86400000), // 24h
          priority: 'HIGH',
          status: 'PENDING',
          assignedToId: agentId || 'system',
          leadId: lead.id,
        },
      });

      // 4. Notify Manager
      const manager = await prisma.user.findFirst({ where: { role: 'MANAGER' } });
      if (manager) {
        await prisma.notification.create({
          data: {
            userId: manager.id,
            title: 'New Lead Auto-Assigned',
            message: `New lead "${lead.name}" assigned to agent. Greeting message dispatched.`,
            type: 'IN_APP',
          },
        });
      }

      // 5. Activity Log
      await prisma.activityLog.create({
        data: {
          entityType: 'LEAD',
          entityId: lead.id,
          action: 'AUTOMATION_WORKFLOW_EXECUTED',
          description: `Workflow NEW_LEAD_CREATED executed: Agent assigned, WhatsApp greeting sent, 24h task created.`,
          userId: agentId,
        },
      });

      results.push({ step: 'NEW_LEAD_CREATED', status: 'SUCCESS', leadName: lead.name, waMessageId: waRes.messageId });
    }

    if (event === 'SITE_VISIT_COMPLETED' && payload.visitId) {
      const visit = await prisma.siteVisit.findUnique({
        where: { id: payload.visitId },
        include: { lead: true, property: true, agent: true },
      });
      if (!visit) return;

      // Send Feedback Request WhatsApp
      const feedbackText = `Assalam-o-Alaikum ${visit.lead.name}! Thank you for taking the site inspection of ${visit.property.title}. How was your experience? Reply with your feedback or any questions.`;
      const waRes = await sendWhatsAppMessage({ toPhone: visit.lead.phone, messageText: feedbackText });

      await prisma.communication.create({
        data: {
          type: 'WHATSAPP',
          channel: 'WHATSAPP',
          direction: 'OUTBOUND',
          summary: 'Automated Post-Visit Feedback Request',
          messageText: feedbackText,
          status: waRes.status,
          leadId: visit.leadId,
          agentId: visit.agentId,
        },
      });

      // Create Follow-up Negotiation Task
      await prisma.task.create({
        data: {
          title: `Post-visit follow-up for ${visit.lead.name}`,
          description: `Review client feedback for ${visit.property.title} and discuss token negotiation.`,
          dueDate: new Date(Date.now() + 86400000 * 2),
          priority: 'HIGH',
          status: 'PENDING',
          assignedToId: visit.agentId,
          leadId: visit.leadId,
        },
      });

      // Activity Log
      await prisma.activityLog.create({
        data: {
          entityType: 'SITE_VISIT',
          entityId: visit.id,
          action: 'AUTOMATION_WORKFLOW_EXECUTED',
          description: `Workflow SITE_VISIT_COMPLETED executed: Feedback request dispatched via WhatsApp.`,
          userId: visit.agentId,
        },
      });

      results.push({ step: 'SITE_VISIT_COMPLETED', status: 'SUCCESS', visitId: visit.id });
    }

    if (event === 'PAYMENT_DUE_3_DAYS' && payload.installmentId) {
      const inst = await prisma.installment.findUnique({
        where: { id: payload.installmentId },
        include: { deal: { include: { customer: true, agent: true } } },
      });
      if (!inst) return;

      const customerName = inst.deal?.customer?.name || 'Valued Client';
      const customerPhone = inst.deal?.customer?.phone || '03001234567';

      const reminderText = `Reminder: Payment installment #${inst.installmentNumber} of PKR ${inst.installmentAmount.toLocaleString()} for ${inst.deal.title} is due on ${new Date(inst.dueDate).toLocaleDateString()}. Please contact Asad Land Holdings accounts for assistance.`;
      const waRes = await sendWhatsAppMessage({ toPhone: customerPhone, messageText: reminderText });

      // Notify Agent In-App
      if (inst.deal.agentId) {
        await prisma.notification.create({
          data: {
            userId: inst.deal.agentId,
            title: 'Payment Reminder Sent to Client',
            message: `Installment #${inst.installmentNumber} reminder dispatched to ${customerName}.`,
            type: 'IN_APP',
          },
        });
      }

      results.push({ step: 'PAYMENT_DUE_3_DAYS', status: 'SUCCESS', installmentId: inst.id });
    }

    if (event === 'GOOGLE_SHEETS_SYNC') {
      const syncResult = await syncGoogleSheetsLeads(payload.sheetUrl || DEFAULT_GOOGLE_SHEET_URL);

      if (syncResult.success && syncResult.importedCount && syncResult.importedCount > 0) {
        // Notify managers and super admins
        const managers = await prisma.user.findMany({
          where: {
            role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
            status: 'ACTIVE',
          },
        });

        for (const mgr of managers) {
          await prisma.notification.create({
            data: {
              userId: mgr.id,
              title: '⚡ Google Sheets Trigger Synced',
              message: `Auto-trigger ingested ${syncResult.importedCount} new leads from Google Sheet into CRM.`,
              type: 'LEAD',
              link: '/leads',
              read: false,
            },
          }).catch(() => {});
        }
      }

      results.push({ step: 'GOOGLE_SHEETS_SYNC', status: syncResult.success ? 'SUCCESS' : 'FAILED', syncResult });
    }

    return { success: true, event, results };
  } catch (error: any) {
    console.error('Workflow automation error:', error);
    return { success: false, error: error.message };
  }
}
