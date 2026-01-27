import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { reportNameId, ...rest } = body;

  await adminDb.collection("reports").doc(reportNameId).collection("evidence").add({
    ...rest,
    uploadedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
