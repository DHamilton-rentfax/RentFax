import { adminDb } from "@/firebase/server";

export async function saveReportMetadata({
  renterId,
  renterName,
}: {
  renterId: string;
  renterName: string;
}) {
  await adminDb.collection("reports").doc(renterId).set({
    renterId,
    renterName,
    createdAt: Date.now(),
  });
}
