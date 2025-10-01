'use server';

import { adminDB } from '@/firebase/server';

export async function getUserRole(uid: string): Promise<string | null> {
  const snap = await adminDB.doc(`users/${uid}`).get();
  return snap.exists ? (snap.data()?.role as string) : null;
}
