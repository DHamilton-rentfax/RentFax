import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
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
