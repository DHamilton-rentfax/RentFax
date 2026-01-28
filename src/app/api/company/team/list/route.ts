import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { UserRecord } from "firebase-admin/auth";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json({ error: "Company ID is required" });
  }

  const members: any[] = [];

  const snapshot = await adminDb
    .collection("companyUsers")
    .where("companyId", "==", companyId)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const user: UserRecord = await adminDb.auth().getUser(data.userId);

    members.push({
      id: doc.id,
      ...data,
      email: user.email,
    });
  }

  return NextResponse.json({ members });
}
