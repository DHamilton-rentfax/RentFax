import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const payload = await req.json();

    const {
      memberId,
      fullName,
      email,
      phone,
    } = payload;

    /* --------------------------------------------------
     *  FAST PATH: MEMBER ID (EXACT MATCH)
     * -------------------------------------------------- */
    if (memberId) {
      const snap = await adminDb
        .collection("renters")
        .where("memberId", "==", memberId)
        .limit(1)
        .get();

      if (snap.empty) {
        return NextResponse.json({
          found: false,
          verified: false,
          hasReport: false,
          confidence: {
            score: 0,
            level: "low",
          },
        });
      }

      const renter = snap.docs[0].data();

      return NextResponse.json({
        found: true,
        verified: Boolean(renter.verified),
        hasReport: Boolean(renter.hasReport),
        memberId: renter.memberId,
        confidence: {
          score: 100,
          level: "high",
          reasons: ["Exact Member ID match"],
        },
        publicProfile: {
          name: renter.fullName,
          city: renter.city,
          state: renter.state,
        },
      });
    }

    /* --------------------------------------------------
     *  FALLBACK: SOFT MATCH (NAME / EMAIL / PHONE)
     * -------------------------------------------------- */
    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "Full name or Member ID required" },
        { status: 400 }
      );
    }

    const snap = await adminDb
      .collection("renters")
      .where("normalizedName", "==", fullName.trim().toLowerCase())
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({
        found: false,
        verified: false,
        hasReport: false,
        confidence: {
          score: 20,
          level: "low",
        },
      });
    }

    const renter = snap.docs[0].data();

    return NextResponse.json({
      found: true,
      verified: Boolean(renter.verified),
      hasReport: Boolean(renter.hasReport),
      memberId: renter.memberId,
      confidence: {
        score: renter.matchScore ?? 75,
        level:
          renter.matchScore >= 85
            ? "high"
            : renter.matchScore >= 50
            ? "medium"
            : "low",
      },
      publicProfile: {
        name: renter.fullName,
        city: renter.city,
        state: renter.state,
      },
    });
  } catch (err) {
    console.error("Public renter search failed", err);
    return NextResponse.json(
      { error: "Unable to complete search" },
      { status: 500 }
    );
  }
}
