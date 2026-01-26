import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function logAIUsage(params: {
  companyId: string;
  userId?: string;
  action: string;
  model: string;
  estimatedCostUsd: number;
}) {
  await adminDb.collection("ai_audit_logs").add({
    ...params,
    createdAt: FieldValue.serverTimestamp(),
  });
}
