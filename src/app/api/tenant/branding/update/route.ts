import { NextResponse } from 'next/server';
import { db } from '@/firebase/server';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  const { tenantId, branding } = await req.json();

  await updateDoc(doc(db, "tenants", tenantId), {
    branding,
    updatedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true });
}
