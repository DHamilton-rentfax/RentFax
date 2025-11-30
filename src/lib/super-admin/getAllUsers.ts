import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
