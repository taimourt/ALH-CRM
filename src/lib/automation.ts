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

      const agentId = lead.assignedAgentId;

      // Find system / admin user for fallback foreign key requirement in Communication/Task
      const adminUser = await prisma.user.findFirst({
        where: {
          role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
          status: 'ACTIVE',
        },
      });
      const effectiveUserId = agentId || adminUser?.id;

      // 1. Send WhatsApp Greeting Message
      const greetingText = `Assalam-o-Alaikum ${lead.name}! Thank you for contacting Asad Land Holdings. Our property advisor has received your inquiry for ${lead.preferredSociety || 'plots in Islamabad/Rawalpindi'} and will contact you shortly.`;
      const waRes = await sendWhatsAppMessage({ toPhone: lead.phone, messageText: greetingText });

      if (effectiveUserId) {
        await prisma.communication.create({
          data: {
            type: 'WHATSAPP',
            channel: 'WHATSAPP',
            direction: 'OUTBOUND',
            summary: 'Auto-reply WhatsApp Greeting Message',
            messageText: greetingText,
            status: waRes.status || 'DELIVERED',
            leadId: lead.id,
            agentId: effectiveUserId,
          },
        }).catch((err) => console.error('Communication log error:', err));
      }

      if (agentId) {
        // Lead is ASSIGNED to an agent -> Create 24h Follow-up Task for that agent
        await prisma.task.create({
          data: {
            title: `Follow up with new lead ${lead.name}`,
            description: `Call ${lead.name} (${lead.phone}) regarding ${lead.preferredSize || '10 Marla'} in ${lead.preferredSociety || 'Kohistan Enclave'}.`,
            dueDate: new Date(Date.now() + 86400000), // 24h
            priority: 'HIGH',
            status: 'PENDING',
            assignedToId: agentId,
            leadId: lead.id,
          },
        }).catch((err) => console.error('Task create error:', err));

        // Activity Log for assigned lead
        await prisma.activityLog.create({
          data: {
            entityType: 'LEAD',
            entityId: lead.id,
            action: 'AUTOMATION_WORKFLOW_EXECUTED',
            description: `Workflow NEW_LEAD_CREATED executed: Assigned to agent, WhatsApp greeting sent, 24h task created.`,
            userId: agentId,
          },
        }).catch((err) => console.error('Activity log error:', err));
      } else {
        // Lead is UNASSIGNED (Round-Robin is Paused) -> Create Manual Assignment Task for Super Admin/Manager
        if (adminUser) {
          await prisma.task.create({
            data: {
              title: `Manual Lead Assignment Required: ${lead.name}`,
              description: `Inbound lead from ${lead.source || 'Marketing'} (${lead.phone}) is in the Unassigned Pool. Please assign to a sales agent.`,
              dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12h
              priority: 'HIGH',
              status: 'PENDING',
              assignedToId: adminUser.id,
              leadId: lead.id,
            },
          }).catch((err) => console.error('Task create error:', err));
        }

        // Notify Super Admin and Managers about unassigned lead
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
              title: '📥 New Unassigned Inbound Lead',
              message: `Lead "${lead.name}" (${lead.phone}) is waiting in the Unassigned Pool for manual assignment.`,
              type: 'LEAD',
              link: '/leads',
              read: false,
            },
          }).catch((err) => console.error('Notification error:', err));
        }

        // Activity Log for unassigned lead
        await prisma.activityLog.create({
          data: {
            entityType: 'LEAD',
            entityId: lead.id,
            action: 'AUTOMATION_WORKFLOW_EXECUTED',
            description: `Workflow NEW_LEAD_CREATED executed: Lead placed in Unassigned Pool (Round-Robin paused). WhatsApp greeting dispatched.`,
            userId: adminUser?.id,
          },
        }).catch((err) => console.error('Activity log error:', err));
      }

      results.push({ step: 'NEW_LEAD_CREATED', status: 'SUCCESS', leadName: lead.name, assignedAgentId: agentId || null, waMessageId: waRes.messageId });
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
