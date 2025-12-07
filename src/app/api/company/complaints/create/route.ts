import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const id = uuid();

  const data = {
    id,
    renterId: body.renterId,
    companyId: body.companyId,
    type: body.type,
    description: body.description?.substring(0, 250) || null,
    evidenceUrls: body.evidenceUrls || [],
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await adminDb.collection("companyComplaints").doc(id).set(data);

  return NextResponse.json({ success: true, id });
}