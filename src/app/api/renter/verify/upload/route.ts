import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/server";
import { ref, uploadBytes } from "firebase/storage";


export async function POST(req: Request) {
  const form = await req.formData();
  const front = form.get("front") as File;
  const back = form.get("back") as File;
  const selfie = form.get("selfie") as File;

  const renterId = "currentUserId"; // from auth

  async function uploadFile(file: File, path: string) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, buffer, { contentType: file.type });
    return path;
  }

  const frontPath = await uploadFile(front, `verification/${renterId}/front.jpg`);
  const backPath = await uploadFile(back, `verification/${renterId}/back.jpg`);
  const selfiePath = await uploadFile(selfie, `verification/${renterId}/selfie.jpg`);

  await setDoc(doc(db, "renter_verification", renterId), {
    renterId,
    status: "pending",
    idFrontUrl: frontPath,
    idBackUrl: backPath,
    selfieUrl: selfiePath,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ success: true });
}
