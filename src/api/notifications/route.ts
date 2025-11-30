import { NextRequest, NextResponse } from "next/server";

import { adminDB } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid")!;
  const snap = await adminDB
    .collection(`users/${uid}/notifications`)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  const { uid, type, title, body, link } = await req.json();
  await adminDB.collection(`users/${uid}/notifications`).add({
    type,
    title,
    body,
    link: link || null,
    isRead: false,
    dismissed: false,
    createdAt: Date.now(),
  });
  return NextResponse.json({ ok: true });
}
