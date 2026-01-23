"use server";

import { adminDb } from "@/firebase/server";

export async function getAllSubscriptions() {
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
