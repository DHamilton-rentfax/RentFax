import { NextResponse } from "next/server";
import { dbAdmin as adminDb } from "@@/firebase/server";
import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie";

export async function GET() {
  const user = await getUserFromSessionCookie();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRef = adminDb.collection("users").doc(user.uid);
  const userSnap = await userRef.get();
  const role = userSnap.get("role");

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const usersSnapshot = await adminDb.collection("users").get();
  const users = usersSnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(users);
}
