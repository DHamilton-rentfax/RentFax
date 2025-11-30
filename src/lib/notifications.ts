import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_PASS,
  },
});

export async function sendDisputeNotification({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  try {
    await transporter.sendMail({
      from: `"RentFAX Notifications" <${process.env.NOTIFY_EMAIL}>`,
      to,
      subject,
      html: message,
    });
    console.log("✅ Notification sent to", to);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
