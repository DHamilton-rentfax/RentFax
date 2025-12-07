import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

function requireApiKey(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.RENTFAX_API_KEY) {
    throw new Error("Unauthorized");
  }
}

export async function GET(req: NextRequest) {
  try {
    requireApiKey(req);
    const orgId = req.nextUrl.searchParams.get("orgId")!;
    const renters = await adminDB
      .collection(`orgs/${orgId}/renters`)
      .limit(50)
      .get();
    return NextResponse.json(
      renters.docs.map((d) => ({ id: d.id, ...d.data() })),
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
