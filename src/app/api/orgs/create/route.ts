import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { seedDocCategories } from "@/app/actions/seed-doc-categories";

export async function POST(req: NextRequest) {
  const { name, ownerUid } = await req.json();

  const ref = await adminDB.collection("orgs").add({
    name,
    ownerUid,
    createdAt: Date.now(),
  });

  // Automatically seed categories
  await seedDocCategories(ref.id);

  return NextResponse.json({ orgId: ref.id });
}
