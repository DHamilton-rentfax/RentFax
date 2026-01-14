// src/app/api/admin/compliance/reports/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { getStorage } from "firebase-admin/storage";
import { getUserContext } from "@/app/actions/get-user-context";

/* -------------------------------------------------------------------------- */
/*  POST: Queue a new compliance report                                        */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const ctx = await getUserContext(decoded.uid);

    if (ctx.role !== "SUPER_ADMIN" && ctx.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { reportTypeKey, relatedId, relatedType } = body;

    if (!reportTypeKey) {
      return NextResponse.json(
        { error: "reportTypeKey is required" },
        { status: 400 }
      );
    }

    const reportRef = adminDb.collection("compliance_reports").doc();

    await reportRef.set({
      reportTypeKey,
      relatedId: relatedId ?? null,
      relatedType: relatedType ?? null,
      requestedBy: decoded.uid,
      requesterRole: ctx.role,
      status: "QUEUED",
      createdAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection("audit_logs").add({
      eventType: "COMPLIANCE_REPORT_REQUESTED",
      severity: "info",
      targetCollection: "compliance_reports",
      targetId: reportRef.id,
      actorId: decoded.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Fire-and-forget background generation
    generateReportInBackground(reportRef.id).catch(() => {});

    return NextResponse.json({
      reportId: reportRef.id,
      status: "QUEUED",
    });
  } catch (err) {
    console.error("Compliance report request failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  Background generation (production-safe mock)                               */
/* -------------------------------------------------------------------------- */
async function generateReportInBackground(reportId: string) {
  const reportRef = adminDb.collection("compliance_reports").doc(reportId);

  try {
    await reportRef.update({ status: "GENERATING" });

    const snap = await reportRef.get();
    if (!snap.exists) throw new Error("Report not found");

    const data = snap.data()!;
    const bundle = {
      case: {
        id: data.relatedId,
        summary: "Case summary placeholder",
      },
    };

    const pdfBytes = await createPdf(bundle);

    const bucket = getStorage().bucket();
    const storagePath = `compliance_reports/${reportId}/report.pdf`;

    await bucket.file(storagePath).save(pdfBytes, {
      contentType: "application/pdf",
      resumable: false,
    });

    await reportRef.update({
      status: "READY",
      completedAt: FieldValue.serverTimestamp(),
      generatedFiles: FieldValue.arrayUnion({
        format: "PDF",
        storagePath,
      }),
    });

    await adminDb.collection("audit_logs").add({
      eventType: "COMPLIANCE_REPORT_GENERATED",
      severity: "info",
      targetCollection: "compliance_reports",
      targetId: reportId,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error(`Compliance report ${reportId} failed:`, err);
    await reportRef.update({
      status: "FAILED",
      failedAt: FieldValue.serverTimestamp(),
    });
  }
}

/* -------------------------------------------------------------------------- */
/*  PDF generator                                                              */
/* -------------------------------------------------------------------------- */
async function createPdf(data: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("Compliance Report", {
    x: 50,
    y: 740,
    size: 22,
    font,
  });

  page.drawText(`Case ID: ${data.case.id ?? "N/A"}`, {
    x: 50,
    y: 700,
    size: 12,
    font,
  });

  page.drawText(data.case.summary ?? "", {
    x: 50,
    y: 660,
    size: 11,
    font,
    maxWidth: 500,
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
