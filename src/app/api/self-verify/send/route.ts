import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import crypto from "crypto";
import { sendSelfVerifyNotification } from "@/lib/notifications/sendSelfVerify";

export async function POST(req: Request) {
  const body = await req.json();
  const { reportId, renter } = body;

  if (!reportId || !renter?.email) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24h

  await adminDb.collection("self_verifications").doc(token).set({
    reportId,
    renter,
    status: "pending",
    createdAt: Date.now(),
    expiresAt,
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/verify/self/${token}`;

  await sendSelfVerifyNotification({
    email: renter.email,
    phone: renter.phone,
    link,
    renterName: renter.fullName,
  });

  return NextResponse.json({ success: true });
}
