import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";

export async function POST(req: Request) {
  try {
    const { renterName, incidentId } = await req.json();

    if (!renterName || !incidentId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const emailText = `A new dispute has been submitted.\nRenter: ${renterName}\nIncident ID: ${incidentId}`;

    await sendEmail({
      to: "info@rentfax.io",
      subject: "New Dispute Submitted",
      text: emailText,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Dispute admin notify error:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
