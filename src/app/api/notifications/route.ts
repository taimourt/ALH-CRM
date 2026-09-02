import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    let targetUserId = user?.id;

    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      targetUserId = firstUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
        totalCount: 0,
      });
    }

    // Retrieve notifications specifically addressed to this user
    const notifications = await prisma.notification.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

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
    let targetUserId = user?.id;

    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      targetUserId = firstUser?.id;
    }

    const body = await request.json().catch(() => ({}));
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      if (targetUserId) {
        await prisma.notification.updateMany({
          where: { userId: targetUserId, read: false },
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

    let targetUserId = userId || user?.id;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({ where: { status: 'ACTIVE' }, select: { id: true } });
      if (!defaultUser) {
        return NextResponse.json({ error: 'No user found to assign notification' }, { status: 400 });
      }
      targetUserId = defaultUser.id;
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
    let targetUserId = user?.id;

    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      targetUserId = firstUser?.id;
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      if (targetUserId) {
        await prisma.notification.deleteMany({
          where: { userId: targetUserId },
        });
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
