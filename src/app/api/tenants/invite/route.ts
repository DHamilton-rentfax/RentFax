import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { tenantId, email, role, invitedBy } = await req.json();

  await addDoc(
    collection(db, `tenant_invites`),
    {
      tenantId,
      email,
      role,
      invitedBy,
      status: "pending",
      createdAt: serverTimestamp()
    }
  );

  return NextResponse.json({ success: true });
}
