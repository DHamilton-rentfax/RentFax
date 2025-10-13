import { NextResponse } from 'next/server';
import { db } from '@/firebase/server';
import { getAuthUser } from '@/lib/auth-utils';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

// GET - fetch user notifications
export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifRef = collection(db, 'notifications');
  const q = query(notifRef, where('userId', '==', user.uid));

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ notifications });
}

// POST - send a notification
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const { userId, message, type = 'info' } = data;

  if (!userId || !message)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const docRef = await addDoc(collection(db, 'notifications'), {
    userId,
    message,
    type,
    read: false,
    createdBy: user.uid,
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ id: docRef.id, success: true });
}
