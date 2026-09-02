import { prisma } from '@/lib/db';

export interface AuditLogParams {
  actorId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  beforeValue?: any;
  afterValue?: any;
  ipAddress?: string;
  deviceInfo?: string;
}

export async function recordAuditLog(params: AuditLogParams) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        actorId: params.actorId || null,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId || null,
        ipAddress: params.ipAddress || '127.0.0.1',
        deviceInfo: params.deviceInfo || 'Antigravity Session / macOS',
        beforeValue: params.beforeValue ? JSON.stringify(params.beforeValue) : null,
        afterValue: params.afterValue ? JSON.stringify(params.afterValue) : null,
      },
    });

    console.log(`[AUDIT LOG] Recorded action "${params.action}" on ${params.targetType}:${params.targetId || 'N/A'}`);
    return log;
  } catch (error) {
    console.error('Record audit log error:', error);
  }
}
