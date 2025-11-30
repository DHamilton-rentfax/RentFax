import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc, connectFirestoreEmulator } from 'firebase/firestore'

const app = initializeApp({ projectId: 'rentfax-revamp' })
const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080);

export async function firestoreSeed() {
  await setDoc(doc(db, 'users/test-user'), {
    role: 'admin',
    email: 'admin@rentfax.io'
  })
  await setDoc(doc(db, 'companies/test-company'), {
    name: 'Test Rentals',
    plan: 'pro'
  })
}
