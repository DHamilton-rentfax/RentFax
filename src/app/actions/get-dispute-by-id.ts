'use server';

import { adminDB } from '@/firebase/server';
import { Dispute } from '@/types/dispute';

export async function getDisputeById(disputeId: string): Promise<Dispute | null> {
  const disputeSnap = await adminDB.doc(`disputes/${disputeId}`).get();
  if (!disputeSnap.exists) return null;
  return { id: disputeSnap.id, ...disputeSnap.data() } as Dispute;
}
