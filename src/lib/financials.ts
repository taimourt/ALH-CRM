export interface CommissionBreakdown {
  dealAmount: number;
  commissionRate: number;
  totalCompanyCommission: number;
  agentShare: number;
  agentSplitPct: number;
  managerShare: number;
  managerSplitPct: number;
  companyRetained: number;
}

export function calculateCommissionSplit(
  dealAmount: number,
  commissionRate: number = 1.0,
  agentSplitPct: number = 60,
  managerSplitPct: number = 15
): CommissionBreakdown {
  const totalCompanyCommission = (dealAmount * commissionRate) / 100;
  const agentShare = (totalCompanyCommission * agentSplitPct) / 100;
  const managerShare = (totalCompanyCommission * managerSplitPct) / 100;
  const companyRetained = totalCompanyCommission - agentShare - managerShare;

  return {
    dealAmount,
    commissionRate,
    totalCompanyCommission,
    agentShare,
    agentSplitPct,
    managerShare,
    managerSplitPct,
    companyRetained,
  };
}

export interface GeneratedInstallment {
  installmentNumber: number;
  totalAmount: number;
  downPayment: number;
  remainingAmount: number;
  installmentAmount: number;
  frequency: string;
  dueDate: Date;
  outstandingAmount: number;
  status: 'UPCOMING' | 'DUE' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';
}

export function generateInstallmentSchedule(
  dealAmount: number,
  downPaymentPct: number = 20,
  numInstallments: number = 12,
  frequency: string = 'Quarterly',
  startDate: Date = new Date()
): GeneratedInstallment[] {
  const downPayment = (dealAmount * downPaymentPct) / 100;
  const remainingAmount = dealAmount - downPayment;
  const perInstallmentAmount = remainingAmount / (numInstallments || 1);

  const schedule: GeneratedInstallment[] = [];

  for (let i = 1; i <= numInstallments; i++) {
    const dueDate = new Date(startDate);
    if (frequency === 'Monthly') {
      dueDate.setMonth(dueDate.getMonth() + i);
    } else if (frequency === 'Quarterly') {
      dueDate.setMonth(dueDate.getMonth() + i * 3);
    } else if (frequency === 'Bi-Annual') {
      dueDate.setMonth(dueDate.getMonth() + i * 6);
    } else {
      dueDate.setFullYear(dueDate.getFullYear() + i);
    }

    const today = new Date();
    let status: 'UPCOMING' | 'DUE' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID' = 'UPCOMING';
    if (dueDate < today) {
      status = 'OVERDUE';
    } else if (dueDate.toDateString() === today.toDateString()) {
      status = 'DUE';
    }

    schedule.push({
      installmentNumber: i,
      totalAmount: dealAmount,
      downPayment,
      remainingAmount,
      installmentAmount: Math.round(perInstallmentAmount),
      frequency,
      dueDate,
      outstandingAmount: Math.round(perInstallmentAmount),
      status,
    });
  }

  return schedule;
}

export interface ClassifiedReminders {
  dueToday: any[];
  upcoming7Days: any[];
  overdue: any[];
}

export function classifyPaymentReminders(installments: any[]): ClassifiedReminders {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const dueToday: any[] = [];
  const upcoming7Days: any[] = [];
  const overdue: any[] = [];

  installments.forEach((inst) => {
    if (inst.status === 'PAID') return;
    const due = new Date(inst.dueDate);

    if (due < today && inst.status !== 'PAID') {
      overdue.push(inst);
    } else if (due.toDateString() === today.toDateString()) {
      dueToday.push(inst);
    } else if (due > today && due <= nextWeek) {
      upcoming7Days.push(inst);
    }
  });

  return { dueToday, upcoming7Days, overdue };
}
