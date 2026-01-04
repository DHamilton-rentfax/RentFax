import { adminDb } from "@/firebase/server";
import { FinalReportSchema } from "./schema";
import { Timestamp } from "firebase-admin/firestore";

export async function submitFinalReport({
  renterId,
  rentalId,
  companyId,
  userId,
  data,
}: {
  renterId: string;
  rentalId: string;
  companyId: string;
  userId: string;
  data: unknown;
}) {
  const parsed = FinalReportSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid report");

  const reportRef = adminDb
    .collection("renters")
    .doc(renterId)
    .collection("reports")
    .doc(rentalId);

  const existing = await reportRef.get();
  if (existing.exists) {
    throw new Error("Final report already exists");
  }

  await reportRef.set({
    finalReport: parsed.data,
    disputeStatus: "none",
    createdByCompanyId: companyId,
    createdByUserId: userId,
    createdAt: Timestamp.now(),
  });
}