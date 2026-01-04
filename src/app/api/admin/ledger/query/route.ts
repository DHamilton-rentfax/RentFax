import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import type { LedgerAction } from "@/types/ledger";
import { getAuth } from "firebase-admin/auth";

/**
 * Admin-only ledger query endpoint
 */
export async function POST(req: NextRequest) {
  try {
    /* ===============================
       AUTH / ROLE ENFORCEMENT
    =============================== */

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await getAuth().verifyIdToken(idToken);

    if (
      decoded.role !== "ADMIN" &&
      decoded.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    /* ===============================
       INPUT PARSING
    =============================== */

    const {
      actorId,
      relatedObject,
      action,
      startDate,
      endDate,
      limit = 50,
      cursor,
    } = await req.json();

    let q: FirebaseFirestore.Query = adminDb
      .collection("ledger")
      .orderBy("createdAt", "desc")
      .limit(Math.min(Number(limit), 100));

    if (actorId) {
      q = q.where("actorId", "==", actorId);
    }

    if (relatedObject) {
      q = q.where("relatedObject", "==", relatedObject);
    }

    if (action) {
      q = q.where("action", "==", action as LedgerAction);
    }

    if (startDate) {
      q = q.where(
        "createdAt",
        ">=",
        Timestamp.fromDate(new Date(startDate))
      );
    }

    if (endDate) {
      q = q.where(
        "createdAt",
        "<=",
        Timestamp.fromDate(new Date(endDate))
      );
    }

    if (cursor) {
      const cursorSnap = await adminDb
        .collection("ledger")
        .doc(cursor)
        .get();

      if (cursorSnap.exists) {
        q = q.startAfter(cursorSnap);
      }
    }

    /* ===============================
       EXECUTION
    =============================== */

    const snap = await q.get();

    const entries = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      entries,
      nextCursor: snap.docs.at(-1)?.id ?? null,
    });
  } catch (error) {
    console.error("Ledger query API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
