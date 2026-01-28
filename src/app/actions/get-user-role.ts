"use server";

import { getAdminDb } from "@/firebase/server";

export async function getUserRole(uid: string): Promise<string | null> {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }
  const snap = await adminDb.doc(`users/${uid}`).get();
  return snap.exists ? (snap.data()?.role as string) : null;
}
