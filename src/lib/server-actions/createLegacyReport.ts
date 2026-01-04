'use server';

import { adminDb } from '@/firebase/server';
import { logAudit } from '@/lib/audit';
import { auth } from '@/lib/auth'; // Assuming you have an auth library

export async function createLegacyReport({
  renterName,
  summary,
  source,
}: {
  renterName: string;
  summary: string;
  source: string;
}) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new Error('Unauthorized');
  }

  const { id: actorId, role: actorRole } = session.user;

  if (actorRole !== 'admin' && actorRole !== 'super_admin') {
    throw new Error('Forbidden');
  }

  const reportRef = adminDb.collection('reports').doc();

  await reportRef.set({
    renterName,
    summary,
    source,
    isLegacy: true,
    createdAt: new Date(),
    createdBy: actorId,
  });

  await logAudit({
    action: 'create_legacy_report',
    actorId,
    actorRole,
    targetType: 'report',
    targetId: reportRef.id,
    metadata: { renterName, summary, source },
  });

  return { success: true, reportNameId: reportRef.id };
}
