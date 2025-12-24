import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getStorage } from 'firebase-admin/storage';

// Mock permission check
async function canRequestReport(userId: string, reportTypeKey: string): Promise<boolean> {
    const userPerms = await adminDb.collection('support_permissions').doc(userId).get();
    if (!userPerms.exists) return false;
    
    // In a real system, you would fetch the report_type_definition and check rolesAllowed.
    // For now, we will assume SUPER_ADMIN can do anything.
    return userPerms.data()?.role === 'SUPER_ADMIN';
}

// Main API to queue a new compliance report generation task
export async function POST(req: NextRequest) {
    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { reportTypeKey, relatedId, relatedType } = await req.json();

    if (!reportTypeKey) {
        return NextResponse.json({ error: "`reportTypeKey` is required." }, { status: 400 });
    }

    if (!await canRequestReport(user.id, reportTypeKey)) {
        return NextResponse.json({ error: "You do not have permission to request this report." }, { status: 403 });
    }

    try {
        const newReportRef = adminDb.collection("compliance_reports").doc();
        
        // 1. Create the initial report record in Firestore
        await newReportRef.set({
            reportTypeKey,
            relatedId: relatedId || null,
            relatedType: relatedType || null,
            requestedBy: user.id,
            requesterRole: (await adminDb.collection('support_permissions').doc(user.id).get()).data()?.role || 'user',
            status: "QUEUED",
            createdAt: FieldValue.serverTimestamp(),
        });

        // 2. Log the request event
        await adminDb.collection("audit_logs").add({
            eventType: "COMPLIANCE_REPORT_REQUESTED",
            severity: "info",
            targetCollection: "compliance_reports",
            targetId: newReportRef.id,
            actorId: user.id,
            createdAt: FieldValue.serverTimestamp(),
        });
        
        // 3. Trigger the background generation (mocked here)
        // In a real app, this would be a Cloud Task or Pub/Sub message.
        // For this example, we'll run it directly but asynchronously.
        generateReportInBackground(newReportRef.id);

        return NextResponse.json({ success: true, reportId: newReportRef.id, message: "Report generation has been queued." });

    } catch (error) {
        console.error("Error requesting compliance report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// This function simulates a background Cloud Function/Task
async function generateReportInBackground(reportId: string) {
    const reportRef = adminDb.collection("compliance_reports").doc(reportId);
    try {
        await reportRef.update({ status: "GENERATING" });

        // Mock data fetching
        const reportData = await reportRef.get();
        const { relatedId, reportTypeKey } = reportData.data();

        // In a real scenario, you'd fetch all the data based on `reportTypeKey` includes
        const bundle = {
            case: { id: relatedId, summary: "This is a summary of the case." },
            decisions: [{ version: 1, outcome: 'DENIED', reason: 'INSUFFICIENT_EVIDENCE' }],
            policies: [{ policyId: 'POLICY_123', version: 2, title: 'Evidence Requirements' }],
        };

        // Mock PDF Generation
        const pdfBytes = await createPdf(bundle);
        const storagePath = `compliance_reports/${reportId}/report.pdf`;
        const bucket = getStorage().bucket();
        const file = bucket.file(storagePath);
        await file.save(pdfBytes, { contentType: 'application/pdf' });

        await reportRef.update({
            status: "READY",
            completedAt: FieldValue.serverTimestamp(),
            generatedFiles: FieldValue.arrayUnion({
                format: "PDF",
                storagePath: storagePath,
                sha256: "mock-sha256-hash" // you would calculate this properly
            })
        });

        await adminDb.collection("audit_logs").add({
            eventType: "COMPLIANCE_REPORT_GENERATED",
            severity: "info",
            targetId: reportId,
        });

    } catch (error) {
        console.error(`Failed to generate report ${reportId}:`, error);
        await reportRef.update({ status: "FAILED" });
    }
}

async function createPdf(data: any): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Compliance Report', { x: 50, y: 800, font, size: 24 });
    page.drawText(`Case ID: ${data.case.id}`, { x: 50, y: 750, font, size: 12 });
    // ... add more data to PDF ...

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
