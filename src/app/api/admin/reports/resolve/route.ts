import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  await adminDb.collection("report_resolutions").add({
    ...body,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
