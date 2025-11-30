import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  await adminDb.collection("logs").add({
    ...body,
    type: "error",
    timestamp: Date.now(),
  });
  return NextResponse.json({ success: true });
}
