import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

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

  const invites: any[] = [];

  const snapshot = await adminDb
    .collection("invites")
    .where("companyId", "==", companyId)
    .get();

  snapshot.forEach((doc) => {
    invites.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return NextResponse.json({ invites });
}
