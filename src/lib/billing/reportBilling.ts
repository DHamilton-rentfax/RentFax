import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export type BillingPlanId =
  | "NONE"
  | "SMALL_LANDLORD"
  | "COMPANY_BASIC"
  | "COMPANY_PRO"
  | "ENTERPRISE";

export interface BillingPlan {
  id: BillingPlanId;
  name: string;
  monthlyIncludedReports: number; // -1 or large number = effectively unlimited
  overagePrice: number;           // USD per extra full report
  identityCheckPrice: number;     // USD (reference, can be enforced in ID flow)
  fullReportPrice: number;        // baseline USD full report price
  active: boolean;
}

/**
 * Fallback defaults if Firestore docs don't exist yet.
 * This lets you start coding now and later manage everything from the CRM.
 */
const FALLBACK_PLANS: Record<BillingPlanId, BillingPlan> = {
  NONE: {
    id: "NONE",
    name: "Pay As You Go",
    monthlyIncludedReports: 0,
    overagePrice: 20,
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    active: true,
  },
  SMALL_LANDLORD: {
    id: "SMALL_LANDLORD",
    name: "Small Landlord",
    monthlyIncludedReports: 10,
    overagePrice: 10,
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    active: true,
  },
  COMPANY_BASIC: {
    id: "COMPANY_BASIC",
    name: "Company Basic",
    monthlyIncludedReports: 50,
    overagePrice: 10,
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    active: true,
  },
  COMPANY_PRO: {
    id: "COMPANY_PRO",
    name: "Company Pro",
    monthlyIncludedReports: 200,
    overagePrice: 8,
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    active: true,
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Enterprise",
    monthlyIncludedReports: -1, // treat as unlimited
    overagePrice: 0,
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    active: true,
  },
};

/**
 * Loads billing plan from Firestore if present, otherwise falls back to defaults.
 */
export async function getBillingPlan(planId: BillingPlanId): Promise<BillingPlan> {
  const app = getFirebaseAdminApp();
  const db = getFirestore(app);

  const snap = await db.collection("billingPlans").doc(planId).get();

  if (!snap.exists) {
    return FALLBACK_PLANS[planId];
  }

  const data = snap.data() || {};
  const fallback = FALLBACK_PLANS[planId];

  // Merge Firestore data over fallback so you can update only what you need
  return {
    ...fallback,
    ...data,
    id: planId,
  } as BillingPlan;
}

/**
 * Fetches user's plan + usage from Firestore.
 * User doc fields:
 * - planId: BillingPlanId
 * - reportsUsedThisPeriod: number
 * - role: string (for enforcement)
 */
export async function getUserPlanAndUsage(userId: string) {
  const app = getFirebaseAdminApp();
  const db = getFirestore(app);

  const doc = await db.collection("users").doc(userId).get();
  const data = doc.data() || {};

  const planId: BillingPlanId = (data.planId as BillingPlanId) || "NONE";
  const reportsUsedThisPeriod: number = data.reportsUsedThisPeriod || 0;
  const role: string = data.role || "UNKNOWN";

  const plan = await getBillingPlan(planId);

  return {
    planId,
    plan,
    reportsUsedThisPeriod,
    role,
  };
}

/**
 * Determines whether user can consume a full report using included credits.
 * If credits are available, increments usage and returns covered=true.
 * If not, returns covered=false and appropriate overage cost.
 */
export async function deductReportCredit(userId: string) {
  const app = getFirebaseAdminApp();
  const db = getFirestore(app);

  const { planId, plan, reportsUsedThisPeriod } = await getUserPlanAndUsage(userId);

  // Enterprise / unlimited behavior
  const unlimited = plan.monthlyIncludedReports < 0 || plan.monthlyIncludedReports === Infinity;

  if (unlimited) {
    return {
      covered: true,
      message: "Enterprise unlimited reports",
      cost: 0,
      planId,
    };
  }

  if (reportsUsedThisPeriod < plan.monthlyIncludedReports) {
    await db.collection("users").doc(userId).set(
      {
        reportsUsedThisPeriod: reportsUsedThisPeriod + 1,
      },
      { merge: true }
    );

    return {
      covered: true,
      message: "Covered by subscription credits",
      cost: 0,
      planId,
    };
  }

  // No credits left → overage applies
  return {
    covered: false,
    message: "Overage required",
    cost: plan.overagePrice,
    planId,
  };
}

/**
 * Creates a Stripe Checkout session for an overage or pay-as-you-go full report.
 */
export async function createFullReportCheckout(
  userId: string,
  sessionId: string,
  cost: number
) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://rentfax.app";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(cost * 100),
          product_data: {
            name: `RentFAX Full Report`,
            description: `Full report for search session ${sessionId}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      sessionId,
      type: "FULL_REPORT_UPGRADE",
    },
    success_url: `${appUrl}/search/renter/results/${sessionId}?payment=success`,
    cancel_url: `${appUrl}/search/renter/results/${sessionId}?payment=cancel`,
  });

  return session.url;
}
