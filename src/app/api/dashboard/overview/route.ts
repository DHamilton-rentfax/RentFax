import { FieldValue } from "firebase-admin/firestore";


import { NextResponse } from 'next/server';

import { db } from '@/firebase/server';
import { verifySession } from '@/lib/auth/verifySession';

export async function GET(request: Request) {
  const session = await verifySession();

  if (!session?.uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get PAYG intents
    const intentsQuery = query(collection(db, 'payg_intents'), where('uid', '==', session.uid), where('status', '==', 'pending'));
    const intentsSnap = await getDocs(intentsQuery);
    const pendingIntents = intentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // In a real app, you'd fetch credits, unlocked reports, etc.
    const creditsRemaining = 0; // Placeholder
    const reportsUnlocked = 0; // Placeholder
    const activeMonitors = 0; // Placeholder
    const alerts = []; // Placeholder

    return NextResponse.json({
      creditsRemaining,
      reportsUnlocked,
      activeMonitors,
      alerts,
      pendingIntents,
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard overview' }, { status: 500 });
  }
}
