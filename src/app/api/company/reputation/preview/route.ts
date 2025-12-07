import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const companyId = req.headers.get("company-id");
  if (!companyId) {
    return NextResponse.json({ error: "Missing company ID" });
  }

  const behaviorDoc = await adminDb
    .collection("companyBehaviorMetrics")
    .doc(companyId)
    .get();

  const badgesDoc = await adminDb
    .collection("companyBadges")
    .doc(companyId)
    .get();

  return NextResponse.json({
    categories: {
      disputeResolution: behaviorDoc.data()?.disputesResolved || 0,
      incidentBehavior: behaviorDoc.data()?.totalIncidents || 0,
      transparency: behaviorDoc.data()?.transparencyScore || 0,
      compliancePassed: [
        behaviorDoc.data()?.verificationStatus,
        behaviorDoc.data()?.insuranceStatus,
        behaviorDoc.data()?.fairHousingStatus,
      ].filter(Boolean).length,
    },
    badges: badgesDoc.data()?.badges || [],
    scoreVisible: false, // locked
    message:
      "Your full RentFAX Reputation Score is currently in development and not visible yet.",
  });
}
