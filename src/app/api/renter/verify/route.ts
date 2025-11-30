import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/server";
import { ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  const data = await req.formData();
  const selfie = data.get("selfie") as File | null;
  const idPhoto = data.get("idPhoto") as File | null;
  const userId = data.get("userId") as string;

  if (!selfie || !idPhoto) {
    return NextResponse.json({ error: "Missing required images" }, { status: 400 });
  }

  const selfieRef = ref(storage, `verify/${userId}/selfie.jpg`);
  const idRef = ref(storage, `verify/${userId}/id.jpg`);

  await uploadBytes(selfieRef, await selfie.arrayBuffer());
  await uploadBytes(idRef, await idPhoto.arrayBuffer());

  await updateDoc(doc(db, "users", userId), {
    verificationStatus: "pending",
  });

  return NextResponse.json({ success: true });
}
