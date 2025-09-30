'use server';

import { adminDB } from '@/firebase/server';
import { getDisputeById } from './get-dispute-by-id';
import { logAudit } from './audit-log';

export async function updateDisputeStatus(
  disputeId: string,
  status: string,
  adminNote: string,
  actorId: string
) {
  const before = await getDisputeById(disputeId);

  await adminDB.doc(`disputes/${disputeId}`).update({
    status,
    adminNote,
    updatedAt: Date.now(),
  });

  const after = await getDisputeById(disputeId);

  await logAudit('updateDisputeStatus', actorId, { before, after });
}
