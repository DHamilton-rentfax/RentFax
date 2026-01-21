// src/app/confirm/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const tokenId = params.token;
  const tokenRef = adminDb.collection("ack_confirmation_tokens").doc(tokenId);

  try {
    await adminDb.runTransaction(async (tx) => {
      const tokenDoc = await tx.get(tokenRef);
      if (!tokenDoc.exists) throw new Error("Invalid or expired token.");

      const token = tokenDoc.data()!;
      if (token.usedAt) throw new Error("Link already used.");
      if (token.expiresAt.toDate() < new Date())
        throw new Error("Link expired.");

      const reportRef = adminDb.collection("reports").doc(token.reportId);
      const reportDoc = await tx.get(reportRef);
      if (!reportDoc.exists) throw new Error("Report not found.");

      const finalStatus =
        token.type === "NO_CONFIRMATION"
          ? "REJECTED_BY_RENTER"
          : "FLAGGED_FRAUD";

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
      const userAgent = req.headers.get("user-agent") ?? null;

      tx.update(reportRef, {
        status: finalStatus,
        "renterAck.confirmedChoice":
          token.type === "NO_CONFIRMATION" ? "NO" : "FRAUD",
        "renterAck.confirmedAt": FieldValue.serverTimestamp(),
        "renterAck.channel": token.channel,
        "renterAck.ip": ip,
        "renterAck.userAgent": userAgent,
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(tokenRef, {
        usedAt: FieldValue.serverTimestamp(),
      });

      tx.set(adminDb.collection("audit_logs").doc(), {
        action: `RENTER_ACK_${finalStatus}`,
        renterId: token.renterId,
        orgId: token.orgId,
        reportId: token.reportId,
        createdAt: FieldValue.serverTimestamp(),
        context: { token: tokenId, channel: token.channel },
      });

      if (finalStatus === "FLAGGED_FRAUD") {
        tx.set(adminDb.collection("fraud_cases").doc(), {
          renterId: token.renterId,
          orgId: token.orgId,
          reportId: token.reportId,
          status: "OPEN",
          createdAt: FieldValue.serverTimestamp(),
          source: "RENTER_CONFIRMED_FRAUD",
        });
      }
    });

    return NextResponse.redirect(
      new URL("/acknowledge/success", req.nextUrl.origin)
    );
  } catch (e: any) {
    console.error("[ACK_CONFIRM_ERROR]", e);
    const url = new URL("/acknowledge/error", req.nextUrl.origin);
    url.searchParams.set("message", e.message);
    return NextResponse.redirect(url);
  }
}
