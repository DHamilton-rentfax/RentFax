import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";

export async function POST(req: Request) {
  const body = await req.json();

  const { reportNameId, ...rest } = body;

  await adminDb.collection("reports").doc(reportNameId).collection("evidence").add({
    ...rest,
    uploadedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
