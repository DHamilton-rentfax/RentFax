import '@/lib/server-only';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/server';
import { Timestamp } from 'firebase-admin/firestore';
import { logImpersonationEvent } from '@/lib/audit/logImpersonationEvent';

export async function POST(req: Request) {
  const session = cookies().get('__session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);

  if (!['SUPER_ADMIN', 'ADMIN'].includes(decoded.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  // 🔐 MFA enforcement
  if (!decoded.firebase?.sign_in_second_factor) {
    return NextResponse.json({ error: 'MFA_REQUIRED' }, { status: 403 });
  }

  const authTime = decoded.auth_time * 1000;
  if (Date.now() - authTime > 5 * 60 * 1000) {
    return NextResponse.json(
      { error: 'MFA_REAUTH_REQUIRED' },
      { status: 403 }
    );
  }

  const { orgId, reason = 'Admin support' } = await req.json();
  if (!orgId || typeof orgId !== 'string') {
    return NextResponse.json({ error: 'INVALID_ORG_ID' }, { status: 400 });
  }

  const orgSnap = await adminDb.collection('orgs').doc(orgId).get();
  if (!orgSnap.exists) {
    return NextResponse.json({ error: 'ORG_NOT_FOUND' }, { status: 404 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const now = Timestamp.now();
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + 15 * 60 * 1000)
  );

  await adminDb.runTransaction(async (tx) => {
    const active = await tx.get(
      adminDb
        .collection('adminImpersonationSessions')
        .where('adminId', '==', decoded.uid)
        .where('active', '==', true)
    );

    active.forEach((doc) =>
      tx.update(doc.ref, { active: false, exitedAt: now })
    );

    tx.set(adminDb.collection('adminImpersonationSessions').doc(), {
      adminId: decoded.uid,
      orgId,
      reason,
      ip,
      startedAt: now,
      expiresAt,
      active: true,
    });
  });

  await logImpersonationEvent({
    adminId: decoded.uid,
    orgId,
    type: 'START',
    reason,
    ip,
  });

  return NextResponse.json({ success: true });
}
