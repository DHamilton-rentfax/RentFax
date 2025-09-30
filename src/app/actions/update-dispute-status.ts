'use server';

import { adminDB } from '@/firebase/server';

export async function updateDisputeStatus(
  disputeId: string,
  status: string,
  adminNote: string
) {
  await adminDB.doc(`disputes/${disputeId}`).update({
    status,
    adminNote,
    updatedAt: Date.now(),
  });
}
