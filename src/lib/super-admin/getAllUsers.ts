
import { db } from '@/firebase/client'
import { collection, getDocs } from 'firebase/firestore'

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}
