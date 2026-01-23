// src/lib/email/resend.ts
import { Resend } from "resend";
import type React from "react";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Email functionality will be disabled.");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generic email sender helper for any part of the app.
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `📧 Email skipped (no RESEND_API_KEY). To: ${to}, Subject: ${subject}`
    );
    return { success: true, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: "RentFAX <notifications@rentfax.io>", // must be a verified sender
      to,
      subject,
      react,
    });

    return { success: true, result };
  } catch (err: any) {
    console.error("❌ Resend email error:", err);
    return { success: false, error: err.message };
  }
}
