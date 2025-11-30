import { db } from "@/lib/firebase/server";
import { collection, addDoc } from "firebase/firestore";

export async function logAuditEvent({ type, userId, metadata }) {
  await addDoc(collection(db, "auditLogs"), {
    type,
    userId,
    metadata,
    createdAt: new Date(),
  });
}
