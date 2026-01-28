import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/server';
import { verifySession } from '@/lib/auth/verifySession';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await verifySession();

  if (!session?.uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { renterInput, reportId } = await request.json();

  if (!renterInput || !reportId) {
    return NextResponse.json(
      { error: 'Missing renterInput or reportId' },
      { status: 400 }
    );
  }

  try {
    const ref = adminDb.collection('payg_intents').doc();

    await ref.set({
      uid: session.uid,
      renterInput,
      reportId,
      status: 'pending', // pending → paid → fulfilled
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ intentId: ref.id });
  } catch (error) {
    console.error('Error creating PAYG intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
