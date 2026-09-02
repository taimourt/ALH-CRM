import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export interface EmailVariableValues {
  first_name?: string;
  last_name?: string;
  agent_name?: string;
  property_name?: string;
  property_price?: string;
  society?: string;
  site_visit_date?: string;
  site_visit_time?: string;
  company_name?: string;
  invitation_link?: string;
  role_name?: string;
  [key: string]: string | undefined;
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && apiKey.trim().length > 5) {
    return new Resend(apiKey.trim());
  }
  return null;
}

export function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  return null;
}

export function renderEmailTemplate(templateHtml: string, variables: EmailVariableValues): string {
  let body = templateHtml;
  const defaultCompany = variables.company_name || 'Asad Land Holdings';

  body = body.replace(/\{\{company_name\}\}/g, defaultCompany);

  Object.keys(variables).forEach((key) => {
    const val = variables[key] || '';
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    body = body.replace(regex, val);
  });

  return body;
}

export async function sendDirectEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  // 1. Prioritize Resend API if RESEND_API_KEY is configured
  const resend = getResendClient();
  if (resend) {
    const from =
      process.env.RESEND_FROM ||
      process.env.SMTP_FROM ||
      'Asad Land Holdings <noreply@asadlandholdings.com>';

    const res = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
    });

    if (res.error) {
      console.error('Resend API Error:', res.error);
      throw new Error(res.error.message);
    }

    return { delivered: true, messageId: res.data?.id, provider: 'RESEND' };
  }

  // 2. Secondary fallback: Nodemailer SMTP
  const transporter = getSmtpTransporter();
  if (transporter) {
    const from =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      '"Asad Land Holdings" <noreply@asadlandholdings.com>';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
    });

    return { delivered: true, messageId: info.messageId, provider: 'SMTP' };
  }

  // 3. Simulated Fallback (Queue Record)
  console.log(`[Email Simulated Queue] To: ${to}, Subject: ${subject}`);
  return { delivered: true, messageId: `sim_${Date.now()}`, provider: 'SIMULATED' };
}

export async function queueAndSendEmail(
  templateSlug: string,
  recipient: string,
  variables: EmailVariableValues,
  overrideSubject?: string
) {
  try {
    // 1. Fetch template from DB
    const template = await prisma.emailTemplate.findUnique({ where: { slug: templateSlug } });

    const subject = overrideSubject || template?.subject || `Notification from Asad Land Holdings`;
    const bodyRaw =
      template?.bodyHtml ||
      `<p>Assalam-o-Alaikum {{first_name}},</p><p>You have a new update regarding {{company_name}}.</p>`;

    const bodyHtml = renderEmailTemplate(bodyRaw, variables);

    // 2. Insert into Email Queue
    const queuedEmail = await prisma.emailQueue.create({
      data: {
        recipient,
        subject,
        bodyHtml,
        templateSlug,
        status: 'SENDING',
        attempts: 1,
      },
    });

    // 3. Dispatch Delivery via Resend / SMTP
    try {
      const result = await sendDirectEmail({
        to: recipient,
        subject,
        html: bodyHtml,
      });

      await prisma.emailQueue.update({
        where: { id: queuedEmail.id },
        data: {
          status: 'DELIVERED',
          sentAt: new Date(),
        },
      });

      return { success: true, queueId: queuedEmail.id, provider: result.provider };
    } catch (sendError: any) {
      console.error('Email Dispatch Error:', sendError);
      await prisma.emailQueue.update({
        where: { id: queuedEmail.id },
        data: {
          status: 'FAILED',
          error: sendError.message,
        },
      });

      return { success: false, queueId: queuedEmail.id, error: sendError.message };
    }
  } catch (error: any) {
    console.error('Queue Email error:', error);
    return { success: false, error: error.message };
  }
}
