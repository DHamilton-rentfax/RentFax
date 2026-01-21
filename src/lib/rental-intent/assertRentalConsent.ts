import "server-only";
import { adminDb } from "@/firebase/server";

export async function assertRentalConsent(
  renterId: string,
  companyId: string
) {
  const ref = adminDb
    .collection("rentalIntents")
    .doc(`${renterId}_${companyId}`);

  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("Rental consent not granted");
  }

  const { response } = snap.data()!;

  if (response !== "yes") {
    throw new Error("Rental consent denied");
  }
}
