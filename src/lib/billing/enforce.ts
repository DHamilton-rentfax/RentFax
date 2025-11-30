import { adminDB } from "@/firebase/server";
import { getPricingConfig } from "@/firebase/server/pricing";
import { getFraudSignals } from "@/lib/fraud/signals";
import { FieldValue } from "firebase-admin/firestore";

// Returned to API routes + dashboard UI
export type PermissionResult = {
  allowed: boolean;   // can the action happen?
  paid: boolean;      // should checkout run?
  reason?: string;    // why blocked / gated (DAILY_LIMIT, FRAUD, PLAN)
  price?: number;     // only present if user must pay
  creditsRemaining?: number;
};

/* ---------------------------------------
   Helpers
----------------------------------------*/

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function month(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

async function getUser(userId: string) {
  const snap = await adminDB.collection("users").doc(userId).get();
  return snap.exists ? snap.data()! : null;
}

async function getCredits(userId: string): Promise<number> {
  const snap = await adminDB.collection("credits").doc(userId).get();
  return snap.exists ? snap.data()?.count ?? 0 : 0;
}

/* ---------------------------------------
   Resource Consumption
----------------------------------------*/

/**
 * Marks a full report as used for the current month.
 */
export async function consumeFullReport(userId: string) {
  if (!userId) return;

  const docRef = adminDB
    .collection("usage")
    .doc(userId)
    .collection("reports")
    .doc(month());

  await docRef.set({ count: FieldValue.increment(1) }, { merge: true });
}

/**
 * Marks an identity search as used for the current day.
 */
export async function consumeSearch(userId: string) {
  if (!userId) return;

  const docRef = adminDB
    .collection("usage")
    .doc(userId)
    .collection("searches")
    .doc(today());

  await docRef.set({ count: FieldValue.increment(1) }, { merge: true });
}

/**
 * Decrements a user's credit balance.
 */
export async function consumeCredit(userId: string) {
  if (!userId) return;

  const docRef = adminDB.collection("credits").doc(userId);
  await docRef.update({ count: FieldValue.increment(-1) });
}

/* ---------------------------------------
   Identity Search Permission
----------------------------------------*/

export async function enforceSearchPermission(
  userId: string
): Promise<PermissionResult> {
  const pricing = await getPricingConfig();
  const user = await getUser(userId);
  const identityPrice = pricing.identityCheck ?? 4.99;

  // --- 1. Fraud Gate (Global)
  const fraud = await getFraudSignals(userId);
  if (fraud.isBlocked) {
    return {
      allowed: false,
      paid: false,
      reason: "FRAUD_BLOCKED",
    };
  }

  // --- 2. New User Behavior
  if (!user) {
    return { allowed: true, paid: true, price: identityPrice };
  }

  const plan = user.subscription?.planId || "FREE";

  // --- 3. Daily Usage
  const usageSnap = await adminDB
    .collection("usage")
    .doc(userId)
    .collection("searches")
    .doc(today())
    .get();

  const usedToday = usageSnap.exists ? usageSnap.data()?.count ?? 0 : 0;

  // --- 4. Credits (Optional Add-On)
  const credits = await getCredits(userId);

  // ----------------------------------
  // PLAN RULES
  // ----------------------------------

  switch (plan) {
    case "FREE": {
      const fLimit = pricing.freeDailySearchLimit ?? 3;

      if (usedToday >= fLimit) {
        return {
          allowed: false,
          paid: false,
          reason: "DAILY_LIMIT_REACHED",
          creditsRemaining: credits,
        };
      }

      // FREE always pays (no included searches)
      return {
        allowed: true,
        paid: true,
        price: identityPrice,
        creditsRemaining: credits,
      };
    }

    case "LANDLORD_PREMIUM":
    case "COMPANY_BASIC":
    case "COMPANY_PRO":
    case "ENTERPRISE": {
      // These get unlimited identity checks
      return {
        allowed: true,
        paid: false,
        creditsRemaining: credits,
      };
    }

    default:
      return {
        allowed: true,
        paid: true,
        price: identityPrice,
        creditsRemaining: credits,
      };
  }
}

/* ---------------------------------------
   Full Report Permission
----------------------------------------*/

export async function enforceFullReportPermission(
  userId: string
): Promise<PermissionResult> {
  const pricing = await getPricingConfig();
  const user = await getUser(userId);
  const fullPrice = pricing.fullReport ?? 19.99;

  // --- Fraud Block (Global)
  const fraud = await getFraudSignals(userId);
  if (fraud.isBlocked) {
    return {
      allowed: false,
      paid: false,
      reason: "FRAUD_BLOCKED",
    };
  }

  // New/Anonymous user must pay
  if (!user) {
    return { allowed: true, paid: true, price: fullPrice };
  }

  const plan = user.subscription?.planId || "FREE";
  const credits = await getCredits(userId);

  const usageSnap = await adminDB
    .collection("usage")
    .doc(userId)
    .collection("reports")
    .doc(month())
    .get();

  const used = usageSnap.exists ? usageSnap.data()?.count ?? 0 : 0;

  /* ----------------------------------------
     PLAN RULES FOR FULL REPORTS
  ----------------------------------------*/

  switch (plan) {
    case "FREE":
      return {
        allowed: true,
        paid: true,
        price: fullPrice,
        creditsRemaining: credits,
      };

    case "LANDLORD_PREMIUM": {
      const planInfo = pricing.plans.landlordPremium;

      if (used < planInfo.monthlyReports) {
        return {
          allowed: true,
          paid: false,
          creditsRemaining: credits,
        };
      }

      return {
        allowed: true,
        paid: true,
        price: planInfo.overage,
        creditsRemaining: credits,
      };
    }

    case "COMPANY_BASIC": {
      const planInfo = pricing.plans.companyBasic;

      if (used < planInfo.includedReports) {
        return { allowed: true, paid: false, creditsRemaining: credits };
      }

      return {
        allowed: true,
        paid: true,
        price: planInfo.overage,
        creditsRemaining: credits,
      };
    }

    case "COMPANY_PRO": {
      const planInfo = pricing.plans.companyPro;

      if (used < planInfo.includedReports) {
        return { allowed: true, paid: false, creditsRemaining: credits };
      }

      return {
        allowed: true,
        paid: true,
        price: planInfo.overage,
        creditsRemaining: credits,
      };
    }

    case "ENTERPRISE":
      return { allowed: true, paid: false, creditsRemaining: credits };

    default:
      return {
        allowed: true,
        paid: true,
        price: fullPrice,
        creditsRemaining: credits,
      };
  }
}
