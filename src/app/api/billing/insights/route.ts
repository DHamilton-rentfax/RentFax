import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { generatePlanRecommendation } from "@/lib/billing/recommend";
import { determineUpsellLevel } from "@/lib/billing/upsell";
import { storeBillingInsights } from "@/lib/billing/store-insights";
import { PLAN_LIMITS } from "@/lib/billing/limits";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  const admin = url.searchParams.get("admin") === "1";

  if (admin) {
    const companiesSnap = await adminDb.collection("companies").get();
    const result = [];

    for (const doc of companiesSnap.docs) {
      const companyId = doc.id;
      const company = doc.data();
      const plan = company?.subscription?.plan || "free";

      const summarySnap = await adminDb
        .collection("companies")
        .doc(companyId)
        .collection("usageSummary")
        .doc("current")
        .get();

      const usage = summarySnap.data() || {};

      const rec = generatePlanRecommendation(plan, usage);
      const level = determineUpsellLevel(plan, rec);

      await storeBillingInsights(companyId, { rec, level });

      result.push({
        id: companyId,
        name: company.name,
        plan,
        usage,
        rec,
        level,
      });
    }

    return NextResponse.json(result);
  }

  // Company dashboard mode
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 401 });

  const userDoc = await adminDb.collection("users").doc(uid).get();
  const companyId = userDoc.get("companyId");

  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const plan = companyDoc.get("subscription.plan") || "free";

  const summarySnap = await adminDb
    .collection("companies")
    .doc(companyId)
    .collection("usageSummary")
    .doc("current")
    .get();

  const usage = summarySnap.data() || {};
  const rec = generatePlanRecommendation(plan, usage);
  const level = determineUpsellLevel(plan, rec);

  await storeBillingInsights(companyId, { rec, level });

  return NextResponse.json({ usage, rec, level });
}
