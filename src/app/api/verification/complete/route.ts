import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const {
      token,
      personalInfo,
      idFrontUrl,
      idBackUrl,
      selfieUrl,
    } = await req.json();

    if (!token || !personalInfo || !idFrontUrl || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const snap = await adminDb
      .collection("verification_requests")
      .where("token", "==", token)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const ref = snap.docs[0].ref;

    await ref.update({
      status: "completed",
      personalInfo,
      idFrontUrl,
      idBackUrl: idBackUrl || null,
      selfieUrl,
      completedAt: FieldValue.serverTimestamp(),
      token: FieldValue.delete(), // one-time use
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Verification completion error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
