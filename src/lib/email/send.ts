import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: any) {
  try {
    await resend.emails.send({
      from: "RentFAX <no-reply@rentfax.io>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}
