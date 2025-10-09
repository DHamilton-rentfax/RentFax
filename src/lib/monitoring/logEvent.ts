import { db } from '@/firebase/client'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function logEvent(eventType: string, data: any = {}) {
  try {
    await addDoc(collection(db, 'systemLogs'), {
      type: eventType,
      data,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('logEvent error:', err)
  }
}
