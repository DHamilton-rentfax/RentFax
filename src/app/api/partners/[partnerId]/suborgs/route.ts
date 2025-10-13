import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { partnerId: string } },
) {
  const { partnerId } = params;
  const { orgName } = await req.json();

  const ref = await adminDB
    .collection("partners")
    .doc(partnerId)
    .collection("suborgs")
    .add({
      orgName,
      createdAt: Date.now(),
    });

  return NextResponse.json({ subOrgId: ref.id });
}
