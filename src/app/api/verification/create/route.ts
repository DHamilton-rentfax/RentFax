import { adminDb } from "@/firebase/server";
import { getServerUser } from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { idFrontUrl, idBackUrl, selfieUrl } = await req.json();

  const ref = adminDb.collection("renterVerifications").doc();
  await ref.set({
    id: ref.id,
    userId: user.uid,
    idFrontUrl,
    idBackUrl,
    selfieUrl,
    status: "pending",
    createdAt: Date.now(),
  });

  await adminDb.collection("users").doc(user.uid).update({
    verificationId: ref.id,
    verificationLevel: "pending",
  });

  return NextResponse.json({ verificationId: ref.id });
}
