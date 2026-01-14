// src/lib/payments/grantPlanEntitlements.ts
import { adminDb } from "@/firebase/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const PLAN_ENTITLEMENTS = {
  STARTER: { credits: 50 },
  PROFESSIONAL: { credits: 300 },
  BUSINESS: { credits: 600 },
  ENTERPRISE: { credits: Infinity },
};

export async function grantPlanEntitlements(intent: any) {
  const { companyId, plan } = intent;

  if (!companyId || !plan) {
    throw new Error("Missing companyId or plan");
  }

  const entitlements = PLAN_ENTITLEMENTS[plan];

  const companyRef = doc(adminDb, "companies", companyId);

  await updateDoc(companyRef, {
    plan,
    creditsRemaining: entitlements.credits,
    planActivatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await adminDb.collection("auditLogs").add({
    type: "PLAN_ACTIVATED",
    companyId,
    plan,
    createdAt: serverTimestamp(),
  });
}
