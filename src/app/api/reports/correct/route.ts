import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const correction = {
    ...body,
    createdAt: Date.now(),
  };

  await adminDb.collection("report_corrections").add(correction);

  return NextResponse.json({ success: true });
}
