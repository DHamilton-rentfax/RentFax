import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { stringify } from "csv-stringify/sync";

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId")!;
  const type = req.nextUrl.searchParams.get("type")!;

  let docs;
  if (type === "renters") {
    docs = await adminDB.collection(`orgs/${orgId}/renters`).get();
  } else if (type === "incidents") {
    docs = await adminDB.collection(`orgs/${orgId}/incidents`).get();
  } else if (type === "disputes") {
    docs = await adminDB.collection(`orgs/${orgId}/disputes`).get();
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const rows = docs.docs.map((d) => ({ id: d.id, ...d.data() }));
  const csv = stringify(rows, { header: true });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${type}-export.csv`,
    },
  });
}
