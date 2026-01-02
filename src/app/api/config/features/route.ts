import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const doc = await adminDb.collection("config").doc("features").get();
  const flags = doc.data() ?? {};
  return NextResponse.json(flags);
}
