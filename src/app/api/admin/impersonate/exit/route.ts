import '@/lib/server-only';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/server';
import { Timestamp } from 'firebase-admin/firestore';
import { logImpersonationEvent } from '@/lib/audit/logImpersonationEvent';

export async function POST(req: Request) {
  const session = cookies().get('__session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);

  const snap = await adminDb
    .collection('adminImpersonationSessions')
    .where('adminId', '==', decoded.uid)
    .where('active', '==', true)
    .limit(1)
    .get();

  if (snap.empty) {
    const token = await adminAuth.createCustomToken(decoded.uid);
    const newSession = await adminAuth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 1000, // 1 hour
    });
    cookies().set('__session', newSession);
    return NextResponse.json({ success: true, message: 'No active session' });
  }

  const doc = snap.docs[0];
  await doc.ref.update({
    active: false,
    exitedAt: Timestamp.now(),
  });

  await logImpersonationEvent({
    adminId: decoded.uid,
    orgId: doc.data().orgId,
    type: 'EXIT',
  });

  // Re-mint the original user's token to remove impersonation claims
  const token = await adminAuth.createCustomToken(decoded.uid);
  const newSession = await adminAuth.createSessionCookie(token, {
    expiresIn: 60 * 60 * 1000, // 1 hour
  });

  cookies().set('__session', newSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ success: true });
}
