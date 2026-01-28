import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const body = await req.json();

  await adminDb.collection("report_resolutions").add({
    ...body,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
