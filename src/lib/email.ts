'use server';
// Helper for Firebase SendGrid Email Extension (writes to /mail)
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

export async function sendMail(params: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string; // optional SendGrid dynamic template name
  data?: any;
}) {
  try {
    await db.collection('mail').add({
        to: params.to,
        message: { subject: params.subject, text: params.text, html: params.html },
        template: params.template ? { name: params.template, data: params.data || {} } : undefined,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, you might have more robust error handling, e.g., a retry queue.
  }
}
