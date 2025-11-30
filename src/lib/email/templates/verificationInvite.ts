// src/lib/email/templates/verificationInvite.ts

interface VerificationInviteParams {
  renterName?: string;
  verifyUrl: string;
  companyName?: string;
}

export function verificationInviteTemplate({
  renterName,
  verifyUrl,
  companyName,
}: VerificationInviteParams) {
  const safeName = renterName || "there";
  const sender = companyName || "a RentFAX partner";

  return {
    subject: "Complete your RentFAX identity verification",
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
        <h2>Hi ${safeName},</h2>
        <p>${sender} is using RentFAX to safely verify renter identity and prevent fraud.</p>
        <p>To continue, please complete a quick identity verification. This helps protect both you and the property owner.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" 
             style="background:#1E40AF;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
            Start Verification
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
        <p style="font-size:12px;color:#6b7280;">You received this email because someone requested verification through RentFAX. 
        If this wasn't you, you can safely ignore this email.</p>
      </div>
    `,
  };
}
