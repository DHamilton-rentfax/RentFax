// src/app/api/admin/identity/override/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renterId, status, notes } = body as {
      renterId?: string;
      status?: "PENDING" | "APPROVED" | "REJECTED";
      notes?: string;
    };

    if (!renterId || !status) {
      return NextResponse.json(
        { error: "Missing renterId or status" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("renters").doc(renterId);

    await ref.update({
      manualVerificationStatus: status,
      manualVerificationNotes: notes ?? "",
      manualVerificationAt: Date.now(),
    });

    await adminDb.collection("audit_logs").add({
      type: "IDENTITY_OVERRIDE",
      renterId,
      status,
      notes: notes ?? "",
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
