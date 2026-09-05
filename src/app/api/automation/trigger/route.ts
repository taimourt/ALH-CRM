import { NextResponse } from 'next/server';
import { triggerWorkflow, AutomationEvent } from '@/lib/automation';

export async function GET() {
  return NextResponse.json({ status: 'ready', message: 'Automation engine active' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, leadId, visitId, installmentId, sheetUrl } = body;

    const result = await triggerWorkflow(event as AutomationEvent, {
      leadId,
      visitId,
      installmentId,
      sheetUrl,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Trigger automation API error:', error);
    return NextResponse.json({ error: 'Failed to execute automation workflow' }, { status: 500 });
  }
}
