import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  await adminDb.collection("report_disputes").add({
    ...body,
    status: "OPEN",
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
