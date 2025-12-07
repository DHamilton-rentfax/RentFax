import { authenticateApiRequest } from "@/lib/api/auth";
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return NextResponse.json(auth, { status: 401 });

  const { renterId, industry, type, details } = await req.json();

  if (!renterId || !industry || !type || !details) {
    return NextResponse.json({ error: "Missing required fields: renterId, industry, type, details" }, { status: 400 });
  }

  const id = adminDb.collection("incidents").doc().id;

  await adminDb.collection("incidents").doc(id).set({
    id,
    renterId,
    industry,
    type,
    details,
    companyId: auth.companyId,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, incidentId: id });
}
