import { db } from '@/firebase/client'
import { collection, addDoc } from 'firebase/firestore'

export async function logNotification(data: any) {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    createdAt: new Date().toISOString(),
  })
}
