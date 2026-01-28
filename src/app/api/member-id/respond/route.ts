import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { verifyApprovalToken } from "@/lib/memberId/generateApprovalToken";
import { enqueueMemberIdNotification } from "@/lib/notifications/enqueueMemberIdNotification";

type Action = "approve" | "deny";
type FinalStatus = "APPROVED" | "DENIED" | "EXPIRED";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const body = (await req.json()) as {
    requestId?: string;
    token?: string;
    action?: Action;
  };

  const { requestId, token, action } = body;

  // 1️⃣ Input validation
  if (!requestId || !token || (action !== "approve" && action !== "deny")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyApprovalToken(requestId, token)) {
    return NextResponse.json(
      { error: "Invalid or tampered verification link" },
      { status: 403 }
    );
  }

  const ref = adminDb.collection("memberIdRequests").doc(requestId);

  let previousStatus: string | null = null;
  let finalStatus: FinalStatus | null = null;
  let renterId: string | null = null;
  let orgName: string | null = null;

  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("REQUEST_NOT_FOUND");

      const data = snap.data()!;
      previousStatus = data.status;
      renterId = data.renterId;
      orgName = data.orgName;

      // Idempotent replay
      if (data.status !== "PENDING") {
        finalStatus = data.status;
        return;
      }

      // Expired
      if (data.expiresAt.toMillis() < Date.now()) {
        finalStatus = "EXPIRED";
        tx.update(ref, {
          status: "EXPIRED",
          respondedAt: Timestamp.now(),
        });
        return;
      }

      // Approve / Deny
      finalStatus = action === "approve" ? "APPROVED" : "DENIED";

      tx.update(ref, {
        status: finalStatus,
        respondedAt: Timestamp.now(),
      });

      // Fraud signal ONLY on first DENIED transition
      if (finalStatus === "DENIED" && previousStatus === "PENDING") {
        tx.update(
          adminDb.collection("renters").doc(data.renterId),
          {
            fraudSignals: FieldValue.increment(1),
          }
        );
      }
    });

    const firstTransition = previousStatus === "PENDING";

    // Side effects ONLY on first transition
    if (firstTransition && finalStatus && renterId && orgName) {
      await enqueueMemberIdNotification(
        requestId,
        renterId,
        orgName,
        finalStatus
      );
    }

    return NextResponse.json({
      success: true,
      status: finalStatus,
      transitioned: firstTransition,
    });

  } catch (err: any) {
    if (err.message === "REQUEST_NOT_FOUND") {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }

    console.error("Member ID approval failed:", err);
    return NextResponse.json(
      { error: "Unable to process verification response" },
      { status: 500 }
    );
  }
}
