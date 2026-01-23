"use server";

import { adminDb } from "@/firebase/server";

export async function getUserRole(uid: string): Promise<string | null> {
  const snap = await adminDb.doc(`users/${uid}`).get();
  return snap.exists ? (snap.data()?.role as string) : null;
}
