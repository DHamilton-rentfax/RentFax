import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { uid, role, verificationStatus, verificationNotes, publicEvidence } = await req.json();
    const collection = role === "legal" ? "legalPartners" : "collectionAgencies";

    await adminDb.collection(collection).doc(uid).update({
      verified: verificationStatus === "verified",
      verificationStatus,
      verificationNotes,
      publicEvidence,
      verifiedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verification update failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
