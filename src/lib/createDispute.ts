import { db, storage, auth } from '@/firebase/client'
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { createNotification } from './notifications/createNotification'

export async function createDispute({ description, files }: { description: string, files: FileList | null }) {
  try {
    const user = auth.currentUser
    if (!user) return { success: false, message: 'You must be signed in.' }

    // Upload files to Firebase Storage
    const fileURLs: string[] = []
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `disputes/${user.uid}/${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        fileURLs.push(url)
      }
    }

    const docRef = await addDoc(collection(db, 'disputes'), {
      renterId: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      description,
      files: fileURLs,
      status: 'submitted',
      createdAt: serverTimestamp()
    });

    // Notify Renter
    if (user.email) {
      await createNotification({
        userId: user.uid,
        type: 'dispute',
        message: 'Your dispute has been successfully submitted.',
        link: `/renter/disputes/${docRef.id}`,
        email: user.email,
        phone: user.phoneNumber || undefined,
      });
    }

    // Notify Admin (using a placeholder admin ID)
    const adminId = 'some-admin-uid'; // In a real app, this would be dynamically determined.
    await createNotification({
        userId: adminId,
        type: 'dispute',
        message: `New dispute submitted by ${user.email}.`,
        link: `/admin/disputes/${docRef.id}`
    })

    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: err.message }
  }
}
