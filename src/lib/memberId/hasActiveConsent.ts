import { adminDb } from "@/firebase/server";

export async function hasActiveConsent(
  orgId: string,
  renterId: string
): Promise<boolean> {
  try {
    const snap = await adminDb
      .collection("memberIdRequests")
      .where("orgId", "==", orgId)
      .where("renterId", "==", renterId)
      .where("status", "==", "APPROVED")
      .orderBy("respondedAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) return false;

    // const data = snap.docs[0].data();

    // Optional but recommended hardening
    // const MAX_AGE_MS = 24 * 60 * 60 * 1000;
    // if (Date.now() - data.respondedAt.toMillis() > MAX_AGE_MS) return false;

    return true;
  } catch (err) {
    console.error("Consent check failed:", err);
    return false; // fail closed
  }
}
