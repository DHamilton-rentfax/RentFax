// src/lib/billing/company-plan.ts
import { adminDb, adminAuth } from "@/firebase/server";

type PlanId = "FREE" | "STARTER" | "PRO" | "ENTERPRISE" | "SUPER_ADMIN";

export type CompanyPlanContext = {
  companyId: string;
  planId: PlanId;
};

export async function getCompanyPlanContextFromUid(
  uid: string
): Promise<CompanyPlanContext> {
  // 1) Look up auth user custom claims first (fast path)
  const userRecord = await adminAuth.getUser(uid);
  const claims = (userRecord.customClaims || {}) as any;

  if (claims.superAdmin === true || claims.role === "SUPER_ADMIN") {
    return { companyId: "SUPER_ADMIN", planId: "SUPER_ADMIN" };
  }

  const companyId =
    claims.companyId ||
    claims.tenantId ||
    null;

  if (!companyId) {
    // Fallback: treat as a personal company
    return { companyId: `user-${uid}`, planId: "FREE" };
  }

  // 2) Load company doc to determine plan
  const companySnap = await adminDb.collection("companies").doc(companyId).get();
  const companyData = companySnap.exists ? companySnap.data() || {} : {};

  const planFromDb = (companyData.plan || companyData.planId || "FREE") as PlanId;

  return {
    companyId,
    planId: planFromDb,
  };
}
