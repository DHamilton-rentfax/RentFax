import { Resend } from "resend";
import twilio from "twilio";

const resend = new Resend(process.env.RESEND_API_KEY!);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendSelfVerifyNotification({
  email,
  phone,
  link,
  renterName,
}: {
  email?: string;
  phone?: string;
  link: string;
  renterName?: string;
}) {
  if (email) {
    await resend.emails.send({
      from: "RentFAX <verify@rentfax.io>",
      to: email,
      subject: "Verify your identity with RentFAX",
      html: `
        <p>Hello${renterName ? ` ${renterName}` : ""},</p>
        <p>You’ve been asked to verify your identity for a RentFAX report.</p>
        <p><a href="${link}">Verify your identity</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  if (phone) {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
      body: `RentFAX: Verify your identity here: ${link}`,
    });
  }
}
