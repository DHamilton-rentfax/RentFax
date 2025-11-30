import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function updateUserRole(uid: string, role: string) {
  await updateDoc(doc(db, "users", uid), { role });
}
