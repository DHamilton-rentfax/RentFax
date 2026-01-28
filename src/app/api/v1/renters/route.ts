import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

function requireApiKey(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.RENTFAX_API_KEY) {
    throw new Error("Unauthorized");
  }
}

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    requireApiKey(req);
    const orgId = req.nextUrl.searchParams.get("orgId")!;
    const renters = await adminDb
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
