import { getAdminDb } from "@/firebase/server";

export async function getUserRole(uid: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb.collection("users").doc(uid).get();

  if (!snap.exists) return null;

  return snap.data()?.role ?? null;
}
