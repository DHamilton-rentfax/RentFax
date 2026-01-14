import { adminDb } from "@/firebase/server";

export async function getUserRole(uid: string) {
  const snap = await adminDb.collection("users").doc(uid).get();

  if (!snap.exists) return null;

  return snap.data()?.role ?? null;
}
