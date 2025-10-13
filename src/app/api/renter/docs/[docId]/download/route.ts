import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { getStorage } from "firebase-admin/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { docId: string } },
) {
  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const doc = await adminDB
    .doc(`orgs/${orgId}/renters/${renterId}/docs/${params.docId}`)
    .get();
  if (!doc.exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = doc.data()!;
  if (!data.visibleToRenter) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const bucket = getStorage().bucket();
  const file = bucket.file(data.path);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 5, // 5 min expiry
  });

  return NextResponse.json({ url });
}
