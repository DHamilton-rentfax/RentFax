import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { uid, role, verificationStatus, verificationNotes, publicEvidence } = await req.json();
    const collection = role === "legal" ? "legalPartners" : "collectionAgencies";

    await adminDB.collection(collection).doc(uid).update({
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
