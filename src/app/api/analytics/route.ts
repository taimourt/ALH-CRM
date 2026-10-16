import { NextResponse } from 'next/server';
import { fetchAdvancedAnalyticsData } from '@/lib/analytics-engine';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (user.role || '').toUpperCase().replace(/\s+/g, '_');
    const isManagement = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(userRole);
    if (!isManagement) {
      return NextResponse.json({ error: 'Forbidden: Analytics is restricted to management' }, { status: 403 });
    }

    const analyticsData = await fetchAdvancedAnalyticsData();
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to compute analytics data' }, { status: 500 });
  }
}

