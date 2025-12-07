import { NextResponse } from "next/server";
import { enrichIdentity } from "@/lib/pdl/enrich";
import { findMatches } from "@/lib/search/find-matches";
import { computeIdentityScore } from "@/lib/search/identity-score";
import { computeFraudScore } from "@/lib/search/fraud-score";
import { checkTimeline } from "@/lib/search/timeline-check";

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, address } = await req.json();

    if (!fullName?.trim()) {
      return NextResponse.json({ error: "Full name required" }, { status: 400 });
    }

    // 1) Search Firestore for historical matches
    const candidates = await findMatches({ fullName, email, phone });

    // 2) Try PDL enrichment
    const enriched = await enrichIdentity({ fullName, email, phone, address });

    // 3) Scoring
    const identityScore = computeIdentityScore({ enriched, email, phone });
    const fraudScore = computeFraudScore({ enriched });

    // 4) Check if any matching renter has a timeline
    const timeline = await checkTimeline(candidates);

    return NextResponse.json({
      preview: {
        masked: {
          name: fullName,
          email: email ? maskEmail(email) : null,
          phone: phone ? maskPhone(phone) : null,
        },
        identityScore,
        fraudScore,
        enriched: {
          city: enriched?.city ?? null,
          ageRange: enriched?.ageRange ?? null,
        },
        hasTimeline: timeline.exists,
      },
      session: timeline.sessionId, // optional for later
      requiresLogin: false,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return name[0] + "***@" + domain;
}

function maskPhone(phone: string) {
  return "***-***-" + phone.slice(-4);
}