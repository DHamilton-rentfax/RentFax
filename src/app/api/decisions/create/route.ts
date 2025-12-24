import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";
import { hasPermission } from "@/lib/support/hasPermission";

// This would be a more complex permission check in a real app
async function getMockPermissions(userId: string) {
    const userRef = adminDb.collection('support_permissions').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) return null;
    return doc.data();
}

export async function POST(req: NextRequest) {
    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 1. Permission Check: Only support admins or higher can make decisions.
    const perms = await getMockPermissions(user.id);
     if (perms?.role !== 'SUPPORT_ADMIN') {
         return NextResponse.json({ error: "Forbidden: You do not have permission to make decisions." }, { status: 403 });
    }

    const body = await req.json();
    const { 
        relatedId, relatedType, outcome, reasonCodes, 
        explanation, aiAssisted, aiSummary, appealEligible, appealDeadline 
    } = body;

    if (!relatedId || !relatedType || !outcome || !reasonCodes || !explanation) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const decisionsRef = adminDb.collection("decision_records");
        const auditLogsRef = adminDb.collection("audit_logs");

        // 2. Versioning: Find the previous version to calculate the next one.
        const prevDecisionSnap = await decisionsRef
            .where("relatedId", "==", relatedId)
            .orderBy("decisionVersion", "desc")
            .limit(1)
            .get();

        const nextVersion = prevDecisionSnap.empty
            ? 1
            : prevDecisionSnap.docs[0].data().decisionVersion + 1;

        // 3. Create the new decision record
        const newDecisionRef = decisionsRef.doc();
        const decisionData = {
            relatedId, relatedType, outcome, reasonCodes, explanation, 
            aiAssisted: aiAssisted || false,
            aiSummary: aiSummary || null,
            appealEligible: appealEligible || false,
            appealDeadline: appealDeadline ? new Date(appealDeadline) : null,
            decisionVersion: nextVersion,
            decidedBy: user.id,
            decidedByRole: perms.role, // Use the role from permissions
            decidedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
        };

        // 4. Update related dispute/incident status and log the event in a transaction
        const relatedRef = adminDb.collection(`${relatedType.toLowerCase()}s`).doc(relatedId);
        const auditLogRef = auditLogsRef.doc();

        await adminDb.runTransaction(async (transaction) => {
            transaction.set(newDecisionRef, decisionData);
            transaction.set(auditLogRef, {
                 eventType: "DECISION_CREATED",
                severity: "info",
                targetCollection: "decision_records",
                targetId: newDecisionRef.id,
                actorId: user.id,
                actorRole: perms.role,
                metadata: { relatedId, outcome, version: nextVersion },
                createdAt: FieldValue.serverTimestamp(),
            });
            // Update the status of the parent dispute/incident
            transaction.update(relatedRef, { status: `DECIDED_${outcome}` });
        });

        // 5. Trigger notifications (implementation would be in a separate service)
        // await createNotification({ ... });

        return NextResponse.json({ success: true, decisionId: newDecisionRef.id, version: nextVersion });

    } catch (error) {
        console.error("Error creating decision record:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
