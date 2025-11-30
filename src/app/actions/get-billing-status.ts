import { adminDB } from "@/firebase/server";
import {
  enforceSearchPermission,
  enforceFullReportPermission,
} from "@/lib/billing/enforce";
import type { PermissionResult } from "@/lib/billing/enforce";

export interface BillingStatus {
  search: PermissionResult;
  report: PermissionResult;
  credits: number;
  plan: string;
}

async function getCredits(userId: string): Promise<number> {
  const snap = await adminDB.collection("credits").doc(userId).get();
  return snap.exists ? snap.data()?.count ?? 0 : 0;
}

async function getUserPlan(userId: string): Promise<string> {
  const userSnap = await adminDB.collection("users").doc(userId).get();
  if (!userSnap.exists) return "FREE";
  const user = userSnap.data()!;
  return user.subscription?.planId || "FREE";
}

export async function getBillingStatus(userId: string): Promise<BillingStatus> {
  const [search, report, credits, plan] = await Promise.all([
    enforceSearchPermission(userId),
    enforceFullReportPermission(userId),
    getCredits(userId),
    getUserPlan(userId),
  ]);

  return {
    search,
    report,
    credits,
    plan,
  };
}
