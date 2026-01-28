import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { token, confirmedName, extraNotes } = await req.json();

    if (!token || !confirmedName) {
      return NextResponse.json(
        { error: "Missing token or name" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("identityRequests").doc(token);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Verification link not found" },
        { status: 404 }
      );
    }

    const data = snap.data() || {};
    if (data.status === "COMPLETED") {
      return NextResponse.json({ ok: true, alreadyCompleted: true });
    }

    await ref.update({
      status: "COMPLETED",
      confirmedName,
      extraNotes: extraNotes || null,
      completedAt: Date.now(),
    });

    // Optional: audit log
    await adminDb.collection("auditLogs").add({
      type: "IDENTITY_SELF_VERIFY_COMPLETED",
      renterName: confirmedName,
      identityRequestId: token,
      ownerUserId: data.userId ?? null,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error completing identity verification:", err);
    return NextResponse.json(
      { error: "Failed to complete verification" },
      { status: 500 }
    );
  }
}
