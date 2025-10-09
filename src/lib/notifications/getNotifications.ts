import { db, auth } from '@/firebase/client'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export function getNotifications(callback: (n:any[])=>void) {
  const user = auth.currentUser
  if (!user) return

  // This query will require a composite index in Firestore.
  // The error message in the console will provide a direct link to create it.
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(items)
  })
}
