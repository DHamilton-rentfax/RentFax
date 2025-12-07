import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { enforceUsageLimit } from "@/lib/billing/enforcer";
import { trackUsage } from "@/lib/billing/track-usage";
import { enrichIdentity } from "@/lib/pdl/enrich";
import { findMatches } from "@/lib/search/find-matches";
import { computeIdentityScore } from "@/lib/search/identity-score";
import { computeFraudScore } from "@/lib/search/fraud-score";
import { checkTimeline } from "@/lib/search/timeline-check";

export async function POST(req: Request) {
  try {
    const { userId, fullName, email, phone, address } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Billing enforcement
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const companyId = userDoc.get("companyId");
    const plan = userDoc.get("subscription.plan");

    const enforce = await enforceUsageLimit(companyId, plan, "renterSearch");
    if (!enforce.allowed) {
      return NextResponse.json({
        error: enforce.message,
        hardLimit: true,
        required: "upgrade",
      }, { status: 429 });
    }

    // Perform search
    const matches = await findMatches({ fullName, email, phone });
    const enriched = await enrichIdentity({ fullName, email, phone, address });
    const identityScore = computeIdentityScore({ enriched, email, phone });
    const fraudScore = computeFraudScore({ enriched });
    const timeline = await checkTimeline(matches);

    // Track usage AFTER success
    await trackUsage(companyId, "renterSearch", 1);

    return NextResponse.json({
      matches,
      enriched,
      identityScore,
      fraudScore,
      hasTimeline: timeline.exists,
      timelineId: timeline.timelineId ?? null,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}