import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
    console.error("Verification start error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
