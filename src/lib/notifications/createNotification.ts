import { db } from '@/firebase/client'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { sendEmail } from './sendEmail'
import { sendSMS } from './sendSMS'

export async function createNotification({ userId, type, message, link, email, phone }: {
    userId: string,
    type: 'dispute' | 'system' | 'billing' | 'alert',
    message: string,
    link?: string,
    email?: string,
    phone?: string,
}) {
  await addDoc(collection(db, 'notifications'), {
    userId, type, message, link: link || null, read: false, createdAt: serverTimestamp()
  })

  // Optional email + SMS
  if (email) await sendEmail({ to: email, subject: 'RentFAX Notification', html: `<p>${message}</p>` })
  if (phone) await sendSMS({ to: phone, message })
}
