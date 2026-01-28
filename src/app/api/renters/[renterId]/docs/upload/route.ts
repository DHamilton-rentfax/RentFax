import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getAdminDb } from "@/firebase/server";
import { getUserIdFromHeaders } from "@/lib/auth/roles";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { renterId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const uid = await getUserIdFromHeaders(req.headers);
  if (!uid) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "FILE_REQUIRED" }, { status: 400 });
  }

  const orgId = formData.get("orgId") as string | null;
  const category = formData.get("category") as string | null;
  const visibleToRenter = formData.get("visibleToRenter") === "true";

  if (!orgId || !category) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const bucket = getStorage().bucket();
  const storagePath = `docs/${orgId}/renters/${params.renterId}/${Date.now()}-${file.name}`;
  const fileRef = bucket.file(storagePath);

  await fileRef.save(Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
  });

  const docRef = await adminDb
    .collection("orgs")
    .doc(orgId)
    .collection("renters")
    .doc(params.renterId)
    .collection("docs")
    .add({
      name: file.name,
      category,
      storagePath,
      visibleToRenter,
      uploadedBy: uid,
      createdAt: new Date(),
    });

  await adminDb.collection("audit_logs").add({
    action: visibleToRenter ? "DOC_UPLOAD_VISIBLE" : "DOC_UPLOAD_PRIVATE",
    actorId: uid,
    actorRole: "ADMIN",
    targetType: "RENTER_DOC",
    targetId: docRef.id,
    metadata: {
      renterId: params.renterId,
      orgId,
      category,
    },
    createdAt: new Date(),
  });

  return NextResponse.json({ id: docRef.id });
}
