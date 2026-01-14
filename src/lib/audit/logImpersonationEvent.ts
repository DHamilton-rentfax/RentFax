import '@/lib/server-only';

import { adminDb } from '@/firebase/server';
import { Timestamp } from 'firebase-admin/firestore';

export async function logImpersonationEvent(params: {
  adminId: string;
  orgId: string;
  type: 'START' | 'EXIT' | 'EXPIRE';
  ip?: string;
  reason?: string;
}) {
  await adminDb.collection('auditLogs').add({
    category: 'IMPERSONATION',
    adminId: params.adminId,
    orgId: params.orgId,
    type: params.type,
    reason: params.reason ?? null,
    ip: params.ip ?? null,
    createdAt: Timestamp.now(),
  });
}
