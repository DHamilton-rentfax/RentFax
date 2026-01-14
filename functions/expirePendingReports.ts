import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../src/firebase/server"; // Adjust path as needed

export async function expirePendingReports() {
  const now = Timestamp.now();

  const snap = await adminDb
    .collection("reports")
    .where("status", "==", "PENDING_EVIDENCE")
    .where("pendingUntil", "<", now)
    .get();

  const batch = adminDb.batch();

  snap.forEach((doc) => {
    batch.update(doc.ref, {
      status: "CLOSED",
      updatedAt: now,
    });
  });

  await batch.commit();
}