import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/email";
import { sendSMS } from "@/lib/notifications/sms";

import {
  renterVerificationSubmittedTemplate,
  adminVerificationSubmittedTemplate,
} from "@/lib/notifications/emailTemplates/verification-submitted";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token." },
        { status: 400 }
      );
    }

    const doc = await adminDb
      .collection("identityVerifications")
      .doc(token)
      .get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Verification not found." },
        { status: 404 }
      );
    }

    const data = doc.data()!;
    const renter = data.renter;

    // Renter email
    if (renter.email) {
      const tpl = renterVerificationSubmittedTemplate(renter.fullName);
      await sendEmail({
        to: renter.email,
        subject: tpl.subject,
        html: tpl.html,
      });
    }

    // Admin alert
    const adminEmails = [
      "info@rentfax.io", // SUPER_ADMIN inbox
      "support@rentfax.io", // optional
    ];

    const adminTpl = adminVerificationSubmittedTemplate({
      renter,
      id: token,
    });

    for (const adminEmail of adminEmails) {
      await sendEmail({
        to: adminEmail,
        subject: adminTpl.subject,
        html: adminTpl.html,
      });
    }

    // Optional SMS
    if (renter.phone) {
      await sendSMS(
        renter.phone,
        `RentFAX: Your verification has been submitted. We'll notify you once reviewed.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification notify error:", err);
    return NextResponse.json(
      { error: "Failed to send notifications." },
      { status: 500 }
    );
  }
}
