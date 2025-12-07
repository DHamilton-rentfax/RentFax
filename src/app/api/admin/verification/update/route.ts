import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { token, status, adminNote } = await req.json();

    if (!token || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await adminDb.collection("identityVerifications").doc(token).update({
      status,
      adminNote: adminNote || "",
      reviewedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verification update failed:", err);
    return NextResponse.json(
      { error: "Failed to update verification." },
      { status: 500 }
    );
  }
}
