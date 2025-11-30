import { Resend } from "resend";
import { getUserEmail } from "./userLookup";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ toUserId, subject, html }) {
  const toEmail = await getUserEmail(toUserId);
  
  if (!toEmail) return;

  await resend.emails.send({
    from: "RentFAX Notifications <noreply@rentfax.io>",
    to: toEmail,
    subject,
    html
  });
}
