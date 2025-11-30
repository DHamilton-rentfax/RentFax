import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, status: 'APPROVED' | 'REJECTED', notes: string) {
  const subject = `Your RentFAX Verification Status: ${status}`;
  const body = `
    <p>Your RentFAX verification has been reviewed.</p>
    <p>Status: <strong>${status}</strong></p>
    <p>Reviewer Notes: ${notes}</p>
    <p>You can now log in to your RentFAX account to view your full report and dispute any inaccuracies.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: body,
  });
}