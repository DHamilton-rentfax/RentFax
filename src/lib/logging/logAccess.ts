import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function logAccess(payload: {
  type: "SEARCH" | "IDENTITY_CHECK" | "FULL_REPORT_UNLOCK";
  companyId: string;
  userId: string;
  renter?: any;
  reportId?: string;
  metadata?: any;
}) {
  try {
    await addDoc(collection(db, "accessLogs"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Access log failed:", err);
  }
}
