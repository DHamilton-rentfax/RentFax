import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { renterEmail, renterPhone, landlordId, companyId } =
      await req.json();

    if (!renterEmail || !landlordId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = crypto.randomUUID();

    await adminDb.collection("verification_requests").add({
      token,
      renterEmail,
      renterPhone: renterPhone || null,
      landlordId,
      companyId: companyId || null,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("Verification create error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
