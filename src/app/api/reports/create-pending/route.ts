import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb, adminAuth } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { hasActiveConsent } from "@/lib/memberId/hasActiveConsent";
import { getEffectiveOrgId } from "@/lib/auth/getEffectiveOrgId";

const EVIDENCE_WINDOW_MINUTES = 60;
const MAX_PENDING_REPORTS = 3;

export async function POST(req: Request) {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { renterId } = await req.json();
    if (!renterId) {
      return NextResponse.json(
        { error: "renterId is required" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const orgId = await getEffectiveOrgId(decoded.uid, decoded.orgId);

    if (!orgId) {
      return NextResponse.json(
        { error: "Could not determine organization" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "unknown";

    let reportId: string | null = null;

    await adminDb.runTransaction(async (tx) => {
      // 1️⃣ Consent gate (authoritative)
      const consent = await hasActiveConsent(orgId, renterId);
      if (!consent) {
        throw new Error("CONSENT_REQUIRED");
      }

      // 2️⃣ Legacy identity verification
      const verificationSnap = await tx.get(
        adminDb
          .collection("identityRequests")
          .where("orgId", "==", orgId)
          .where("renterId", "==", renterId)
          .where("status", "==", "VERIFIED")
          .limit(1)
      );

      if (verificationSnap.empty) {
        throw new Error("NOT_VERIFIED");
      }

      const verificationId = verificationSnap.docs[0].id;

      // 3️⃣ Enforce single pending per renter
      const existingPendingSnap = await tx.get(
        adminDb
          .collection("reports")
          .where("orgId", "==", orgId)
          .where("renterId", "==", renterId)
          .where("status", "==", "PENDING_EVIDENCE")
          .limit(1)
      );

      if (!existingPendingSnap.empty) {
        throw new Error("PENDING_EXISTS");
      }

      // 4️⃣ Enforce org pending cap
      const orgPendingSnap = await tx.get(
        adminDb
          .collection("reports")
          .where("orgId", "==", orgId)
          .where("status", "==", "PENDING_EVIDENCE")
      );

      if (orgPendingSnap.size >= MAX_PENDING_REPORTS) {
        throw new Error("PENDING_LIMIT");
      }

      // 5️⃣ Create report
      const ref = adminDb.collection("reports").doc();
      reportId = ref.id;

      tx.set(ref, {
        reportNameId: ref.id,
        renterId,
        orgId,
        status: "PENDING_EVIDENCE",
        verificationId,
        pendingUntil: Timestamp.fromDate(
          new Date(Date.now() + EVIDENCE_WINDOW_MINUTES * 60 * 1000)
        ),
        createdBy: decoded.uid,
        createdVia: "MEMBER_ID_CONSENT",
        audit: {
          ip,
          userAgent: req.headers.get("user-agent") ?? "unknown",
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });

    return NextResponse.json({ reportId });

  } catch (err: any) {
    if (err.message === "CONSENT_REQUIRED") {
      return NextResponse.json(
        { error: "Renter approval is required before a report can be created." },
        { status: 403 }
      );
    }

    if (err.message === "NOT_VERIFIED") {
      return NextResponse.json(
        { error: "Renter not verified by this organization" },
        { status: 403 }
      );
    }

    if (err.message === "PENDING_EXISTS") {
      return NextResponse.json(
        { error: "A pending report already exists for this renter" },
        { status: 409 }
      );
    }

    if (err.message === "PENDING_LIMIT") {
      return NextResponse.json(
        { error: "Pending report limit reached" },
        { status: 429 }
      );
    }

    console.error("Create pending report failed:", err);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
