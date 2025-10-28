import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();

    // --- Call your verification API (mock) ---
    const verifiedData = {
      identityScore: 95,
      fraudSignals: [],
      addressMatch: true,
    };

    // --- Update renter record ---
    await updateDoc(doc(db, "renterReports", renterId), {
      verified: true,
      status: "verified",
      verifiedData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
