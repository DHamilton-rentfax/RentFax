import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const { renterId, notes } = (await req.json()) as {
      renterId?: string;
      notes?: string;
    };

    if (!renterId) {
      return NextResponse.json(
        { error: "renterId is required" },
        { status: 400 },
      );
    }

    if (!notes || !notes.trim()) {
      return NextResponse.json(
        { error: "Notes are required for rejection" },
        { status: 400 },
      );
    }

    const renterRef = adminDb.collection("renters").doc(renterId);
    const renterSnap = await renterRef.get();

    if (!renterSnap.exists) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });
    }

    await renterRef.update({
      manualVerificationStatus: "REJECTED",
      manualVerificationNotes: notes,
      manualVerificationAt: Date.now(),
    });

    await adminDb.collection("audit_logs").add({
      type: "IDENTITY_OVERRIDE_REJECT",
      renterId,
      notes,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error in /api/admin/verification/reject:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
