import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/email";
import { sendSMS } from "@/lib/notifications/sms";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, renterData } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone required." },
        { status: 400 }
      );
    }

    // Create 24-hour token
    const token = crypto.randomBytes(24).toString("hex");

    await adminDb.collection("renter_verification_links").doc(token).set({
      renterData,
      email: email || null,
      phone: phone || null,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    });

    const url = `https://rentfax.io/verify?id=${token}`;

    if (email) {
      await sendEmail({
        to: email,
        subject: "RentFAX — Complete Your Verification",
        html: `
          <p>Hello,</p>
          <p>Please verify your identity to continue:</p>
          <a href="${url}">${url}</a>
        `,
      });
    }

    if (phone) {
      await sendSMS(phone, `Complete your RentFAX verification: ${url}`);
    }

    return NextResponse.json({ ok: true, url });

  } catch (err: any) {
    console.error("SEND SELF-VERIFY ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send verification link." },
      { status: 500 }
    );
  }
}
