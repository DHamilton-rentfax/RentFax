import { NextResponse } from 'next/server';
import { getFraudSignals } from '@/app/actions/fraud-signals';

export async function POST(req: Request) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
  }

  try {
    const signals = await getFraudSignals(uid);
    return NextResponse.json(signals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
