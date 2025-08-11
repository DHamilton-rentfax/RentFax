'use server';
// Helper for Firebase SendGrid Email Extension (writes to /mail)
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

type MailPayload = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: {
    name: string;
    data: Record<string, any>;
  };
};

export async function sendMail(params: MailPayload) {
  try {
    const mailData: any = {
      to: Array.isArray(params.to) ? params.to : [params.to],
      message: { 
        subject: params.subject,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (params.template) {
        mailData.template = params.template;
    } else {
        mailData.message.text = params.text;
        mailData.message.html = params.html;
    }

    await db.collection('mail').add(mailData);

  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, you might have more robust error handling, e.g., a retry queue.
  }
}
