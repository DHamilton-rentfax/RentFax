"use server";
import { adminDb } from "@/firebase/server";

export async function createAsset({
  companyId, type, name,
}: { companyId: string; type: "vehicle"|"property"|"equipment"; name: string; }) {
  const ref = adminDb.collection("assets").doc();
  await ref.set({
    assetId: ref.id,
    companyId,
    type,
    name,
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { assetId: ref.id };
}
