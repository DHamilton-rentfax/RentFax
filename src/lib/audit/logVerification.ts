import { adminDb } from "@/firebase/server";

export async function logVerificationEvent({
  adminId,
  renterEmail,
  verificationId,
  action,
  notes,
}: {
  adminId: string;
  renterEmail: string;
  verificationId: string;
  action: "APPROVED" | "REJECTED";
  notes?: string;
}) {
  await adminDb.collection("auditLogs").add({
    type: "VERIFICATION_REVIEW",
    action,
    adminId,
    renterEmail,
    verificationId,
    notes: notes ?? "",
    createdAt: Date.now(),
  });
}
