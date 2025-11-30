import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { name, address } = await req.json();
  const tenantId = "currentTenantId"; // pulled from token/middleware

  await addDoc(collection(db, "properties"), {
    tenantId,
    name,
    address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true });
}
