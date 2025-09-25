import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { getStorage } from "firebase-admin/storage";

export async function DELETE(_: NextRequest, { params }: { params: { renterId: string; docId: string } }) {
  const orgId = "demo-org"; // TODO-get-from-auth
  const { renterId, docId } = params;

  const docRef = adminDB.doc(`orgs/${orgId}/renters/${renterId}/docs/${docId}`);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = docSnap.data()!;
  const bucket = getStorage().bucket();
  const file = bucket.file(data.path);

  // Delete file from storage
  await file.delete().catch(() => null);

  // Delete metadata from Firestore
  await docRef.delete();

  // Log action in audit trail
  await adminDB.collection(`orgs/${orgId}/audit`).add({
    actorUid: "system", // TODO: replace with session user ID
    action: "DOC_DELETE",
    target: `${renterId}/${docId}`,
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
