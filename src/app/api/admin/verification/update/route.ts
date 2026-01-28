import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
