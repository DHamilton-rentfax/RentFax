import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/server";
import { auth } from "@/firebase/server";

export async function POST(req: Request) {
  const form = await req.formData();

  const incidentId = form.get("incidentId") as string;
  const claim = form.get("claim") as string;
  const evidenceFiles = form.getAll("evidence") as File[];

  const sessionCookie = req.headers.get("cookie")?.split("__session=")[1] || "";
  const decodedToken = await auth.verifySessionCookie(sessionCookie);

  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const renterId = decodedToken.uid;
  const batchId = Date.now().toString();

  const uploads = [];

  for (const file of evidenceFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ref = adminStorage
      .bucket()
      .file(`evidence/${renterId}/${batchId}/${file.name}`);

    await ref.save(buffer, { contentType: file.type });

    const [url] = await ref.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    uploads.push({ url, name: file.name });
  }

  const disputeRef = await adminDB.collection("disputes").add({
    renterId,
    incidentId,
    claim,
    status: "PENDING_REVIEW",
    evidence: uploads,
    createdAt: Date.now(),
  });

  return NextResponse.json({ id: disputeRef.id });
}
