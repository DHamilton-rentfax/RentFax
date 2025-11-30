import { adminDb } from "@/firebase/server";
import { getServerUser } from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();

  const ref = adminDb.collection("reportShares").doc(token);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = snap.data();
  if (data.createdBy !== user.uid)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ref.update({
    active: false,
    revoked: true,
  });

  return NextResponse.json({ success: true });
}
