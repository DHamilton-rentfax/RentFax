import { adminDb } from "@/firebase/server";

export async function getReportLedger(reportNameId: string) {
  const snap = await adminDb
    .collection("reportLedger")
    .where("reportNameId", "==", reportNameId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
