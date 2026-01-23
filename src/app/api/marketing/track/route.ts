import { NextRequest, NextResponse } from "next/server";


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Simple hook: send signup to CRM email list
 */
export async function POST(req: NextRequest) {
  const { email, type } = await req.json();

  // Example: push into SendGrid contacts
  await sgMail.send({
    to: "marketing@rentfax.ai",
    from: "noreply@rentfax.ai",
    subject: `New ${type} signup`,
    text: `User ${email} signed up.`,
  });

  return NextResponse.json({ ok: true });
}
