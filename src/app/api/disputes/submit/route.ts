import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { renterId, incidentId, companyId, disputeReason } = body;

    // 1. Get company's strict verification setting
    const companyRef = adminDb.collection("companies").doc(companyId);
    const companySnap = await companyRef.get();
    const companyData = companySnap.data();
    const isStrict = companyData?.settings?.strictVerification === true;

    if (isStrict) {
      // 2. If strict, check renter's identity status
      const renterRef = adminDb.collection("renters").doc(renterId);
      const renterSnap = await renterRef.get();
      const renterData = renterSnap.data();

      if (renterData?.identityStatus !== 'verified') {
        return NextResponse.json(
          { 
            error: "Identity verification is required before you can dispute incidents.",
            code: 'IDENTITY_VERIFICATION_REQUIRED'
          },
          { status: 403 }
        );
      }
    }

    // 3. Proceed with dispute creation logic
    // ... (Your existing dispute creation logic would go here)

    await adminDb.collection("disputes").add({
        renterId,
        incidentId,
        companyId,
        disputeReason,
        status: 'new',
        createdAt: Date.now(),
    });

    // Add to audit log
    await adminDb.collection("auditLogs").add({
        type: "DISPUTE_SUBMITTED",
        renterId,
        incidentId,
        companyId,
        timestamp: Date.now(),
        wasVerified: companyData?.identityStatus === 'verified',
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Dispute submission failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
