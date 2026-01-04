import { sendEmail } from "@/lib/resend";

export async function sendDisputeConfirmation(
  renterEmail: string,
  reportNameId: string
) {
  return sendEmail({
    to: renterEmail,
    subject: "Your RentFAX dispute has been submitted",
    html: `
      <p>Your dispute for report <strong>${reportNameId}</strong> has been received.</p>
      <p>An administrator will review it. You’ll be notified once a decision is made.</p>
      <p>— RentFAX Trust & Safety</p>
    `,
  });
}
