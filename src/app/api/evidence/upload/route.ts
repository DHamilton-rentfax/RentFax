
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { createHash } from "crypto";
import { FieldValue } from "firebase-admin/firestore";

// This is a MOCK of uploading to Firebase Storage.
// In a real app, you'd use the Firebase Admin SDK for Storage.
async function mockUploadToStorage(file: File): Promise<string> {
    const storagePath = `evidence/${Date.now()}-${file.name}`;
    console.log(`Simulating upload of ${file.name} to ${storagePath}`);
    // This is where you would upload the file buffer to a cloud storage bucket.
    return storagePath;
}

export async function POST(req: NextRequest) {
    const user = await getOptionalUser(req);
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const relatedType = formData.get("relatedType") as "INCIDENT" | "DISPUTE";
    const relatedId = formData.get("relatedId") as string;

    if (!file || !relatedType || !relatedId) {
        return NextResponse.json({ error: "Missing required fields: file, relatedType, relatedId" }, { status: 400 });
    }

    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 1. Save file to Storage (mocked) and compute hash
        const [storagePath, hash] = await Promise.all([
            mockUploadToStorage(file),
            createHash("sha256").update(fileBuffer).digest("hex")
        ]);

        // 2. Store metadata in Firestore
        const evidenceRef = adminDb.collection("evidence").doc();
        const evidenceData = {
            relatedType,
            relatedId,
            uploadedBy: user.id,
            uploaderRole: user.role,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            storagePath,
            sha256: hash,
            redactions: [],
            visibility: { // Default visibility should be restrictive, admin can open it up
                renter: true,
                landlord: true,
                support: true,
                superadmin: true,
            },
            createdAt: FieldValue.serverTimestamp(),
        };
        
        // 3. Log the audit event and set the evidence data in a transaction
        const auditLogRef = adminDb.collection("audit_logs").doc();
        
        await adminDb.runTransaction(async (transaction) => {
            transaction.set(evidenceRef, evidenceData);
            transaction.set(auditLogRef, {
                eventType: "EVIDENCE_UPLOADED",
                severity: "info",
                targetCollection: "evidence",
                targetId: evidenceRef.id,
                actorId: user.id,
                actorRole: user.role,
                createdAt: FieldValue.serverTimestamp(),
            });
        });

        return NextResponse.json({ success: true, evidenceId: evidenceRef.id, hash });

    } catch (error) {
        console.error("Error uploading evidence:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
