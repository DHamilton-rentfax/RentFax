import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const doc = await adminDb.collection("config").doc("features").get();
  const flags = doc.data() ?? {};
  return NextResponse.json(flags);
}
