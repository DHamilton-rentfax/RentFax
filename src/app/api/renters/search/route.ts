// src/app/api/renters/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/* ------------------ PROVISIONING & IDENTITY ------------------ */
import { getOrgProvisioning } from "@/lib/provisioning/getOrgProvisioning";
import { getIdentityProvider } from "@/lib/identity/identityService";

/* ------------------ RISK ENGINE ------------------ */
import { computeRiskScore } from "@/lib/risk/computeRiskScore";
import { computeConfidenceScore } from "@/lib/risk/computeConfidenceScore";
import { detectSignals } from "@/lib/risk/detectSignals";

/* ------------------ TYPES ------------------ */
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

type RenterRecord = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
};

/* ------------------ ROUTE ------------------ */
export async function POST(req: NextRequest) {
  try {
    /* -------------------------------------------------------
     * ORG + PROVISIONING
     * ------------------------------------------------------ */
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "Organization context missing" },
        { status: 401 }
      );
    }

    const prov = await getOrgProvisioning(orgId);
    if (!prov.isActive) {
      return NextResponse.json(
        { error: "Account inactive" },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
     * INPUT
     * ------------------------------------------------------ */
    const body: SearchPayload = await req.json();

    if (!body.fullName || body.fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    const normalizedIdentityInput = {
      name: body.fullName,
      email: body.email ?? undefined,
      phone: body.phone ?? undefined,
      address: body.address ?? undefined,
    };

    /* -------------------------------------------------------
     * INTERNAL MATCH
     * ------------------------------------------------------ */
    const rentersSnap = await adminDb
      .collection("renters")
      .where("fullName_lower", "==", body.fullName.toLowerCase().trim())
      .limit(1)
      .get();

    if (rentersSnap.empty) {
      const identityProvider = getIdentityProvider();
      await identityProvider.verify(normalizedIdentityInput);

      return NextResponse.json({
        matchType: "none",
        id: null,
        risk: null,
      });
    }

    const renterDoc = rentersSnap.docs[0];
    const renterId = renterDoc.id;
    const renter = renterDoc.data() as RenterRecord;

    /* -------------------------------------------------------
     * INCIDENTS & DISPUTES
     * ------------------------------------------------------ */
    const incidentsSnap = await adminDb
      .collection("incidents")
      .where("renterId", "==", renterId)
      .get();

    const disputesSnap = await adminDb
      .collection("disputes")
      .where("renterId", "==", renterId)
      .get();

    const incidents = incidentsSnap.docs.map(d => d.data());
    const disputes = disputesSnap.docs.map(d => d.data());

    /* -------------------------------------------------------
     * SIGNALS (MATCHES LIB TYPE)
     * ------------------------------------------------------ */
    const signals = detectSignals({
      renter,
      incidents,
      disputes,
    });

    /* -------------------------------------------------------
     * SCORES (MATCHES LIB TYPE)
     * ------------------------------------------------------ */
    const riskScore = computeRiskScore({
      renter,
      incidents,
      disputes,
      signals,
    });

    const confidenceScore = computeConfidenceScore({
      renter,
      signals,
    });

    /* -------------------------------------------------------
     * IDENTITY SIGNAL (LOG ONLY)
     * ------------------------------------------------------ */
    const identityProvider = getIdentityProvider();
    const identityResult = await identityProvider.verify(
      normalizedIdentityInput
    );

    await adminDb.collection("identity_signals").add({
      orgId,
      renterId,
      provider: identityResult.provider,
      confidence: identityResult.confidence,
      verified: identityResult.verified,
      createdAt: FieldValue.serverTimestamp(),
    });

    /* -------------------------------------------------------
     * RESPONSE
     * ------------------------------------------------------ */
    return NextResponse.json({
      id: renterId,
      matchType: "single",
      identityScore: identityResult.confidence,
      risk: {
        riskScore,
        confidenceScore,
        signals,
      },
      publicProfile: {
        name: renter.fullName ?? null,
        email: renter.email ?? null,
        phone: renter.phone ?? null,
        address: renter.address ?? null,
        licenseNumber: renter.licenseNumber ?? null,
      },
      unlocked: false,
    });
  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
