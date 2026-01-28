import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";


export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
