import { adminDb } from "@/firebase/server";

export async function getEffectiveOrgId(userId: string, defaultOrgId: string) {
  const snap = await adminDb
    .collection("adminImpersonationSessions")
    .where("adminId", "==", userId)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snap.empty) return defaultOrgId;

  const data = snap.docs[0].data();

  if (data.expiresAt.toMillis() < Date.now()) {
    await snap.docs[0].ref.update({ active: false });
    return defaultOrgId;
  }

  return data.orgId;
}
