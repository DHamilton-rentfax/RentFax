
import { db } from '@/firebase/client'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

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
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: 'An unexpected error occurred.' }
  }
}
