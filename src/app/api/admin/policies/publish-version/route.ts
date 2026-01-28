import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";

// In a real app, you'd have a robust permission check.
async function isSuperAdmin(userId: string): Promise<boolean> {
    const userPerms = await adminDb.collection('support_permissions').doc(userId).get();
    return userPerms.exists && userPerms.data()?.role === 'SUPER_ADMIN';
}

/**
 * API for SUPER_ADMINs to publish a new version of a policy.
 * This is an immutable action: it creates a new version, it doesn't edit an old one.
 */
export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

    const user = await getOptionalUser(req);
    if (!user || !await isSuperAdmin(user.id)) {
        return NextResponse.json({ error: "Forbidden: Only SUPER_ADMINs can publish policies." }, { status: 403 });
    }

    const body = await req.json();
    const { policyId, versionData } = body;

    if (!policyId || !versionData || !versionData.summary || !versionData.bodyHtml || !versionData.effectiveFrom) {
        return NextResponse.json({ error: "Missing required fields: policyId and versionData" }, { status: 400 });
    }

    try {
        const policyRef = adminDb.collection("policies").doc(policyId);
        const auditLogRef = adminDb.collection("audit_logs").doc();

        await adminDb.runTransaction(async (transaction) => {
            const policyDoc = await transaction.get(policyRef);
            if (!policyDoc.exists) {
                throw new Error("Policy not found");
            }

            const policy = policyDoc.data();
            const newVersionNumber = (policy.latestVersion || 0) + 1;
            const versionId = `${policyId}_v${newVersionNumber}`;

            const newVersionRef = adminDb.collection("policy_versions").doc(versionId);

            // 1. Create the new immutable version document.
            transaction.set(newVersionRef, {
                ...versionData,
                policyId: policyId,
                version: newVersionNumber,
                createdBy: user.id,
                createdAt: FieldValue.serverTimestamp(),
            });

            // 2. Update the parent policy to point to the new latest version.
            transaction.update(policyRef, {
                latestVersion: newVersionNumber,
                updatedAt: FieldValue.serverTimestamp(),
            });

            // 3. Log this critical administrative action.
            transaction.set(auditLogRef, {
                eventType: "POLICY_VERSION_PUBLISHED",
                severity: "critical",
                targetCollection: "policies",
                targetId: policyId,
                actorId: user.id,
                actorRole: "SUPER_ADMIN", 
                metadata: { newVersion: newVersionNumber, versionId: versionId },
                createdAt: FieldValue.serverTimestamp(),
            });
        });

        // You would trigger notifications to support staff here.

        return NextResponse.json({ success: true, newVersion: (policyRef.get() as any).data().latestVersion + 1 });

    } catch (error) {
        console.error("Error publishing policy version:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
