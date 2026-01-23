import type React from "react";
import { resend } from "@/lib/email/resend";

const FROM = "RentFAX <notifications@rentfax.io>";

type SendEmailParams = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  attachments?: {
    filename: string;
    content: string; // base64
  }[];
};

export async function sendEmail({
  to,
  subject,
  react,
  attachments,
}: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Email skipped (no RESEND_API_KEY)");
    return { skipped: true };
  }

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    react,
    attachments,
  });
}
