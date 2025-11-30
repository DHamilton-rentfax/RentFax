'use server';

import admin from '@/firebase/server';
import { getFirestore } from 'firebase-admin/firestore';

const firestore = getFirestore();

/**
 * Creates a user notification in Firestore.
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type: 'DISPUTE' | 'SYSTEM' | 'ALERT';
  link?: string;
}) {
  try {
    if (!userId) {
      console.warn('⚠️ Notification skipped: userId is missing.');
      return;
    }
    await firestore.collection('notifications').add({
      userId,
      title,
      message,
      type,
      link: link || null,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Notification sent to ${userId}`);
  } catch (err) {
    console.error('❌ Failed to create notification:', err);
  }
}
