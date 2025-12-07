import { sendWeeklyDigest } from '@/lib/billing/weekly-digest';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sendWeeklyDigest();
    return NextResponse.json({ message: 'Weekly digests sent successfully.' });
  } catch (error) {
    console.error('Error sending weekly digests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
