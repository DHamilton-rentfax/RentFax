import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: any) {
  return await resend.emails.send({
    from: "RentFAX <noreply@rentfax.io>",
    to,
    subject,
    html,
  });
}
