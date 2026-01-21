import "server-only";
import { adminDb } from "@/firebase/server";
import { createNotification } from "@/lib/notifications/createNotification";
import { RentalIntentResponse } from "@/types/rentalIntent";

type RespondRentalIntentParams = {
  renterId: string;
  companyId: string;
  response: RentalIntentResponse;
};

export async function respondRentalIntent({
  renterId,
  companyId,
  response,
}: RespondRentalIntentParams) {
  if (!["yes", "no", "fraud"].includes(response)) {
    throw new Error("Invalid response");
  }

  const ref = adminDb
    .collection("rentalIntents")
    .doc(`${renterId}_${companyId}`);

  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error("Rental intent not found");
  }

  if (snap.data()?.response !== "pending") {
    throw new Error("Intent already resolved");
  }

  await ref.update({
    response,
    respondedAt: Date.now(),
  });

  await createNotification({
    renterId,
    companyId,
    companyName: snap.data()!.companyName,
    type: "RENTAL_INTENT_RESPONSE",
    metadata: { response },
  });

  if (response === "fraud") {
    await adminDb.collection("fraudSignals").add({
      renterId,
      companyId,
      type: "RENTAL_INTENT_FRAUD",
      createdAt: Date.now(),
    });
  }
}
