import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const orgId = "TODO-get-from-auth"; // Replace with session orgId
  const renters = await adminDb.collection(`orgs/${orgId}/renters`).get();
  const incidents = await adminDb.collection(`orgs/${orgId}/incidents`).get();
  const disputes = await adminDb.collection(`orgs/${orgId}/disputes`).get();

  return NextResponse.json({
    renters: renters.size,
    incidents: incidents.size,
    disputes: disputes.size,
  });
}
