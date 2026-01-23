import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { Parser } from "json2csv";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const { orgId } = params;
  const rentersSnap = await adminDb.collection(`orgs/${orgId}/renters`).get();
  const renters = rentersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const parser = new Parser();
  const csv = parser.parse(renters);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=renters-${orgId}.csv`,
    },
  });
}
