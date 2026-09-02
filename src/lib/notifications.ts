import { prisma } from '@/lib/db';

export interface NotifyActivityOptions {
  /** Specific user IDs to receive this notification */
  userIds?: (string | null | undefined)[];
  /** Target roles to receive this notification */
  notifyRoles?: string[];
  /** If true, automatically dispatches to Super Admins and Managers */
  notifyManagement?: boolean;
  /** If true, automatically dispatches to all active Sales Agents */
  notifyAgents?: boolean;
  title: string;
  message: string;
  type:
    | 'LEAD'
    | 'DEAL'
    | 'VISIT'
    | 'PAYMENT'
    | 'TASK'
    | 'COMMUNICATION'
    | 'PROPERTY'
    | 'USER'
    | 'SYSTEM'
    | string;
  link?: string;
}

/**
 * Universal CRM Notification Dispatcher
 * Ensures every CRM activity triggers in-app bell notifications to the appropriate users and management
 */
export async function createCRMNotification(options: NotifyActivityOptions) {
  try {
    const targetUserIds = new Set<string>();

    // 1. Add explicitly specified user IDs
    if (options.userIds && Array.isArray(options.userIds)) {
      for (const uid of options.userIds) {
        if (uid && uid !== 'system' && uid !== 'unassigned') {
          targetUserIds.add(uid);
        }
      }
    }

    // 2. Fetch users by roles if requested (Management, Agents, etc.)
    const rolesToQuery: string[] = [];
    if (options.notifyManagement !== false) {
      // By default notify management for major CRM milestones unless explicitly disabled
      rolesToQuery.push('SUPER_ADMIN', 'ADMIN', 'MANAGER');
    }
    if (options.notifyAgents) {
      rolesToQuery.push('SALES_AGENT', 'SENIOR_AGENT', 'AGENT');
    }
    if (options.notifyRoles && options.notifyRoles.length > 0) {
      rolesToQuery.push(...options.notifyRoles);
    }

    if (rolesToQuery.length > 0) {
      const usersInRoles = await prisma.user.findMany({
        where: {
          role: { in: Array.from(new Set(rolesToQuery)) },
          status: 'ACTIVE',
        },
        select: { id: true },
      });

      for (const u of usersInRoles) {
        targetUserIds.add(u.id);
      }
    }

    // If still no target user found, fallback to first active admin
    if (targetUserIds.size === 0) {
      const fallbackUser = await prisma.user.findFirst({ where: { status: 'ACTIVE' }, select: { id: true } });
      if (fallbackUser) targetUserIds.add(fallbackUser.id);
    }

    // 3. Batch create notifications in database
    const notificationsToCreate = Array.from(targetUserIds).map((userId) => ({
      userId,
      title: options.title,
      message: options.message,
      type: options.type || 'IN_APP',
      link: options.link || null,
      read: false,
    }));

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({
        data: notificationsToCreate,
      });
    }

    return { success: true, count: notificationsToCreate.length };
  } catch (err: any) {
    console.error('[CRM Notification Dispatch Error]:', err.message);
    return { success: false, error: err.message };
  }
}
