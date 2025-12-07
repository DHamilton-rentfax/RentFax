import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { userRecordId, newRole } = await req.json();

  await adminDb
    .collection("companyUsers")
    .doc(userRecordId)
    .set({ role: newRole }, { merge: true });

  return NextResponse.json({ success: true });
}
