import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Helper to seed starter notifications if empty
async function seedStarterNotifications(userId: string) {
  try {
    const starterItems = [
      {
        userId,
        title: '⚡ New Lead Auto-Assigned',
        message: 'Lead "Chaudhry Nisar" (0300-8541290) assigned to you for Kohistan Enclave.',
        type: 'LEAD',
        link: '/leads',
        read: false,
      },
      {
        userId,
        title: '📅 Site Visit Confirmed',
        message: 'Taimour Shah confirmed site visit for Plot 142 DHA Phase 8 tomorrow at 3:00 PM.',
        type: 'VISIT',
        link: '/leads',
        read: false,
      },
      {
        userId,
        title: '💰 Token Payment Received',
        message: 'PKR 500,000 token received from Hassan Raza for Commercial Shop G-12.',
        type: 'PAYMENT',
        link: '/finance/payments',
        read: false,
      },
      {
        userId,
        title: '📋 24h SLA Follow-up Task',
        message: 'Call client Muhammad Usman regarding 10 Marla plot in New City Phase 2.',
        type: 'TASK',
        link: '/tasks',
        read: true,
      },
      {
        userId,
        title: '⚡ Automation Workflow Executed',
        message: 'WhatsApp greeting dispatched and 24h reminder task created successfully.',
        type: 'SYSTEM',
        link: '/settings/automation',
        read: true,
      },
    ];

    for (const item of starterItems) {
      await prisma.notification.create({ data: item });
    }
  } catch (err) {
    console.error('Seed starter notifications error:', err);
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;
    const normRole = (user?.role || '').toUpperCase().replace(/\s+/g, '_');
    const isManagement = normRole === 'SUPER_ADMIN' || normRole === 'ADMIN' || normRole === 'MANAGER';

    let notifications = [];

    if (userId) {
      if (isManagement) {
        // Management receives all direct alerts plus team CRM activity alerts
        notifications = await prisma.notification.findMany({
          where: {
            OR: [
              { userId },
              { type: { in: ['LEAD', 'DEAL', 'VISIT', 'PAYMENT', 'TASK', 'COMMUNICATION', 'SYSTEM'] } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 40,
        });
      } else {
        // Sales Agents see their own assigned and directed alerts
        notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 40,
        });
      }

      // If user has 0 notifications, auto-seed starter demo notifications
      if (notifications.length === 0) {
        await seedStarterNotifications(userId);
        notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 40,
        });
      }
    } else {
      notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 40,
      });

      if (notifications.length === 0) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          await seedStarterNotifications(firstUser.id);
          notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 40,
          });
        }
      }
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      unreadCount,
      totalCount: notifications.length,
    });
  } catch (error) {
    console.error('Notifications API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      if (userId) {
        await prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true },
        });
      } else {
        await prisma.notification.updateMany({
          where: { read: false },
          data: { read: true },
        });
      }
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (notificationId) {
      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
      return NextResponse.json({ success: true, updated });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { title, message, type = 'IN_APP', link, userId } = body;

    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'No user found to assign notification' }, { status: 400 });
      }
      const newNotif = await prisma.notification.create({
        data: {
          userId: defaultUser.id,
          title: title || '⚡ CRM Alert',
          message: message || 'You have a new CRM update.',
          type,
          link: link || null,
          read: false,
        },
      });
      return NextResponse.json({ success: true, notification: newNotif });
    }

    const newNotif = await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: title || '⚡ CRM Alert',
        message: message || 'You have a new CRM update.',
        type,
        link: link || null,
        read: false,
      },
    });

    return NextResponse.json({ success: true, notification: newNotif });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      if (userId) {
        await prisma.notification.deleteMany({
          where: { userId },
        });
      } else {
        await prisma.notification.deleteMany({});
      }
      return NextResponse.json({ success: true, message: 'All notifications cleared' });
    }

    if (notificationId) {
      await prisma.notification.delete({
        where: { id: notificationId },
      });
      return NextResponse.json({ success: true, message: 'Notification deleted' });
    }

    return NextResponse.json({ error: 'No notificationId or all flag provided' }, { status: 400 });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
