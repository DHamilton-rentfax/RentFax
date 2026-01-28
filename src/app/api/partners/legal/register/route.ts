// ✅ FILE: /src/app/api/partners/legal/register/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      firmName,
      contactName,
      phone,
      barNumber,
      jurisdiction,
      plan,
      token,
      docUrl,
    } = body;

    if (!email || !firmName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const auth = getAuth();
    let uid: string;

    if (token) {
      const decoded = await auth.verifyIdToken(token);
      uid = decoded.uid;
    } else {
      const user = await auth.createUser({
        email,
        password: password || Math.random().toString(36).slice(2),
        displayName: contactName || firmName,
      });
      uid = user.uid;
    }

    const partnerData: any = {
      uid,
      email,
      contactName,
      phone,
      planType: plan,
      verified: false,
      createdAt: new Date(),
      verificationStatus: "pending",
      docUrl: docUrl || null,
      firmName,
      barNumber,
      jurisdiction: jurisdiction || "",
    };

    await adminDb.collection("legalPartners").doc(uid).set(partnerData);

    return NextResponse.json({ success: true, uid });
  } catch (err: any) {
    console.error("Legal registration error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
