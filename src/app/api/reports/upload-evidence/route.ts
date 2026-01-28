import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { reportId, fileUrl, uploadedBy } = await req.json();

  const reportRef = adminDb.collection("reports").doc(reportId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(reportRef);
    if (!snap.exists) throw new Error("Report not found");

    const report = snap.data()!;
    if (report.status !== "PENDING_EVIDENCE") return;

    const evidenceRef = reportRef.collection("evidence").doc();

    tx.set(evidenceRef, {
      uploadedBy,
      fileUrl,
      uploadedAt: Timestamp.now(),
    });

    tx.update(reportRef, {
      status: "OPEN",
      pendingUntil: null,
      updatedAt: Timestamp.now(),
    });

    // 🔥 credit consumption hook here
  });

  return NextResponse.json({ success: true });
}