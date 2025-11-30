
// src/lib/email/resend.ts
import { Resend } from 'resend';

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
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 Email sending skipped (no RESEND_API_KEY). To: ${to}, Subject: ${subject}`);
    return { success: true, message: "Email skipped in dev environment." };
  }
  
  try {
    const result = await resend.emails.send({
      from: "RentFAX <notifications@rentfax.io>", // Replace with your verified domain
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
