import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snapshot = await adminDb.collection("supportStaffPresence").get();
  const staff = snapshot.docs.map((d) => d.data());
  return NextResponse.json({ staff });
}
