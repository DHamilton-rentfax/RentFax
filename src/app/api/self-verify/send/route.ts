import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/email";
import { sendSMS } from "@/lib/notifications/sms";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { searchSessionId, renter } = await req.json();

    const { fullName, email, phone } = renter;
    if (!fullName || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and at least one contact method required." },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomUUID();
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?id=${token}`;

    // Save in Firestore
    await adminDb.collection("identityRequests").doc(token).set({
      token,
      searchSessionId: searchSessionId ?? null,
      renterName: fullName,
      renterEmail: email ?? null,
      renterPhone: phone ?? null,
      status: "PENDING",
      createdAt: Date.now(),
    });

    // Send SMS
    if (phone) {
      await sendSMS(phone, {
        message: `Your RentFAX verification link: ${verifyUrl}`,
      });
    }

    // Send email
    if (email) {
      await sendEmail(email, "Verify your identity", {
        verifyUrl,
        renterName: fullName,
      });
    }

    return NextResponse.json({ ok: true, verifyUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to send verification" },
      { status: 500 }
    );
  }
}
