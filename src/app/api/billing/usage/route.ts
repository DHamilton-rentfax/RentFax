import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { PLAN_LIMITS } from "@/lib/billing/limits";
import { forecastUsage } from "@/lib/billing/forecast";

function daysSince(date: number) {
  return (Date.now() - date) / (1000 * 60 * 60 * 24);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isAdmin = url.searchParams.get("admin") === "1";

  if (isAdmin) {
    const companiesSnap = await adminDb.collection("companies").get();
    const companies = [];

    for (const doc of companiesSnap.docs) {
      const id = doc.id;
      const company = doc.data();
      const plan = company.subscription?.plan || "free";
      const cycleStartDate = company.subscription?.startDate || Date.now();
      const daysUsed = Math.max(1, daysSince(cycleStartDate));

      const summarySnap = await adminDb
        .collection("companies")
        .doc(id)
        .collection("usageSummary")
        .doc("current")
        .get();

      const usage = summarySnap.exists ? summarySnap.data() : {};
      const limits = PLAN_LIMITS[plan];
      const forecasts = {};
      const recommendations = [];

      Object.keys(usage).forEach((event) => {
        if (event === "updatedAt") return;
        const limit = limits[event];
        if (limit === Infinity) return;

        const forecast = forecastUsage(usage[event], limit, daysUsed);
        forecasts[event] = forecast;

        if (forecast.willExceed) {
          recommendations.push(`Projected to exceed ${event} limit.`);
        }
      });

      const overLimit = Object.keys(usage).some((event) => {
        return limits[event] !== Infinity && usage[event] > limits[event];
      });

      companies.push({
        id,
        name: company.name,
        plan,
        usage,
        limits,
        overLimit,
        forecasts,
        recommendations,
      });
    }

    return NextResponse.json({ companies });
  }

  const uid = url.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 401 });

  const userDoc = await adminDb.collection("users").doc(uid).get();
  const companyId = userDoc.get("companyId");

  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const companyData = companyDoc.data();
  const plan = companyData.subscription?.plan || "free";
  const cycleStartDate = companyData.subscription?.startDate || Date.now();
  const daysUsed = Math.max(1, daysSince(cycleStartDate));

  const summarySnap = await adminDb
    .collection("companies")
    .doc(companyId)
    .collection("usageSummary")
    .doc("current")
    .get();

  const usage = summarySnap.exists ? summarySnap.data() : {};
  const limits = PLAN_LIMITS[plan];
  const forecasts = {};
  const recommendations = [];

  const warnings = Object.keys(usage)
    .map((event) => {
      if (event === "updatedAt") return null;
      const limit = limits[event];
      if (limit === Infinity) return null;

      const forecast = forecastUsage(usage[event], limit, daysUsed);
      forecasts[event] = forecast;

      if (forecast.willExceed) {
        recommendations.push(
          `You are projected to exceed your ${event} limit this cycle. We recommend upgrading your plan.`
        );
      }

      const percent = Math.round((usage[event] / limit) * 100);

      if (percent >= 50 && percent < 100) {
        return { event, percent, forecast };
      }
      return null;
    })
    .filter(Boolean);

  return NextResponse.json({ usage, limits, warnings, forecasts, recommendations });
}
