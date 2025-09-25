import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const snap = await adminDB.collection(`orgs/${orgId}/renters/${renterId}/docs`)
    .where("visibleToRenter", "==", true).get();

  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}
