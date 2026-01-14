import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/* -------------------------------------------------------------------------- */
/* SELF VERIFICATION COMPLETION                                                */
/* -------------------------------------------------------------------------- */
/*
  Responsibilities:
  - Validate verification token
  - Ensure token is pending & not expired
  - Verify renter identity
  - Log audit trail
  - Invalidate token
  - DOES NOT unlock or create reports
*/

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const tokenRef = adminDb.collection("self_verifications").doc(token);
  const tokenSnap = await tokenRef.get();

  if (!tokenSnap.exists) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const data = tokenSnap.data()!;

  if (data.status !== "pending") {
    return NextResponse.json({ error: "Token already used" }, { status: 400 });
  }

  if (data.expiresAt?.toMillis && Date.now() > data.expiresAt.toMillis()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  const renterRef = adminDb.collection("renters").doc(data.renterId);

  await adminDb.runTransaction(async (tx) => {
    const renterSnap = await tx.get(renterRef);

    if (!renterSnap.exists) {
      throw new Error("Renter not found");
    }

    // ✅ Verify renter
    tx.update(renterRef, {
      verified: true,
      verificationMethod: "SELF",
      verifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // ✅ Invalidate token
    tx.update(tokenRef, {
      status: "verified",
      verifiedAt: FieldValue.serverTimestamp(),
    });

    // ✅ Audit log
    tx.set(adminDb.collection("auditLogs").doc(), {
      action: "RENTER_SELF_VERIFIED",
      renterId: data.renterId,
      orgId: data.orgId,
      performedBy: "RENTER",
      verificationMethod: "SELF",
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return NextResponse.json({ success: true });
}
