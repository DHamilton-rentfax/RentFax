import crypto from "crypto";
import { NextResponse } from 'next/server';
import { db } from '@/firebase/server';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  const { tenantId } = await req.json();

  const apiKey = crypto.randomBytes(32).toString("hex");

  await updateDoc(doc(db, "tenants", tenantId), {
    apiEnabled: true,
    apiKey,
    updatedAt: serverTimestamp()
  });

  return NextResponse.json({ apiKey });
}
