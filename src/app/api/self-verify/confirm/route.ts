import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";
import {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

type Decision = "CONFIRMED" | "DENIED" | "UNKNOWN";

export async function POST(req: NextRequest) {
  try {
    const { token, decision } = await req.json();

    if (!token || !decision) {
      return NextResponse.json(
        { error: "Missing token or decision" },
        { status: 400 }
      );
    }

    if (!["CONFIRMED", "DENIED", "UNKNOWN"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision" },
        { status: 400 }
      );
    }

    const ref = doc(db, "self_verifications", token);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Invalid or expired verification link." },
        { status: 404 }
      );
    }

    const data = snap.data();

    if (data.used === true) {
      return NextResponse.json(
        { error: "This verification has already been submitted." },
        { status: 409 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    await updateDoc(ref, {
      used: true,
      decision,
      decidedAt: serverTimestamp(),
      decidedIp: ip,
      decidedUserAgent: userAgent,
    });

    /* ---------------------------------- FRAUD SIGNAL ---------------------------------- */
    if (decision === "DENIED") {
      await updateDoc(doc(db, "renters", data.renterId), {
        fraudFlag: true,
        fraudReason: "RENTER_DENIED_SELF_VERIFICATION",
        fraudAt: serverTimestamp(),
      });
    }

    // ---------------------------------- ATTACH TO REPORT ----------------------------------
    if (data.reportId) {
      await updateDoc(doc(db, "reports", data.reportId), {
        verification: {
          status: decision === "CONFIRMED" ? "CONFIRMED" : "DENIED",
          verificationId: token,
          decidedAt: serverTimestamp(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SELF VERIFY CONFIRM ERROR:", err);
    return NextResponse.json(
      { error: "Unable to record verification." },
      { status: 500 }
    );
  }
}
