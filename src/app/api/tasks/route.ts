import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const user = await getCurrentUser();
    const isAgentOnly = user?.role === 'SALES_AGENT' || user?.role === 'AGENT';

    const whereConditions: any = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(isAgentOnly && user ? { assignedToId: user.id } : {}),
    };

    const tasks = await prisma.task.findMany({
      where: whereConditions,
      include: {
        assignedTo: true,
        lead: true,
        deal: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Tasks API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, description, dueDate, priority, leadId, dealId, assignedToId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000),
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        assignedToId: assignedToId || user.id,
        leadId: leadId || null,
        dealId: dealId || null,
      },
      include: {
        assignedTo: true,
        lead: true,
        deal: true,
      },
    });

    // Dispatch Notification to assigned user and management
    await createCRMNotification({
      userIds: newTask.assignedToId ? [newTask.assignedToId] : [],
      notifyManagement: true,
      title: '📋 Task Assigned',
      message: `${newTask.title} (Priority: ${newTask.priority}, Due: ${new Date(newTask.dueDate).toLocaleDateString()})`,
      type: 'TASK',
      link: '/tasks',
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Tasks API POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, status, title, description, priority, dueDate } = body;

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(priority ? { priority } : {}),
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      },
      include: {
        assignedTo: true,
        lead: true,
        deal: true,
      },
    });

    // Dispatch Notification on task status change
    if (status && status !== existingTask.status) {
      await createCRMNotification({
        userIds: updatedTask.assignedToId ? [updatedTask.assignedToId] : [],
        notifyManagement: true,
        title: `✅ Task ${status === 'COMPLETED' ? 'Completed' : 'Updated'}`,
        message: `Task "${updatedTask.title}" marked as ${status}.`,
        type: 'TASK',
        link: '/tasks',
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Tasks API PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
