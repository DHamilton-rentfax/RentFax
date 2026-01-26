import { adminDb } from "@/firebase/server";

export async function assertAIEnabled(companyId: string) {
  const snap = await adminDb.collection("companies").doc(companyId).get();
  const data = snap.data();

  if (!data?.features?.aiEnabled) {
    throw new Error("AI features not enabled for this plan.");
  }
}
