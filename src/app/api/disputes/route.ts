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

// GET - list disputes depending on role
export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const disputesRef = collection(db, 'disputes');

  let q;
  if (user.role === 'ADMIN') {
    q = query(disputesRef);
  } else if (user.role === 'COMPANY') {
    q = query(disputesRef, where('companyId', '==', user.uid));
  } else if (user.role === 'RENTER') {
    q = query(disputesRef, where('renterId', '==', user.uid));
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const snapshot = await getDocs(q);
  const disputes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ disputes });
}

// POST - create a new dispute
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const { renterId, reportId, description, evidenceUrls = [] } = data;

  if (!renterId || !reportId || !description)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const docRef = await addDoc(collection(db, 'disputes'), {
    renterId,
    reportId,
    description,
    evidenceUrls,
    status: 'pending',
    createdBy: user.uid,
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ id: docRef.id, success: true });
}
