"use server";

import { dbAdmin } from "@/firebase/server";

export async function getUserRole(uid: string): Promise<string | null> {
  const snap = await dbAdmin.doc(`users/${uid}`).get();
  return snap.exists ? (snap.data()?.role as string) : null;
}
