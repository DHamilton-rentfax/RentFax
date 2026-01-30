// ============================================================
// RentFAX | Billing & Entitlements (SOURCE OF TRUTH)
// DO NOT duplicate pricing logic anywhere else.
// All billing, UI, Stripe provisioning, and enforcement
// MUST reference this file.
// ============================================================
// Model:
// - Searches: unlimited
// - Verification: PAYG ($4.99) or self-verify
// - Reports: PAYG ($20) OR membership credits
// - Memberships gate FEATURES + monthly report credits
// - Enterprise = custom contract ($20k+), unlimited
// ============================================================

export type MembershipPlan = "starter" | "pro" | "elite" | "enterprise";

/**
 * Base monthly report credits per plan
 * (matches PricingPageClient.tsx)
 */
export const BASE_REPORT_CREDITS: Record<MembershipPlan, number> = {
  starter: 50,     // $199
  pro: 300,        // $499
  elite: 600,      // $799
  enterprise: Infinity, // custom contract
};

/**
 * Beta / early-access bonus credits
 * Set to 0 when beta ends.
 */
export const BETA_BONUS_CREDITS: Partial<Record<MembershipPlan, number>> = {
  starter: 25, // 50 + 25 = 75 (beta)
  pro: 50,     // 300 + 50 = 350 (beta)
  elite: 100,  // 600 + 100 = 700 (beta)
};

/**
 * Computed total monthly credits
 */
export function getMonthlyReportCredits(plan: MembershipPlan): number {
  return (
    BASE_REPORT_CREDITS[plan] +
    (BETA_BONUS_CREDITS[plan] ?? 0)
  );
}

/**
 * PAYG pricing (authoritative)
 */
export const PAYG_PRICING = {
  reportUnlockUSD: 20,
  instantVerificationUSD: 4.99,
};

/**
 * Searches are unlimited (explicit)
 */
export const SEARCH_LIMITS = {
  enabled: false as const,
  maxPerMonth: Infinity,
};

/**
 * UX-only warnings
 */
export const SOFT_WARN_THRESHOLDS = {
  reportsRemaining: 3,
};
