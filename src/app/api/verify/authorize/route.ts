import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import crypto from "crypto";

export async function POST() {
  const key = crypto.randomBytes(32).toString("hex");

  await addDoc(collection(db, "verify_api_keys"), {
    key,
    createdAt: serverTimestamp()
  });

  return NextResponse.json({ apiKey: key });
}
