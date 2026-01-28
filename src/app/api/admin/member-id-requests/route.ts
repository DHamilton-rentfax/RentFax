import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { verifyApprovalToken } from "@/lib/memberId/generateApprovalToken";
import { enqueueMemberIdNotification } from "@/lib/notifications/enqueueMemberIdNotification";
import { incrementRenterFraudSignal } from "@/lib/fraud/incrementRenterFraudSignal";

type Action = "approve" | "deny";
type FinalStatus = "APPROVED" | "DENIED" | "EXPIRED";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { requestId, token, action } = (await req.json()) as {
    requestId?: string;
    token?: string;
    action?: Action;
  };

  if (!requestId || !token || !["approve", "deny"].includes(action!)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyApprovalToken(requestId, token)) {
    return NextResponse.json({ error: "Invalid or tampered link" }, { status: 403 });
  }

  const ref = adminDb.collection("memberIdRequests").doc(requestId);

  let finalStatus: FinalStatus;
  let renterId: string;
  let orgName: string;
  let stateChanged = false;

  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new Error("REQUEST_NOT_FOUND");
      }

      const data = snap.data()!;
      renterId = data.renterId;
      orgName = data.orgName;

      // Already resolved → idempotent exit
      if (data.status !== "PENDING") {
        finalStatus = data.status;
        return;
      }

      // Expired
      if (data.expiresAt.toMillis() < Date.now()) {
        finalStatus = "EXPIRED";
        stateChanged = true;

        tx.update(ref, {
          status: "EXPIRED",
          respondedAt: Timestamp.now(),
        });
        return;
      }

      // Approve / Deny
      finalStatus = action === "approve" ? "APPROVED" : "DENIED";
      stateChanged = true;

      tx.update(ref, {
        status: finalStatus,
        respondedAt: Timestamp.now(),
      });
    });

    // ─────────────────────────────────────
    // Side effects (ONLY if state changed)
    // ─────────────────────────────────────
    if (stateChanged) {
      await enqueueMemberIdNotification(
        requestId,
        renterId!,
        orgName!,
        finalStatus
      );

      if (finalStatus === "DENIED") {
        await incrementRenterFraudSignal(renterId!);
      }
    }

    return NextResponse.json({
      success: true,
      status: finalStatus,
    });

  } catch (err: any) {
    if (err.message === "REQUEST_NOT_FOUND") {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }

    console.error("Member ID respond failed:", err);
    return NextResponse.json(
      { error: "Unable to process verification response" },
      { status: 500 }
    );
  }
}
