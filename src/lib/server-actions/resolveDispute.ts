'use server';

import { adminDb } from '@/firebase/server';
import { logAudit } from '@/lib/audit';
import { auth } from '@/lib/auth'; // Assuming you have an auth library

export async function resolveDispute({
  reportNameId,
  decision,
  notes,
}: {
  reportNameId: string;
  decision: string;
  notes: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await auth(); // Get current user session
  if (!session?.user?.id || !session.user.role) {
    throw new Error('Unauthorized');
  }

  const { id: actorId, role: actorRole } = session.user;

  if (actorRole !== 'admin' && actorRole !== 'super_admin') {
    throw new Error('Forbidden');
  }

  const resolutionRef = adminDb.collection('resolutions').doc();

  await resolutionRef.set({
    reportNameId,
    decision,
    notes,
    resolvedAt: new Date(),
    resolvedBy: actorId,
  });

  await logAudit({
    action: 'resolve_dispute',
    actorId,
    actorRole,
    targetType: 'report',
    targetId: reportNameId,
    metadata: { decision, notes },
  });

  // Optional: Notify renter about the resolution

  return { success: true };
}
