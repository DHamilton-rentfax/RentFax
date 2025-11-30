import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone } = body;

    // Search internal renters first
    const snap = await adminDb
      .collection("renters")
      .where("email", "==", email || "")
      .limit(1)
      .get();

    let internalMatch = null;

    if (!snap.empty) {
      const doc = snap.docs[0];
      internalMatch = {
        id: doc.id,
        ...doc.data(),
      };
    }

    return NextResponse.json({
      id: internalMatch?.id || null,
      preMatchedReportId: internalMatch?.id || null,
      identityScore: internalMatch ? 90 : 40,
      fraudScore: internalMatch ? 10 : 30,
      publicProfile: {
        name: fullName,
        email,
        phone,
        address: body.address,
        licenseNumber: body.licenseNumber,
      },
    });

  } catch (err: any) {
    console.error("SEARCH RENTER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to search renter." },
      { status: 500 }
    );
  }
}
