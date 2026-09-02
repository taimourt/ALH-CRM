import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { reassignLeadManually } from '@/lib/lead-assignment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isAuthorized = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(normRole);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin, Admin, and Sales Managers can assign leads.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { leadId, agentId, reason } = body;

    if (!leadId || !agentId) {
      return NextResponse.json({ error: 'leadId and agentId are required' }, { status: 400 });
    }

    const updatedLead = await reassignLeadManually({
      leadId,
      newAgentId: agentId,
      actorId: user.id,
      actorName: user.name,
      reason: reason || 'Manual Manager Assignment',
    });

    return NextResponse.json({
      success: true,
      message: `Lead successfully assigned to ${updatedLead.assignedAgent?.name}.`,
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error('Lead manual assignment API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to assign lead' }, { status: 500 });
  }
}
