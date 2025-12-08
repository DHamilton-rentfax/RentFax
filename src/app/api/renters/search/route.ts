// src/app/api/renters/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

/* ------------------ RISK ENGINE IMPORTS ------------------ */
import { computeRiskScore } from "@/lib/risk/computeRiskScore";
import { computeConfidenceScore } from "@/lib/risk/computeConfidenceScore";
import { detectSignals } from "@/lib/risk/detectSignals";

/* ------------------ TYPE ------------------ */
type SearchPayload = {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  state?: string | null;
  licenseNumber?: string | null;
};

/* ------------------ ROUTE HANDLER ------------------ */
export async function POST(req: NextRequest) {
  try {
    const body: SearchPayload = await req.json();
    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      state,
      licenseNumber,
    } = body;

    /* -------------------------------------------------------
     *  1. INPUT VALIDATION
     * ------------------------------------------------------ */
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
     *  2. ATTEMPT TO LOCATE MATCHED RENTER PROFILE
     * ------------------------------------------------------ */
    let matchedDoc: FirebaseFirestore.DocumentSnapshot | null = null;

    const col = adminDb.collection("renters");
    const query = await col
      .where("fullName_lower", "==", fullName.toLowerCase().trim())
      .limit(5)
      .get();

    if (!query.empty) {
      matchedDoc = query.docs[0];
    }

    /* -------------------------------------------------------
     *  CASE A — NO MATCH
     * ------------------------------------------------------ */
    if (!matchedDoc) {
      return NextResponse.json({
        matchType: "none",
        id: null,
        risk: null,
      });
    }

    const renterId = matchedDoc.id;
    const renterData = matchedDoc.data() || {};

    /* -------------------------------------------------------
     *  3. GATHER INCIDENT HISTORY, DISPUTES, PAYMENTS
     * ------------------------------------------------------ */
    const incidentsSnap = await adminDb
      .collection("incidents")
      .where("renterId", "==", renterId)
      .get();

    const disputesSnap = await adminDb
      .collection("disputes")
      .where("renterId", "==", renterId)
      .get();

    const incidents = incidentsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const disputes = disputesSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* -------------------------------------------------------
     *  4. DETECT SIGNALS
     * ------------------------------------------------------ */
    const signals = detectSignals({
      renter: renterData,
      incidents,
      disputes,
      payload: body,
    });

    /* -------------------------------------------------------
     *  5. COMPUTE RISK SCORE (0–100, UI renders 300–900)
     * ------------------------------------------------------ */
    const riskScore = computeRiskScore({
      renter: renterData,
      incidents,
      disputes,
      signals,
    });

    /* -------------------------------------------------------
     *  6. COMPUTE CONFIDENCE SCORE (accuracy of match)
     * ------------------------------------------------------ */
    const confidenceScore = computeConfidenceScore({
      renter: renterData,
      payload: body,
      signals,
    });

    /* -------------------------------------------------------
     *  7. FIND LINKed FULL REPORT (if exists)
     * ------------------------------------------------------ */
    let preMatchedReportId: string | null = null;

    const reportSnap = await adminDb
      .collection("reports")
      .where("renterId", "==", renterId)
      .limit(1)
      .get();

    if (!reportSnap.empty) {
      preMatchedReportId = reportSnap.docs[0].id;
    }

    /* -------------------------------------------------------
     *  8. RESPONSE — UNIFIED RESULT
     * ------------------------------------------------------ */
    return NextResponse.json({
      id: renterId,
      matchType: "single",

      /* Identity similarity placeholder — your existing logic can replace this */
      identityScore: 92,

      /* Unified Risk Object */
      risk: {
        riskScore,
        confidenceScore,
        signals,
      },

      publicProfile: {
        name: renterData.fullName ?? renterData.name,
        email: renterData.email ?? null,
        phone: renterData.phone ?? null,
        address: renterData.address ?? null,
        licenseNumber: renterData.licenseNumber ?? null,
      },

      preMatchedReportId,
      unlocked: false,
    });
  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
