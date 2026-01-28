"use server";

import { getAdminDb } from "@/firebase/server";

export async function getAllSubscriptions() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const usersSnap = await adminDb.collection("users").get();

  return usersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email || null,
      subscription: data.subscription || null,
    };
  });
}
