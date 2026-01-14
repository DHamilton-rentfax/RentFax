import '@/lib/server-only';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/firebase/server';
import { notFound } from 'next/navigation';

export type OrgContext = {
  orgId: string;
  orgName: string;
  isImpersonating: boolean;
  impersonationExpiresAt?: string;
};

export async function getOrgContext(): Promise<OrgContext> {
  const session = cookies().get('__session')?.value;
  if (!session) {
    throw new Error('Not authenticated');
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);

  const impersonatingOrgId =
    typeof decoded.impersonatingOrgId === 'string'
      ? decoded.impersonatingOrgId
      : undefined;

  const impersonationExpiresAt =
    typeof decoded.impersonationExpiresAt === 'number'
      ? decoded.impersonationExpiresAt
      : undefined;

  // 🔒 HARD ENFORCEMENT: expiration
  if (impersonatingOrgId && impersonationExpiresAt) {
    if (Date.now() > impersonationExpiresAt) {
      console.warn('Expired impersonation detected, forcing exit');
      notFound(); // forces layout reload → session reset
    }
  }

  // 🧠 IMPERSONATION PATH
  if (impersonatingOrgId) {
    const orgSnap = await adminDb
      .collection('orgs')
      .doc(impersonatingOrgId)
      .get();

    if (!orgSnap.exists) {
      console.error(
        `Impersonated org ${impersonatingOrgId} no longer exists`
      );
      notFound();
    }

    return {
      orgId: impersonatingOrgId,
      orgName: orgSnap.data()?.name ?? 'Unknown Organization',
      isImpersonating: true,
      impersonationExpiresAt: impersonationExpiresAt
        ? new Date(impersonationExpiresAt).toISOString()
        : undefined,
    };
  }

  // 👤 NORMAL ADMIN CONTEXT
  const userSnap = await adminDb
    .collection('users')
    .doc(decoded.uid)
    .get();

  const userOrgId = userSnap.data()?.orgId;
  if (!userOrgId) {
    throw new Error('User is not associated with an organization');
  }

  const orgSnap = await adminDb.collection('orgs').doc(userOrgId).get();
  if (!orgSnap.exists) {
    throw new Error('Organization not found');
  }

  return {
    orgId: userOrgId,
    orgName: orgSnap.data()?.name ?? 'Unknown Organization',
    isImpersonating: false,
  };
}
