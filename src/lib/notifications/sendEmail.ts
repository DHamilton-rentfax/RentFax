import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    await resend.emails.send({
      from: 'RentFAX <noreply@rentfax.com>',
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (err: any) {
    console.error('Email error:', err)
    return { success: false, message: err.message }
  }
}
