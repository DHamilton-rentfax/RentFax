'use server';

import { adminDB } from '@/firebase/server';
import { Dispute } from '@/types/dispute';

export async function getAllDisputes(): Promise<Dispute[]> {
  const disputesSnap = await adminDB.collection('disputes').get();
  return disputesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dispute));
}
