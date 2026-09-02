import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInstallmentSchedule } from '@/lib/financials';
import { createCRMNotification } from '@/lib/notifications';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const dealId = searchParams.get('dealId');

  try {
    const whereConditions: any = {};
    if (status && status !== 'ALL') whereConditions.status = status;
    if (dealId && dealId !== 'ALL') whereConditions.dealId = dealId;

    const installments = await prisma.installment.findMany({
      where: whereConditions,
      include: {
        deal: {
          include: { customer: true, property: { include: { society: true } } },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(installments);
  } catch (error) {
    console.error('Installments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch installments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, totalAmount, downPaymentPct, numInstallments, frequency } = body;

    const schedule = generateInstallmentSchedule(
      parseFloat(totalAmount) || 10000000,
      parseFloat(downPaymentPct) || 20,
      parseInt(numInstallments) || 12,
      frequency || 'Quarterly'
    );

    const createdRecords = [];
    for (const inst of schedule) {
      const record = await prisma.installment.create({
        data: {
          dealId,
          installmentNumber: inst.installmentNumber,
          totalAmount: inst.totalAmount,
          downPayment: inst.downPayment,
          remainingAmount: inst.remainingAmount,
          installmentAmount: inst.installmentAmount,
          frequency: inst.frequency,
          dueDate: inst.dueDate,
          paidAmount: 0,
          outstandingAmount: inst.installmentAmount,
          status: inst.status,
        },
      });
      createdRecords.push(record);
    }

    // Dispatch Notification
    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    await createCRMNotification({
      userIds: deal?.agentId ? [deal.agentId] : [],
      notifyManagement: true,
      notifyRoles: ['ACCOUNTS'],
      title: '📋 Installment Schedule Created',
      message: `Generated ${createdRecords.length} installments plan for deal "${deal?.title || 'Property Deal'}".`,
      type: 'PAYMENT',
      link: '/payments',
    });

    return NextResponse.json({ success: true, count: createdRecords.length, schedule: createdRecords });
  } catch (error) {
    console.error('Generate Installments error:', error);
    return NextResponse.json({ error: 'Failed to generate installment plan' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, paidAmount, status } = body;

    const installment = await prisma.installment.findUnique({
      where: { id },
      include: { deal: true },
    });
    if (!installment) return NextResponse.json({ error: 'Installment not found' }, { status: 404 });

    const newPaidAmount = (installment.paidAmount || 0) + parseFloat(paidAmount || 0);
    const newOutstanding = Math.max(0, installment.installmentAmount - newPaidAmount);
    const newStatus = newOutstanding === 0 ? 'PAID' : newPaidAmount > 0 ? 'PARTIALLY_PAID' : status || 'DUE';

    const updated = await prisma.installment.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        outstandingAmount: newOutstanding,
        status: newStatus,
        paidAt: newStatus === 'PAID' ? new Date() : installment.paidAt,
      },
    });

    // Dispatch Notification on installment payment
    if (parseFloat(paidAmount || 0) > 0 || newStatus === 'PAID') {
      await createCRMNotification({
        userIds: installment.deal?.agentId ? [installment.deal.agentId] : [],
        notifyManagement: true,
        notifyRoles: ['ACCOUNTS'],
        title: `💳 Installment #${installment.installmentNumber} ${newStatus}`,
        message: `Payment of PKR ${parseFloat(paidAmount || 0).toLocaleString()} recorded for Installment #${installment.installmentNumber}.`,
        type: 'PAYMENT',
        link: '/payments',
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update Installment error:', error);
    return NextResponse.json({ error: 'Failed to update installment' }, { status: 500 });
  }
}
