import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(
  _: Request,
  { params }: { params: { partnerId: string } },
) {
  const subs = await adminDB
    .collection(`partners/${params.partnerId}/suborgs`)
    .get();
  return NextResponse.json(subs.docs.map((d) => ({ id: d.id, ...d.data() })));
}
