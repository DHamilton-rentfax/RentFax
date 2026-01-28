import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { userRecordId, newRole } = await req.json();

  await adminDb
    .collection("companyUsers")
    .doc(userRecordId)
    .set({ role: newRole }, { merge: true });

  return NextResponse.json({ success: true });
}
