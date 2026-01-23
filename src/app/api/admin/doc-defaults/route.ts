import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/firebase/server";
export async function GET() {
  const ref = await db.doc("config/docDefaults").get();
  return NextResponse.json(ref.exists ? ref.data() : { categories: [] });
}

export async function POST(req: NextRequest) {
  const { categories } = await req.json();

  // TODO: check super admin role from session
  await db.doc("config/docDefaults").set({
    categories,
    updatedAt: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
