import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";

export async function POST(req: Request) {
  try {
    const { renterName, incidentId } = await req.json();

    if (!renterName || !incidentId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await sendEmail({
      to: "info@rentfax.io",
      subject: "New Dispute Submitted",
      react: (
        <div>
          <p>A new dispute has been submitted.</p>
          <p>
            <strong>Renter:</strong> {renterName}
          </p>
          <p>
            <strong>Incident ID:</strong> {incidentId}
          </p>
        </div>
      ),
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
