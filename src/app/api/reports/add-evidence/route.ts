import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const body = await req.json();

  const { reportNameId, ...rest } = body;

  await adminDb.collection("reports").doc(reportNameId).collection("evidence").add({
    ...rest,
    uploadedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
