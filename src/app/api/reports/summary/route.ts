import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET() {
  const orgId = "TODO-get-from-auth"; // Replace with session orgId
  const renters = await adminDB.collection(`orgs/${orgId}/renters`).get();
  const incidents = await adminDB.collection(`orgs/${orgId}/incidents`).get();
  const disputes = await adminDB.collection(`orgs/${orgId}/disputes`).get();

  return NextResponse.json({
    renters: renters.size,
    incidents: incidents.size,
    disputes: disputes.size,
  });
}
