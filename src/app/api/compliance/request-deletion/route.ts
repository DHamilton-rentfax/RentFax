import { FieldValue } from "firebase-admin/firestore";

import { db } from "@/firebase/server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, reason } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  await addDoc(collection(db, "deletionRequests"), {
    userId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
