import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";
import { hasPermission } from "@/lib/support/hasPermission"; // Assuming you have this helper

// This would ideally be a more robust permission check fetching from Firestore
async function getMockPermissions(userId: string) {
    const userRef = adminDb.collection('support_permissions').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) return null;
    return doc.data();
}


export async function POST(req: NextRequest, { params }: { { params }: { params: { reportNameId: string } } }) {
    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 1. Permission Check
    const perms = await getMockPermissions(user.id);
    // This action could be named something like `canRedactEvidence`
    // For now, we will use canOverrideAI as a proxy for a high-level permission
    if (perms?.role !== 'SUPPORT_ADMIN') {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: evidenceId } = params;
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
        return NextResponse.json({ error: "Missing redaction 'type' and 'data'" }, { status: 400 });
    }

    try {
        const evidenceRef = adminDb.collection("evidence").doc(evidenceId);
        
        const newRedaction = {
            id: `redact_${Date.now()}`,
            type, // "AREA" or "TEXT"
            data, // { x, y, width, height } or { textToMask: "..." }
            createdBy: user.id,
            createdAt: FieldValue.serverTimestamp(),
        };

        // Atomically add the new redaction to the array
        await evidenceRef.update({
            redactions: FieldValue.arrayUnion(newRedaction)
        });

        // Log the audit event
        await adminDb.collection("audit_logs").add({
            eventType: "EVIDENCE_REDACTED",
            severity: "warning", // Redaction is a sensitive action
            targetCollection: "evidence",
            targetId: evidenceId,
            actorId: user.id,
            actorRole: user.role,
            metadata: { redactionId: newRedaction.id, redactionType: type },
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true, redactionId: newRedaction.id });

    } catch (error) {
        console.error("Error redacting evidence:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
