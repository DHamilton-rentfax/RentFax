import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const orgId = formData.get("orgId") as string;
  const category = formData.get("category") as string;
  const renterId = formData.get("renterId") as string | null;

  const bucket = getStorage().bucket();
  const fileRef = bucket.file(`docs/${orgId}/${Date.now()}-${file.name}`);
  await fileRef.save(Buffer.from(await file.arrayBuffer()));

  const docData = {
    name: file.name,
    category,
    path: fileRef.name,
    createdAt: Date.now(),
  };

  const docRef = await adminDb.collection(`orgs/${orgId}/docs`).add(docData);

  if (renterId) {
    await adminDb.collection(`orgs/${orgId}/renters/${renterId}/docs`).add({
      docId: docRef.id,
      ...docData,
    });
  }

  return NextResponse.json({ id: docRef.id });
}
