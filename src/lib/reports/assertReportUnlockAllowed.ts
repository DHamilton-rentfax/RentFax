import "server-only";
import { adminDb } from "@/firebase/server";
import { assertRentalConsent } from "@/lib/rental-intent/assertRentalConsent";

export async function assertReportUnlockAllowed(
  renterId: string,
  companyId: string
) {
  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) throw new Error("Renter not found");

  const renter = renterSnap.data()!;
  if (renter.verificationStatus !== "verified") {
    throw new Error("Renter not verified");
  }

  await assertRentalConsent(renterId, companyId);

  const fraud = await adminDb
    .collection("fraudSignals")
    .where("renterId", "==", renterId)
    .where("companyId", "==", companyId)
    .limit(1)
    .get();

  if (!fraud.empty) {
    throw new Error("Fraud flag present");
  }
}
