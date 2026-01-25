import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const token = crypto.randomUUID();

    await adminDb.collection("verification_requests").add({
      email,
      token,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
