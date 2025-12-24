import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";

// MOCK of generating a signed URL from Firebase Storage
async function getSignedUrl(storagePath: string): Promise<string> {
    console.log(`Generating signed URL for ${storagePath}`);
    // In a real app, this would use the Firebase Admin SDK to create a temporary, secure download URL.
    // e.g., admin.storage().bucket().file(storagePath).getSignedUrl(...)
    return `https://storage.googleapis.com/your-bucket/${storagePath}?signed=true`;
}

async function logAccess(evidenceId: string, user: any, action: "VIEW" | "DOWNLOAD") {
    const accessLogRef = adminDb.collection("evidence_access_logs").doc();
    const auditLogRef = adminDb.collection("audit_logs").doc();

    await adminDb.runTransaction(async (transaction) => {
        transaction.set(accessLogRef, {
            evidenceId,
            accessedBy: user.id,
            role: user.role,
            action,
            // ipAddress: req.ip, // You can get IP from the request in a real environment
            createdAt: FieldValue.serverTimestamp(),
        });
        transaction.set(auditLogRef, {
            eventType: `EVIDENCE_${action}ED`,
            severity: "info",
            targetCollection: "evidence",
            targetId: evidenceId,
            actorId: user.id,
            actorRole: user.role,
            createdAt: FieldValue.serverTimestamp(),
        });
    });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: evidenceId } = params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") === "download" ? "DOWNLOAD" : "VIEW";

    try {
        const evidenceRef = adminDb.collection("evidence").doc(evidenceId);
        const evidenceSnap = await evidenceRef.get();

        if (!evidenceSnap.exists) {
            return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
        }

        const evidence = evidenceSnap.data();
        const userRole = user.role.toLowerCase();

        // 1. Check visibility permissions
        if (!evidence.visibility || !evidence.visibility[userRole]) {
             await adminDb.collection("audit_logs").add({
                eventType: "EVIDENCE_ACCESS_DENIED",
                severity: "warning",
                targetCollection: "evidence",
                targetId: evidenceId,
                actorId: user.id,
                actorRole: user.role,
                metadata: { reason: "Insufficient role visibility" },
                createdAt: FieldValue.serverTimestamp(),
            });
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Log the access event
        await logAccess(evidenceId, user, action);

        // 3. Generate a download URL if requested
        let downloadUrl = null;
        if (action === "DOWNLOAD") {
            downloadUrl = await getSignedUrl(evidence.storagePath);
        }

        return NextResponse.json({ 
            ...evidence, 
            // Ensure timestamps are serializable
            createdAt: evidence.createdAt.toDate().toISOString(), 
            downloadUrl 
        });

    } catch (error) {
        console.error("Error accessing evidence:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
