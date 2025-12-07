import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { adminDB } from "@/firebase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const orgId = formData.get("orgId") as string;
  const category = formData.get("category") as string;
  const visible = formData.get("visibleToRenter") === "true";

  const bucket = getStorage().bucket();
  const fileRef = bucket.file(
    `docs/${orgId}/renters/${params.id}/${Date.now()}-${file.name}`,
  );
  await fileRef.save(Buffer.from(await file.arrayBuffer()));

  const docRef = await adminDB
    .collection(`orgs/${orgId}/renters/${params.id}/docs`)
    .add({
      name: file.name,
      category,
      path: fileRef.name,
      createdAt: Date.now(),
      visibleToRenter: visible,
    });

  await adminDB.collection(`orgs/${orgId}/audit`).add({
    actorUid: "system", // TODO: real user ID
    action: visible ? "DOC_UPLOAD_VISIBLE" : "DOC_UPLOAD_PRIVATE",
    target: `${params.id}/${docRef.id}`,
    timestamp: Date.now(),
  });

  return NextResponse.json({ id: docRef.id });
}
