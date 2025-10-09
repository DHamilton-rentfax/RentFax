import { db } from '@/firebase/client'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { sendEmail } from '@/lib/notifications/sendEmail'
import { sendSMS } from '@/lib/notifications/sendSMS'

export async function verifyRenter({ id, name, email, code }: any) {
  if (!id) return { success: false, message: 'Missing verification link ID.' }

  try {
    const ref = doc(db, 'pendingVerifications', id)
    const snap = await getDoc(ref)

    if (!snap.exists()) return { success: false, message: 'Verification record not found.' }

    const data = snap.data()
    if (data.status === 'verified') {
      return { success: true, message: 'Already verified.' }
    }

    if (data.name !== name || data.email !== email || data.code !== code) {
      return { success: false, message: 'Invalid verification details.' }
    }

    await updateDoc(ref, { status: 'verified' })
    
    // Notify Renter
    await sendEmail({
      to: email,
      subject: 'Verification Successful – RentFAX',
      html: `<p>Hi ${name},</p><p>Your identity has been verified successfully. You can now submit your dispute.</p>`,
    })
    // Optional SMS (add a real phone number from the user data if available)
    // await sendSMS({
    //   to: '+1XXXXXXXXXX',
    //   message: 'RentFAX: Verification complete. You may submit your dispute now.',
    // })

    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: 'An unexpected error occurred.' }
  }
}
