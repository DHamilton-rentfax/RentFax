// ✅ FILE: /src/app/api/partners/agencies/register/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      companyName,
      contactName,
      phone,
      license,
      coverageAreas,
      plan,
      token,
      docUrl,
    } = body;

    if (!email || !companyName) {
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
        displayName: contactName || companyName,
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
      companyName,
      license,
      coverageAreas: coverageAreas || "",
    };

    await adminDb.collection("collectionAgencies").doc(uid).set(partnerData);

    return NextResponse.json({ success: true, uid });
  } catch (err: any) {
    console.error("Agency registration error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
