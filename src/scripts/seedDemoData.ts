import { db } from '@/firebase/client'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export async function seedDemoData() {
  const renters = [
    { name: 'Ava Williams', email: 'ava@demo.com', score: 740 },
    { name: 'James Rodriguez', email: 'james@demo.com', score: 660 },
    { name: 'Sophie Chen', email: 'sophie@demo.com', score: 820 },
  ]

  for (const r of renters) {
    await addDoc(collection(db, 'users'), {
      ...r,
      role: 'renter',
      plan: 'pro',
      createdAt: serverTimestamp(),
    })
  }

  const disputes = [
    { renter: 'Ava Williams', status: 'open', reason: 'Payment dispute', amount: 1200 },
    { renter: 'James Rodriguez', status: 'resolved', reason: 'Property damage', amount: 500 },
  ]

  for (const d of disputes) {
    await addDoc(collection(db, 'disputes'), {
      ...d,
      createdAt: serverTimestamp(),
    })
  }
}
