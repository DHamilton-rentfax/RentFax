import { sendEmail } from '@/lib/notifications/sendEmail'
import { sendSMS } from '@/lib/notifications/sendSMS'
import { logNotification } from '@/lib/notifications/logNotification'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { type, to, message, subject } = await req.json()

  try {
    if (type === 'email') {
      await sendEmail({ to, subject, html: message })
    } else if (type === 'sms') {
      await sendSMS({ to, body: message })
    }

    await logNotification({ to, type, message, subject, status: 'sent' })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Notification error:', err)
    await logNotification({ to, type, message, subject, status: 'failed', error: err.message })
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
