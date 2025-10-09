import { db, storage, auth } from '@/firebase/client'
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function createDispute({ description, files }: { description: string, files: FileList | null }) {
  try {
    const user = auth.currentUser
    if (!user) return { success: false, message: 'You must be signed in.' }

    // Upload files to Firebase Storage
    const fileURLs: string[] = []
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `disputes/${user.uid}/${Date.now()}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file as Blob)
        const url = await getDownloadURL(snapshot.ref)
        fileURLs.push(url)
      }
    }

    await addDoc(collection(db, 'disputes'), {
      renterId: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      description,
      files: fileURLs,
      status: 'submitted',
      createdAt: serverTimestamp()
    })

    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: err.message }
  }
}
