import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const snapshot = await db
    .collection("searchHistory")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  const history = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return NextResponse.json({ history });
}
