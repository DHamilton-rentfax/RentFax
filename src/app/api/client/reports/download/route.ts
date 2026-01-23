import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    const orgId = decoded.orgId;

    const doc = await adminDb.collection("reports").doc(id).get();
    if (!doc.exists)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    const data = doc.data()!;
    if (data.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const file = getStorage().bucket().file(data.storagePath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 10, // 10 minutes
    });

    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
