import { dbAdmin } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { disputeId, status, resolutionOutcome, adminNotes } = await req.json();

    if (!disputeId) return NextResponse.json({ error: "Missing disputeId" }, { status: 400 });

    const ref = dbAdmin.collection("disputes").doc(disputeId);
    await ref.update({
      status,
      resolutionOutcome: resolutionOutcome || null,
      adminNotes: adminNotes || "",
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error updating dispute:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
