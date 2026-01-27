import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from 'next/server';
import { db } from '@/firebase/server';


export async function POST(req: Request) {
  const { tenantId, branding } = await req.json();

  await updateDoc(doc(db, "tenants", tenantId), {
    branding,
    updatedAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ success: true });
}
