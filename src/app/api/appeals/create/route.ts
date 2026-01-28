import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { relatedDecisionId, justification, evidenceIds } = body;

    if (!relatedDecisionId || !justification) {
        return NextResponse.json({ error: "Missing required fields: relatedDecisionId and justification" }, { status: 400 });
    }

    try {
        const decisionRef = adminDb.collection("decision_records").doc(relatedDecisionId);
        const decisionSnap = await decisionRef.get();

        if (!decisionSnap.exists) {
            return NextResponse.json({ error: "Decision not found" }, { status: 404 });
        }

        const decision = decisionSnap.data();

        // 1. Check Appeal Eligibility
        if (!decision.appealEligible) {
            return NextResponse.json({ error: "This decision is not eligible for appeal" }, { status: 403 });
        }

        // 2. Check Appeal Deadline
        if (decision.appealDeadline && new Date() > decision.appealDeadline.toDate()) {
            return NextResponse.json({ error: "The deadline for appealing this decision has passed" }, { status: 403 });
        }

        // 3. Create the Appeal Record
        const appealRef = adminDb.collection("appeals").doc();
        const appealData = {
            relatedDecisionId,
            relatedType: decision.relatedType,
            relatedId: decision.relatedId,
            submittedBy: user.id,
            submitterRole: user.role,
            justification,
            evidenceIds: evidenceIds || [],
            status: "SUBMITTED",
            createdAt: FieldValue.serverTimestamp(),
        };

        // 4. Log the event and update statuses in a transaction
        const auditLogRef = adminDb.collection("audit_logs").doc();
        const relatedRef = adminDb.collection(`${decision.relatedType.toLowerCase()}s`).doc(decision.relatedId);

        await adminDb.runTransaction(async (transaction) => {
            transaction.set(appealRef, appealData);
            // Log that the original decision was appealed
            transaction.set(auditLogRef, {
                eventType: "DECISION_APPEALED",
                severity: "warning",
                targetCollection: "decision_records",
                targetId: relatedDecisionId,
                actorId: user.id,
                actorRole: user.role,
                metadata: { appealId: appealRef.id },
                createdAt: FieldValue.serverTimestamp(),
            });
            // Update the parent item to show it is under appeal
            transaction.update(relatedRef, { status: 'UNDER_APPEAL' });
        });

        // In a real app, you would now trigger a notification to the SUPER_ADMIN group.

        return NextResponse.json({ success: true, appealId: appealRef.id });

    } catch (error) {
        console.error("Error submitting appeal:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
