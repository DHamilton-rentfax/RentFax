import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getStorage } from "firebase-admin/storage";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { token, id, fileName } = await req.json();
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const bucket = getStorage().bucket();
  const filePath = `orgs/${orgId}/disputes/${id}/evidence/${fileName}`;
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 mins
    contentType: "application/octet-stream",
  });

  // Save placeholder record
  await adminDb.collection(`orgs/${orgId}/disputes/${id}/evidence`).add({
    fileName,
    uploadedBy: renterId,
    uploadedAt: Date.now(),
    fileUrl: `gs://${bucket.name}/${filePath}`,
  });

  return NextResponse.json({ uploadUrl: url });
}
