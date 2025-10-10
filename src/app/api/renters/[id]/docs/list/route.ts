import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const orgId = "demo-org"; // TODO: Replace with session org
  const snap = await adminDB.collection(`orgs/${orgId}/renters/${params.id}/docs`).orderBy("createdAt", "desc").get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}
