import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Increments a fraud signal counter associated with a renter.
 * This is a simple implementation. A more advanced system might consider:
 *  - The velocity of denials
 *  - Denials across different organizations for the same renter
 *  - A decay factor for old signals
 */
export async function incrementRenterFraudSignal(renterId: string) {
  console.log(`Incrementing fraud signal for renter ${renterId}`);
  try {
    const renterRef = adminDb.collection("renters").doc(renterId);
    await renterRef.set(
      {
        fraudSignals: {
          memberIdDenials: FieldValue.increment(1),
        },
        lastSignalAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to increment renter fraud signal:", error);
    // Do not let this failure block the main response flow.
  }
}
