import twilio from 'twilio'

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!)

export async function sendSMS({ to, body }: { to: string; body: string }) {
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE!,
    to,
  })
}
