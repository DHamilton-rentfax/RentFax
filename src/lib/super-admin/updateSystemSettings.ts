import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function updateSystemSettings(data: any) {
  const ref = doc(db, "systemSettings", "global");
  await setDoc(ref, { ...data, lastUpdated: serverTimestamp() });
}
