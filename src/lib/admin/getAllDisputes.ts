import { collection, orderBy, getDocs, query } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function getAllDisputes() {
  const q = query(collection(db, "disputes"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
