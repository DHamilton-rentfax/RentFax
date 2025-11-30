// src/lib/email/sendVerificationInvite.ts
"use server";

import { resend } from "./resend";
import { verificationInviteTemplate } from "./templates/verificationInvite";

interface SendVerificationInviteOptions {
  to: string;
  renterName?: string;
  companyName?: string;
  token: string;
}

export async function sendVerificationInviteEmail({
  to,
  renterName,
  companyName,
  token,
}: SendVerificationInviteOptions) {
  const verifyUrl = `${process.env.APP_URL}/renter/verify?token=${token}`;

  const { subject, html } = verificationInviteTemplate({
    renterName,
    verifyUrl,
    companyName,
  });

  await resend.emails.send({
    from: "RentFAX <no-reply@rentfax.io>",
    to,
    subject,
    html,
  });
}
