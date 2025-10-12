import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, type, title, message } = body;

    // Write Firestore notification
    await adminDB.collection("notifications").add({
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Send email (if email exists)
    if (email && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"RentFAX Alerts" <${process.env.SMTP_USER}>`,
        to: email,
        subject: title,
        html: `<p>${message}</p><hr><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View in Dashboard</a></p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notification send error:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}