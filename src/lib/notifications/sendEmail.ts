import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })

  await transporter.sendMail({
    from: `"RentFAX Notifications" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}
