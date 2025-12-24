"use server";
import { adminDb } from "@/firebase/server";

export async function endRental({
  rentalId, endDate,
}: { rentalId: string; endDate: Date; }) {
  const rentalRef = adminDb.collection("rentals").doc(rentalId);

  await adminDb.runTransaction(async (tx) => {
    const rentalSnap = await tx.get(rentalRef);
    if (!rentalSnap.exists) throw new Error("Rental not found");

    const rental = rentalSnap.data()!;
    if (rental.status !== "active") throw new Error("Rental not active");

    const assetRef = adminDb.collection("assets").doc(rental.assetId);
    const reportRef = adminDb.collection("reports").doc(rental.reportId);

    // Close rental
    tx.update(rentalRef, {
      status: "completed",
      endDate,
      updatedAt: new Date(),
    });

    // Free asset
    tx.update(assetRef, { status: "available", updatedAt: new Date() });

    // Finalize report
    tx.update(reportRef, {
      status: "finalized",
      finalizedAt: new Date(),
      updatedAt: new Date(),
    });
  });
}
