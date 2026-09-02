import { NextResponse } from 'next/server';
import { fetchAdvancedAnalyticsData } from '@/lib/analytics-engine';

export async function GET() {
  try {
    const analyticsData = await fetchAdvancedAnalyticsData();
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to compute analytics data' }, { status: 500 });
  }
}
