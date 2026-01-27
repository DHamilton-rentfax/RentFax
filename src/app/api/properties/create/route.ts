import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";


export async function POST(req: Request) {
  const { name, address } = await req.json();
  const tenantId = "currentTenantId"; // pulled from token/middleware

  await addDoc(collection(db, "properties"), {
    tenantId,
    name,
    address,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ success: true });
}
