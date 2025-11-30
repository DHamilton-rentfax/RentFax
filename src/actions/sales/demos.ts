"use server";

import { db } from "@/lib/firebase/server";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { logActivity } from "./activities";

export async function scheduleDemo(data: any) {
  const ref = doc(collection(db, "demos"));

  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Log activity
  await logActivity({
    type: "demo",
    summary: `Demo scheduled`,
    leadId: data.leadId || null,
    dealId: data.dealId || null,
  });

  return { id: ref.id };
}
