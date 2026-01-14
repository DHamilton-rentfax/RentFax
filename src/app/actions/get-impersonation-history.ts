import '@/lib/server-only';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/server';
import { getUserContext } from '@/app/actions/get-user-context';

export type ImpersonationLog = {
  id: string;
  adminId: string;
  adminName: string;
  orgId: string;
  orgName: string;
  reason?: string;
  startedAt: string;
  exitedAt?: string;
  ip?: string;
};

export async function getImpersonationHistory(
  limit = 50
): Promise<ImpersonationLog[]> {
  const session = cookies().get('__session')?.value;
  if (!session) throw new Error('UNAUTHENTICATED');

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const ctx = await getUserContext(decoded.uid);

  if (!['ADMIN', 'SUPER_ADMIN'].includes(ctx.role)) {
    throw new Error('FORBIDDEN');
  }

  const snap = await adminDb
    .collection('adminImpersonationSessions')
    .orderBy('startedAt', 'desc')
    .limit(limit)
    .get();

  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

  const adminIds = [...new Set(rows.map((r) => r.adminId))];
  const orgIds = [...new Set(rows.map((r) => r.orgId))];

  const [adminSnaps, orgSnaps] = await Promise.all([
    Promise.all(adminIds.map((id) => adminDb.collection('users').doc(id).get())),
    Promise.all(orgIds.map((id) => adminDb.collection('orgs').doc(id).get())),
  ]);

  const adminMap = new Map(
    adminSnaps.filter((s) => s.exists).map((s) => [s.id, s.data()!.displayName])
  );

  const orgMap = new Map(
    orgSnaps.filter((s) => s.exists).map((s) => [s.id, s.data()!.name])
  );

  return rows.map((r) => ({
    id: r.id,
    adminId: r.adminId,
    adminName: adminMap.get(r.adminId) ?? 'Unknown Admin',
    orgId: r.orgId,
    orgName: orgMap.get(r.orgId) ?? 'Unknown Organization',
    reason: r.reason,
    startedAt: r.startedAt?.toDate().toISOString(),
    exitedAt: r.exitedAt?.toDate().toISOString(),
    ip: r.ip,
  }));
}
