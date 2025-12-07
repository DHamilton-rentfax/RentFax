import { adminDb } from "@/firebase/server";
import { PLAN_LIMITS } from "./limits";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function checkUsageAndEnforceLimits(
  companyId: string,
  eventType: "verifications" | "reports" | "searches"
) {
  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const plan = companyDoc.data()?.subscription?.plan || "free";
  const limits = PLAN_LIMITS[plan];
  const limit = limits[eventType];

  if (limit === Infinity) {
    return { authorized: true };
  }

  const usageSnap = await adminDb
    .collection("companies")
    .doc(companyId)
    .collection("usageSummary")
    .doc("current")
    .get();
    
  const currentUsage = usageSnap.data()?.[eventType] || 0;

  if (currentUsage >= limit) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Usage limit for '${eventType}' exceeded for plan '${plan}'. Please upgrade.` },
        { status: 429 }
      ),
    };
  }

  return { authorized: true };
}

export async function incrementUsage(
  companyId: string,
  eventType: "verifications" | "reports" | "searches"
) {
  const usageRef = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("usageSummary")
    .doc("current");

  await usageRef.set(
    {
      [eventType]: FieldValue.increment(1),
      lastUpdated: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}
