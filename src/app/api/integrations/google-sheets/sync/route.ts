import { NextResponse } from 'next/server';
import { syncGoogleSheetsLeads, DEFAULT_GOOGLE_SHEET_URL } from '@/lib/google-sheets';

export async function GET() {
  try {
    const result = await syncGoogleSheetsLeads(DEFAULT_GOOGLE_SHEET_URL);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Google Sheets Sync GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync leads from Google Sheets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let sheetUrl = DEFAULT_GOOGLE_SHEET_URL;

    try {
      const body = await request.json();
      if (body?.sheetUrl) {
        sheetUrl = body.sheetUrl;
      }
    } catch {
      // Empty or no body passed, use default
    }

    const result = await syncGoogleSheetsLeads(sheetUrl);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Google Sheets Sync API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync leads from Google Sheets' }, { status: 500 });
  }
}
