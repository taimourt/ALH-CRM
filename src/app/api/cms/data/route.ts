import { NextResponse } from 'next/server';
import { readCMSDatabase, writeCMSDatabase, getInitialCMSDatabase } from '@/lib/cms-db';
import { CMSDatabase } from '@/lib/cms-types';

export async function GET() {
  try {
    const db = readCMSDatabase();
    return NextResponse.json(db);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read CMS database' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'reset') {
      const initial = getInitialCMSDatabase();
      writeCMSDatabase(initial);
      return NextResponse.json({ success: true, message: 'Database reset to default template', data: initial });
    }

    const updatedDB: CMSDatabase = body;
    const ok = writeCMSDatabase(updatedDB);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to write CMS database' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedDB });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
