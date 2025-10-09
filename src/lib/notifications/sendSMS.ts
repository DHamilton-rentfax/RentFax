import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendSMS({
  to,
  message,
}: {
  to: string
  message: string
}) {
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE!,
      to,
      body: message,
    })
    return { success: true }
  } catch (err: any) {
    console.error('SMS error:', err)
    return { success: false, message: err.message }
  }
}
