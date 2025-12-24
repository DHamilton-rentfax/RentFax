"use server";
import { adminDb } from "@/firebase/server";

export async function startRental({
  companyId, assetId, renterId, reportId, startDate,
}: {
  companyId: string; assetId: string; renterId: string; reportId: string; startDate: Date;
}) {
  const assetRef = adminDb.collection("assets").doc(assetId);
  const reportRef = adminDb.collection("reports").doc(reportId);

  await adminDb.runTransaction(async (tx) => {
    const [assetSnap, reportSnap] = await Promise.all([
      tx.get(assetRef),
      tx.get(reportRef),
    ]);

    if (!assetSnap.exists) throw new Error("Asset not found");
    if (!reportSnap.exists) throw new Error("Report not found");

    const asset = assetSnap.data()!;
    const report = reportSnap.data()!;

    if (asset.companyId !== companyId) throw new Error("Asset/company mismatch");
    if (asset.status !== "available") throw new Error("Asset unavailable");
    if (report.companyId !== companyId) throw new Error("Report/company mismatch");
    if (report.status !== "draft") throw new Error("Report must be draft to start rental");

    // Create rental
    const rentalRef = adminDb.collection("rentals").doc();
    tx.set(rentalRef, {
      rentalId: rentalRef.id,
      companyId,
      assetId,
      renterId,
      reportId,
      status: "active",
      startDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update asset + report
    tx.update(assetRef, { status: "unavailable", updatedAt: new Date() });
    tx.update(reportRef, { status: "active", updatedAt: new Date() });
  });
}
