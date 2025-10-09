import { db, storage, auth } from '@/firebase/client'
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { sendEmail } from '@/lib/notifications/sendEmail'
import { sendSMS } from '@/lib/notifications/sendSMS'
import { detectFraudSignals } from '@/ai/flows/fraud-detector';

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

    const newDispute = {
      renterId: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      description,
      files: fileURLs,
      status: 'submitted',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'disputes'), newDispute);

    // Run Fraud Detection in the background
    detectFraudSignals({ renterId: user.uid }).then(fraudResult => {
      if (fraudResult.signals.length > 0) {
        console.log(`Fraud signals detected for new dispute ${docRef.id}:`, fraudResult.signals);
        // In a real app, you would flag this for admin review
        addDoc(collection(db, 'alerts'), {
          type: 'fraud_warning',
          disputeId: docRef.id,
          reason: `Found ${fraudResult.signals.length} fraud signals.`,
          signals: fraudResult.signals.map(s => s.code),
          createdAt: serverTimestamp()
        });
      }
    }).catch(err => {
      console.error("Error running fraud detection:", err);
    });

    // Notify Renter
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Dispute Received – RentFAX',
        html: `<p>Hi ${user.displayName || 'Renter'},</p><p>We've received your dispute. Our team will review and update you shortly.</p>`,
      })
    }

    // Notify Admin
    await sendEmail({
      to: 'admin@rentfax.com', // Replace with a real admin email
      subject: 'New Dispute Submitted',
      html: `<p>A new dispute has been submitted by ${user.email}.</p><p><strong>Description:</strong> ${description}</p>`,
    })

    // Optional SMS to Renter
    if (user.phoneNumber) {
        await sendSMS({
            to: user.phoneNumber,
            message: 'RentFAX: We’ve received your dispute. We’ll notify you once it’s under review.',
        })
    }


    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, message: err.message }
  }
}
