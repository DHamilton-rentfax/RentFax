"use server";

import { adminDB } from "@/firebase/server";

export async function getAllSubscriptions() {
  const usersSnap = await adminDB.collection("users").get();

  return usersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email || null,
      subscription: data.subscription || null,
    };
  });
}
