import "server-only";
import { adminDb } from "@/firebase/server";
import { createNotification } from "@/lib/notifications/createNotification";

type CreateRentalIntentParams = {
  renterId: string;
  companyId: string;
  companyName: string;
};

export async function createRentalIntent({
  renterId,
  companyId,
  companyName,
}: CreateRentalIntentParams) {
  const ref = adminDb
    .collection("rentalIntents")
    .doc(`${renterId}_${companyId}`);

  const snap = await ref.get();
  if (snap.exists) return; // idempotent

  await ref.set({
    renterId,
    companyId,
    companyName,
    response: "pending",
    createdAt: Date.now(),
  });

  await createNotification({
    renterId,
    companyId,
    companyName,
    type: "RENTAL_INTENT_REQUEST",
  });
}
