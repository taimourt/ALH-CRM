import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.emailQueue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Email logs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch email queue logs' }, { status: 500 });
  }
}
