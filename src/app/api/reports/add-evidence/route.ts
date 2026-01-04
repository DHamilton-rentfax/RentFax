import { NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();

  await addDoc(collection(db, "reports", body.reportNameId, "evidence"), {
    ...body,
    uploadedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true });
}