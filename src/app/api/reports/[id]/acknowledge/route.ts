import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

import { verifyRenterSession } from "@/lib/auth/verifyRenterSession";
import {
  sendConfirmationEmail,
  sendConfirmationSms,
} from "@/lib/notifications/send";

/**
 * Renter acknowledgment initiation
 * - YES  → immediate confirmation
 * - NO / FRAUD → double-opt confirmation via email or SMS
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* ------------------------------------------------------------------
     * 1. AUTHENTICATION (SINGLE SOURCE OF TRUTH)
     * ------------------------------------------------------------------ */
    const { renterId } = await verifyRenterSession();

    /* ------------------------------------------------------------------
     * 2. INPUT VALIDATION
     * ------------------------------------------------------------------ */
    const body = await req.json();
    const choice: "YES" | "NO" | "FRAUD" = body?.choice;
    const channel: "email" | "sms" = body?.channel ?? "email";

    if (!["YES", "NO", "FRAUD"].includes(choice)) {
      return NextResponse.json(
        { error: "Invalid choice" },
        { status: 400 }
      );
    }

    if (!["email", "sms"].includes(channel)) {
      return NextResponse.json(
        { error: "Invalid delivery channel" },
        { status: 400 }
      );
    }

    const reportId = params.id;

    /* ------------------------------------------------------------------
     * 3. LOAD + AUTHORIZE REPORT
     * ------------------------------------------------------------------ */
    const reportRef = adminDb.collection("reports").doc(reportId);
    const reportDoc = await reportRef.get();

    if (!reportDoc.exists) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const report = reportDoc.data() as any;

    if (report.renterId !== renterId) {
      return NextResponse.json(
        { error: "Unauthorized access to report" },
        { status: 403 }
      );
    }

    if (report.status !== "PENDING_RENTER_ACK") {
      return NextResponse.json(
        { error: "Report is not awaiting acknowledgment" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------------
     * 4. REQUEST METADATA
     * ------------------------------------------------------------------ */
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;

    /* ------------------------------------------------------------------
     * 5. PATH A — YES (LOW RISK, IMMEDIATE)
     * ------------------------------------------------------------------ */
    if (choice === "YES") {
      await reportRef.update({
        status: "OPEN_NO_INCIDENTS",
        renterAck: {
          initialChoice: "YES",
          initiatedAt: FieldValue.serverTimestamp(),
          ip,
          userAgent,
        },
        updatedAt: FieldValue.serverTimestamp(),
      });

      await adminDb.collection("audit_logs").add({
        action: "RENTER_ACK_YES",
        renterId,
        orgId: report.orgId,
        reportId,
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ status: "confirmed" });
    }

    /* ------------------------------------------------------------------
     * 6. PATH B / C — NO or FRAUD (DOUBLE-OPT REQUIRED)
     * ------------------------------------------------------------------ */
    const token = uuidv4();
    const expiresMinutes = choice === "FRAUD" ? 10 : 30;
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + expiresMinutes * 60 * 1000)
    );

    await adminDb.collection("ack_confirmation_tokens").doc(token).set({
      renterId,
      orgId: report.orgId,
      reportId,
      type: choice === "NO" ? "NO_CONFIRMATION" : "FRAUD_CONFIRMATION",
      channel,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
      usedAt: null,
      ip,
      userAgent,
    });

    await reportRef.update({
      status:
        choice === "NO"
          ? "PENDING_NO_CONFIRMATION"
          : "PENDING_FRAUD_CONFIRMATION",
      renterAck: {
        initialChoice: choice,
        initiatedAt: FieldValue.serverTimestamp(),
        ip,
        userAgent,
      },
      updatedAt: FieldValue.serverTimestamp(),
    });

    /* ------------------------------------------------------------------
     * 7. SEND OUT-OF-BAND CONFIRMATION
     * ------------------------------------------------------------------ */
    const email = report.renterEmail ?? null;
    const phone = report.renterPhone ?? null;

    if (channel === "email") {
      if (!email) throw new Error("Renter email not available");
      await sendConfirmationEmail(email, choice, token);
    } else {
      if (!phone) throw new Error("Renter phone not available");
      await sendConfirmationSms(phone, choice, token);
    }

    await adminDb.collection("audit_logs").add({
      action: `RENTER_ACK_${choice}_INITIATED`,
      renterId,
      orgId: report.orgId,
      reportId,
      createdAt: FieldValue.serverTimestamp(),
      context: {
        channel,
        token,
      },
    });

    return NextResponse.json({ status: "pending_confirmation" });
  } catch (e: any) {
    console.error("[ACK_INITIATE_ERROR]", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
