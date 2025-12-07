import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Sends renter a magic login link via email.
 */
export async function POST(req: NextRequest) {
  const { orgId, renterId, email } = await req.json();

  // Validate renter
  const doc = await adminDB.doc(`orgs/${orgId}/renters/${renterId}`).get();
  if (!doc.exists || doc.get("email") !== email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Simple token (in real use JWT or Firebase custom token)
  const token = Buffer.from(`${orgId}:${renterId}`).toString("base64");

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/renter/portal?token=${token}`;

  await sgMail.send({
    to: email,
    from: "noreply@rentfax.ai",
    subject: "Your Secure Renter Portal Link",
    text: `Access your renter portal: ${url}`,
  });

  return NextResponse.json({ ok: true });
}
