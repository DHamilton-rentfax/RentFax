
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// ------------------------------------
// 1️⃣ Initialize Firebase Admin
// ------------------------------------
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64, "base64").toString()
    : process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();

// ------------------------------------
// 2️⃣ POST /api/auth/session
// ------------------------------------
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    // Fetch user's plan from Firestore
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    const plan = snap.exists ? snap.data()?.plan || "free" : "free";

    // Set cookies for session enforcement
    const res = NextResponse.json({
      success: true,
      uid,
      plan,
      email: decoded.email || null,
    });

    res.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    res.cookies.set("uid", uid, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.cookies.set("plan", plan, {
      httpOnly: false, // readable client-side if needed
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("❌ Session error:", error);
    return NextResponse.json(
      { error: "Session creation failed", details: error.message },
      { status: 401 }
    );
  }
}
