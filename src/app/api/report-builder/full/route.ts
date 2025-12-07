import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renterId } = body;

    const renterDoc = await adminDb.collection("renters").doc(renterId).get();

    if (!renterDoc.exists) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });
    }

    const renter = renterDoc.data()!;

    const fullReport = {
      renter,
      verification: {
        status: renter.verificationStatus || "unverified",
        verifiedAt: renter.verifiedAt || null,
        verificationId: renter.verificationId || null,
      },
      // ... other report data
    };

    return NextResponse.json(fullReport);
  } catch (error) {
    console.error("Full report builder error:", error);
    return NextResponse.json(
      { error: "Failed to build full report." },
      { status: 500 }
    );
  }
}
