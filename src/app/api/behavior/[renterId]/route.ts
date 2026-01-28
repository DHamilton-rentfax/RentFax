import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET(req, { params }: any) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const graph = await adminDb
    .collection("behaviorGraphs")
    .doc(params.renterId)
    .get();

  if (!graph.exists)
    return NextResponse.json({ error: "No behavior graph" });

  return NextResponse.json(graph.data());
}
