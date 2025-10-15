import { adminDB } from "@/firebase/client-admin";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";

export async function updateDeepReportStatus(session: Stripe.Checkout.Session) {
  if (!session.metadata?.userId) {
    throw new Error("User ID not found in session metadata");
  }

  const userRef = adminDB.collection("users").doc(session.metadata.userId);

  if (session.metadata.reportType === "deep") {
    // This is for a specific deep report purchase, not a credit purchase
    // We can add logic here if needed in the future
  } else if (session.metadata.reportType === "deep_credit") {
    await userRef.update({
      deepReportCredits: FieldValue.increment(1),
    });
  }

  return { success: true };
}
