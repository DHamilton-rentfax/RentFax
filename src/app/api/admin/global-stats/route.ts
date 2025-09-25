import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET() {
  const orgs = await adminDB.collection("orgs").get();

  let totalRenters = 0;
  let totalDisputes = 0;
  let fraudFlags = 0;

  for (const org of orgs.docs) {
    const renters = await adminDB.collection(`orgs/${org.id}/renters`).get();
    const disputes = await adminDB.collection(`orgs/${org.id}/disputes`).get();
    const flagged = renters.docs.filter(d => d.get("fraudFlag") === true).length;

    totalRenters += renters.size;
    totalDisputes += disputes.size;
    fraudFlags += flagged;
  }

  return NextResponse.json({
    totalOrgs: orgs.size,
    totalRenters,
    totalDisputes,
    fraudFlags,
  });
}
