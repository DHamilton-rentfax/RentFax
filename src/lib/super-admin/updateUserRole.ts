import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

export async function updateUserRole(uid: string, role: string) {
  await updateDoc(doc(db, "users", uid), { role });
}
