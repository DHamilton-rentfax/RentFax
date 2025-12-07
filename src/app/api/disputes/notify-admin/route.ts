import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { renterEmail, incidentId, description } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"RentFAX Alerts" <${process.env.ADMIN_EMAIL_USER}>`,
      to: "info@rentfax.io",
      subject: `New Dispute Submitted - Incident ${incidentId}`,
      html: `
        <h3>New Dispute Submitted</h3>
        <p><strong>Renter:</strong> ${renterEmail}</p>
        <p><strong>Incident ID:</strong> ${incidentId}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
