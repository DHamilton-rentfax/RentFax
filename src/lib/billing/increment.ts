
import { adminDb } from "@/firebase/server";
import { UsageEvent } from "./usage-types";
import { FieldValue } from "firebase-admin/firestore";

export async function incrementUsage(
  companyId: string,
  event: UsageEvent,
  value: number = 1
) {
  const ref = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsage")
    .doc("today");

  await ref.set(
    {
      [event]: FieldValue.increment(value),
      updatedAt: new Date(),
    },
    { merge: true }
  );
}
