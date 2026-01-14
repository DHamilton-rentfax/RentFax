// src/lib/payments/provisionIntent.ts
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { adminDb } from "@/firebase/server";

import { grantReportAccess } from "./grantReportAccess";
import { runPDPLVerification } from "./runPDPLVerification";
import { grantPlanEntitlements } from "./grantPlanEntitlements";

export async function provisionPaymentIntent(intentId: string) {
  const intentRef = doc(adminDb, "payment_intents", intentId);
  const intentSnap = await getDoc(intentRef);

  if (!intentSnap.exists()) {
    throw new Error("Payment intent not found");
  }

  const intent = intentSnap.data();

  // Idempotency guard
  if (intent.status === "completed") {
    console.log("Intent already provisioned:", intentId);
    return;
  }

  switch (intent.type) {
    case "PAYG_REPORT":
      await grantReportAccess(intent);
      break;

    case "PDPL":
      await runPDPLVerification(intent);
      break;

    case "SUBSCRIPTION":
      await grantPlanEntitlements(intent);
      break;

    default:
      throw new Error(`Unknown payment intent type: ${intent.type}`);
  }

  // Mark intent as completed
  await updateDoc(intentRef, {
    status: "completed",
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
