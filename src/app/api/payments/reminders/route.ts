import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { classifyPaymentReminders } from '@/lib/financials';

export async function GET() {
  try {
    const installments = await prisma.installment.findMany({
      where: { status: { in: ['UPCOMING', 'DUE', 'OVERDUE', 'PARTIALLY_PAID'] } },
      include: {
        deal: {
          include: {
            customer: true,
            agent: true,
            property: { include: { society: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const classified = classifyPaymentReminders(installments);

    return NextResponse.json({
      dueToday: classified.dueToday,
      upcoming7Days: classified.upcoming7Days,
      overdue: classified.overdue,
      totalPendingReminders: installments.length,
    });
  } catch (error) {
    console.error('Payment reminders API error:', error);
    return NextResponse.json({ error: 'Failed to fetch payment reminders' }, { status: 500 });
  }
}
