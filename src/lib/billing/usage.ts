// src/lib/billing/usage.ts
import { adminDb } from "@/firebase/server";
import type { UsageEventType } from "./usage-types";
import { FieldValue } from "firebase-admin/firestore";

type PlanId = "FREE" | "STARTER" | "PRO" | "ENTERPRISE" | "SUPER_ADMIN";

type PlanLimits = {
  verificationPerDay?: number;   // soft limit for verification attempts
  identityCheckPerDay?: number;  // soft limit for paid ID checks
};

const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  FREE: {
    verificationPerDay: 1,
    identityCheckPerDay: 0,
  },
  STARTER: {
    verificationPerDay: 20,
    identityCheckPerDay: 5,
  },
  PRO: {
    verificationPerDay: 200,
    identityCheckPerDay: 50,
  },
  ENTERPRISE: {
    verificationPerDay: undefined, // unlimited
    identityCheckPerDay: undefined,
  },
  SUPER_ADMIN: {
    verificationPerDay: undefined,
    identityCheckPerDay: undefined,
  },
};

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function recordUsageEvent(params: {
  companyId: string;
  planId: PlanId;
  type: UsageEventType;
  amount?: number;
}): Promise<{ allowed: boolean; reason?: string }> {
  const { companyId, planId, type } = params;
  const amount = params.amount ?? 1;

  const todayKey = getTodayKey();
  const docRef = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsage")
    .doc(todayKey);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    const data = snap.exists ? snap.data() || {} : {};

    const currentCount = Number(data[type] ?? 0);
    const newCount = currentCount + amount;

    tx.set(
      docRef,
      {
        [type]: newCount,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  // Now enforce soft/hard limits based on plan
  const limits = PLAN_LIMITS[planId];
  if (!limits) {
    return { allowed: true }; // No limits defined for this plan
  }


  if (type === "verificationAttempt" && limits.verificationPerDay != null) {
    const usageSnap = await docRef.get();
    const usageData = usageSnap.data() || {};
    const current = Number(usageData[type] ?? 0);

    if (current > limits.verificationPerDay) {
      return {
        allowed: false,
        reason: "Verification daily limit reached for this plan.",
      };
    }
  }

  if (type === "identityCheck" && limits.identityCheckPerDay != null) {
    const usageSnap = await docRef.get();
    const usageData = usageSnap.data() || {};
    const current = Number(usageData[type] ?? 0);

    if (current > limits.identityCheckPerDay) {
      return {
        allowed: false,
        reason: "Identity check daily limit reached for this plan.",
      };
    }
  }

  return { allowed: true };
}
