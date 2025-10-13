import { db } from "@/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function updateSystemSettings(data: any) {
  const ref = doc(db, "systemSettings", "global");
  await setDoc(ref, { ...data, lastUpdated: serverTimestamp() });
}
