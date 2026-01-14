import '@/lib/server-only';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/server';

export type OrgScope = {
  orgId: string;
  isImpersonating: boolean;
};

export async function requireOrgScope(): Promise<OrgScope> {
  const session = cookies().get('__session')?.value;
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);

  // ✅ Impersonation takes precedence
  if (decoded.impersonatingOrgId) {
    return {
      orgId: decoded.impersonatingOrgId,
      isImpersonating: true,
    };
  }

  // 🔎 Fallback to user's real org
  const userSnap = await adminDb.collection('users').doc(decoded.uid).get();
  const orgId = userSnap.data()?.orgId;

  if (!orgId) {
    throw new Error('NO_ORG_CONTEXT');
  }

  return {
    orgId,
    isImpersonating: false,
  };
}
