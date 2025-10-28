// ===========================================
// RentFAX | Send Email Receipt API
// Location: src/app/api/email/send-receipt/route.ts
// ===========================================
import { NextResponse } from "next/server";

// In a real app, you'd use a library like @sendgrid/mail or nodemailer
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required email parameters" }, { status: 400 });
    }

    // Placeholder for sending email
    console.log("--- SENDING EMAIL ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:", html);
    console.log("---------------------");

    // const msg = { to, from: 'receipts@rentfax.io', subject, html };
    // await sgMail.send(msg);

    return NextResponse.json({ success: true, message: "Email sent (mocked)" });

  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
