import { sendEmail } from "@/lib/email/send";

export async function sendAdminMonitorNotification({ phone, status }) {
  await sendEmail({
    to: "admin@rentfax.io",
    subject: "Verification Event Logged",
    html: `
      <p>Verification event recorded:</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Status:</strong> ${status}</p>
    `,
  });
}
