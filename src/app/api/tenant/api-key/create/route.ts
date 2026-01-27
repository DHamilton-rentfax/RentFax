import { FieldValue } from "firebase-admin/firestore";

import crypto from "crypto";
import { NextResponse } from 'next/server';
import { db } from '@/firebase/server';


export async function POST(req: Request) {
  const { tenantId } = await req.json();

  const apiKey = crypto.randomBytes(32).toString("hex");

  await updateDoc(doc(db, "tenants", tenantId), {
    apiEnabled: true,
    apiKey,
    updatedAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ apiKey });
}
